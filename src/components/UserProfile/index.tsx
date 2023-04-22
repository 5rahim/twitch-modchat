import React, { memo, useEffect, useState } from 'react'
import { HelixFollow, HelixUser, User } from 'twitch'
import Draggable from 'react-draggable'
import { BiBlock, BiBookmark, BiChevronDown, BiChevronUp, BiCommentCheck, BiX } from 'react-icons/all'
import IvrService from '../../services/IvrService'
import { Loader } from '../Loader'
import classNames from 'classnames'
import UserService from '../../services/UserService'
import Debug from '../../helpers/Debug'
import { useDispatch, useSelector } from '../../store'
import { SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useTwitchApi } from '../../hooks/UseAPI'
import { useToggle } from '../../hooks/UseToggle'
import { useSelectedUser } from '../../hooks/UseSelectedUser'
import { CopyButton } from '../CopyButton'
import '../../styles/UserProfile.scss'
import { AppActions, AppSelectors } from '../../store/slices/AppSlice'

const { shell } = window.require('electron')


export const UserProfile: React.FC = memo(() => {
   const dispatch = useDispatch()
   
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   const timeouts = useSelector(SettingsSelectors.timeouts)
   const bookmarks = useSelector(AppSelectors.bookmarks)
   
   const { twitchClient, chatClient, channel } = useTwitchApi()
   
   const [currentBookmarks, setCurrentBookmarks] = useState<HelixUser[]>([])
   const [rawTimeout, setRawTimeout] = useState<string | null>(null)
   
   const [data, setData] = useState<{
      followDate?: string,
      creationDate?: string,
      isSock?: boolean,
      twoMonthActive?: any,
      tenDayActive?: any,
      justFollowed?: any,
      newAccount?: any
   }>({})
   const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
   
   const [logsOpened, toggleLogs] = useToggle(showPopupProfile)
   const [profilePosition] = useState<any>({ x: 0, y: 0 })
   
   const { user, unselectUser } = useSelectedUser({
      onUnselected: () => {
         setData({})
         setSubscriptionStatus(null)
      },
   })
   
   function setNewBookmark(user: HelixUser | null | undefined) {
      if (user) {
         let alreadyThere = false
         currentBookmarks.map((u: HelixUser) => {
            if (user.displayName === u.displayName) {
               alreadyThere = true
            }
         })
         
         if (alreadyThere) {
            return setCurrentBookmarks(currentBookmarks.filter((u) => u.displayName !== user.displayName))
         }
         return setCurrentBookmarks([user, ...currentBookmarks])
      }
   }
   
   useEffect(() => {
      const newArr = currentBookmarks
      if (currentBookmarks.length > 5) {
         newArr.pop()
      }
      dispatch(AppActions.setBookmarks(newArr))
      setCurrentBookmarks(newArr)
   }, [currentBookmarks])
   
   useEffect(() => {
      
      async function fetchData() {
         if (!!channel && !!user) {
            
            const ch: HelixUser | null | undefined = await twitchClient?.helix?.users?.getUserByName(channel)
            
            if (!!ch) {
               
               const follow: HelixFollow | null | undefined = await user.getFollowTo(ch.id)
               const krakenUser: User | null | undefined = await twitchClient?.kraken.users.getUserByName(user.name)
               
               const creationDate = krakenUser?.creationDate
               const followDate = follow?.followDate
               
               setData({
                  creationDate: UserService.getCreationStatus(creationDate),
                  followDate: UserService.getFollowStatus(followDate),
                  isSock: UserService.isSock(creationDate, followDate),
                  twoMonthActive: UserService.isLessThanTwoMonthActive(followDate),
                  tenDayActive: UserService.isLessThanTenDayActive(followDate),
                  justFollowed: UserService.justFollowed(followDate),
               })
               
               // Store subscription status in another state since the API call is relatively slow
               setSubscriptionStatus(await IvrService.getSubscriptionStatus(user, channel))
            }
         }
      }
      
      try {
         fetchData()
      } catch (e) {
         Debug('error', `Couldn't fetch user profile data`)
      }
   }, [user, channel])
   
   function closeProfile() {
      showPopupProfile && window.require('electron').ipcRenderer.send("close-profile")
      unselectUser()
   }
   
   function onDragStop(e: any, position: any) {
      if (position.y === -100) {
         closeProfile()
      } else if (position.y === 20) {
         toggleLogs()
      }
   }
   
   function selectUser(u: HelixUser) {
      if (u) {
         const electron = window.require('electron')
         electron.ipcRenderer.send("select-user", { user: u.name })
         electron.ipcRenderer.send("open-profile", { user: u.name })
      }
      
   }
   
   function sendTimeout(duration: string) {
      if (user) {
         setRawTimeout(`/timeout ${user?.name} ${duration}`)
      }
   }
   
   useEffect(() => {
      if (rawTimeout && chatClient && channel) {
         console.log(rawTimeout)
         chatClient.say(channel, rawTimeout)
         setRawTimeout(null)
      }
   }, [chatClient, channel, rawTimeout])
   
   return (
      <div style={{ display: (showPopupProfile) ? 'block' : ((user) ? 'block' : 'none') }}>
         
         <Draggable position={profilePosition} bounds={{ top: -100, bottom: 20 }} axis="y" onStop={onDragStop} disabled={showPopupProfile}>
            
            <div className={classNames('user-profile', {
               isPopup: showPopupProfile,
            })}>
               
               {showPopupProfile && <div className="user-profile-drag" />}
               
               <div className="user-profile-bookmarks">
                  <ul>
                     {bookmarks?.map(((u: HelixUser) => {
                        return <li key={u.displayName} onClick={() => selectUser(u)} className={`${u.displayName === user?.displayName ? `active` : ``}`}>{u.displayName}</li>
                     }))}
                  </ul>
               </div>
               
               {/*Close Button*/}
               <div className="user-profile-close" onClick={closeProfile}><BiX /></div>
               
               {/*Bookmark*/}
               <div className={`user-profile-bookmark ${bookmarks?.filter((u: HelixUser) => u.displayName === user?.displayName).length > 0 ? `active` : ``}`} onClick={() => setNewBookmark(user)}>
                  <BiBookmark /></div>
               
               <div className="user-profile-content">
                  
                  {/*Head*/}
                  <div className="user-profile-info">
                     
                     <div className="user-profile-picture-wrapper">
                        {user?.profilePictureUrl ? <img src={user?.profilePictureUrl} alt="" className="user-profile-picture" /> :
                           <div style={{ width: '60px', height: '60px' }} />}
                     </div>
                     
                     <div className="user-profile-meta">
                        <ul>
                           
                           <li className="user-profile-name" onClick={() => shell.openExternal(`https://www.twitch.tv/popout/${channel}/viewercard/${user?.name}`)}>
                              <strong>{user?.displayName}</strong></li>
                           {user?.displayName && <span style={{ marginLeft: '10px' }}><CopyButton text={user.displayName} /></span>}
                           
                           {/* If data finished loading */}
                           {data.creationDate ? (
                              <>
                                 <li>{data.creationDate}</li>
                                 
                                 <li>{data.followDate === 'Not following' ?
                                    <span style={{ fontStyle: 'italic', opacity: .5 }}>Not following</span> : data.followDate}</li>
                                 
                                 <li>
                                    {(subscriptionStatus)
                                       ? (subscriptionStatus === 'Not subscribed') ?
                                          <span style={{ fontStyle: 'italic', opacity: .5 }}>Not subscribed</span> : subscriptionStatus
                                       : <Loader size={5} />}
                                 </li>
                                 
                                 <li className="user-profile-tips">
                                    <ul>
                                       {data?.isSock && <li>Sock account</li>}
                                       {data?.justFollowed && <li>Just followed</li>}
                                       {(data?.twoMonthActive && !data?.tenDayActive && !data.justFollowed) &&
                                       <li className="warning">Less than 2 months</li>}
                                       {(data?.tenDayActive && !data.justFollowed) && <li>Less than 10 days</li>}
                                    </ul>
                                 </li>
                              </>
                           ) : <div><Loader /></div>
                           }
                        </ul>
                     </div>
                     
                     <div className="user-profile-head-actions">
                        <ul>
                           <li className="unban" onClick={() => setRawTimeout(`/untimeout ${user?.name}`)}>
                              <BiCommentCheck />
                           </li>
                           <li className="unban" onClick={() => setRawTimeout(`/unban ${user?.name}`)}>
                              <BiBlock />
                           </li>
                           <li onClick={() => setRawTimeout(`/ban ${user?.name}`)}>
                              <BiBlock />
                           </li>
                        </ul>
                     </div>
                  
                  </div>
                  
                  {/*Actions*/}
                  <div className="user-profile-actions">
                     <div className="user-profile-actions-box">
                        <div className="user-profile-actions-content">
                           <ul>
                              {timeouts?.map((timeout: string) => {
                                 return <li key={timeout} onClick={() => sendTimeout(timeout)}>{timeout}</li>
                              })}
                           </ul>
                        </div>
                     </div>
                  </div>
                  
                  {/*Logs*/}
                  <div className="user-profile-logs">
                     <div className="user-profile-logs-box" style={{ display: (logsOpened) ? 'block' : 'none' }}>
                        <div className="user-profile-logs-content">
                        
                        </div>
                     </div>
                     {!showPopupProfile && (
                        <div className="user-profile-logs-button" onClick={toggleLogs}>
                           {logsOpened ? <BiChevronUp /> : <BiChevronDown />}
                        </div>
                     )}
                  </div>
               
               </div>
            </div>
         </Draggable>
      </div>
   )
   
})
