import React, { ChangeEvent, useEffect, useState } from 'react'
import { Header }                                  from '../Header'
import { VariableSizeList as List }                from 'react-window'
import AutoSizer                                   from "react-virtualized-auto-sizer"
import { UserItem }                                from './UserItem'
import { Loader }                                  from '../Loader'
import { useTwitchApi }                            from '../../hooks/UseAPI'
import { useStreamInfo }                           from '../../hooks/UseStreamInfo'
import '../../styles/Window.scss'
import '../../styles/UserList.scss'
import '../../styles/Form.scss'


export const UserList: React.FC = () => {
   
   const { chatClient, twitchClient } = useTwitchApi()
   const [chatters, setChatters] = useState<string[]>([])
   const [isSearching, setIsSearching] = useState<boolean>(false)
   const [username, setUsername] = useState<string>('')
   const [results, setResults] = useState<string[]>([])
   
   const { allViewers, fetchData } = useStreamInfo({ twitchClient, chatClient })
   
   useEffect(() => {
      if (!!allViewers && allViewers.broadcaster && allViewers.moderators && allViewers.vips && allViewers.viewers) {
         setChatters([...allViewers.broadcaster, ...allViewers.moderators, ...allViewers.vips, ...allViewers.viewers])
      }
   }, [allViewers])
   
   const Row = ({ index, style }: any) => {
      return <UserItem key={index} style={style}>{allViewers.viewers[index]}</UserItem>
   }
   
   // useEffect(() => {
   //    const electron = window.require('electron')
   //    electron.ipcRenderer.on('refresh-since-user-logged-in', () => {
   //       console.log('fetch data')
   //       fetchData()
   //    })
   // }, [])
   
   const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setUsername(val)
      setIsSearching(val.length > 0)
      const results = chatters?.filter((user, index) => user.includes(val.toLowerCase()))
      setResults(results.slice(0, 50))
   }
   
   function renderViewers(array: string[] | undefined | null) {
      if (array) {
         return (array.length > 0) ?
            array?.map((user: any) => {
               return <UserItem key={user}>{user}</UserItem>
            })
            : <span style={{ fontStyle: 'italic', opacity: '0.5' }}>None</span>
      } else
         return <Loader />
   }
   
   
   return (
      <div className={'window-wrapper'}>
         <Header title={'User List'} window={'userList'} noMaximization noMinimization whiteHeader />
         
         <div className={'user-list'}>
            
            <div className="field">
               <input type="text" placeholder='Search user' value={username} onChange={onInputChange} />
            </div>
            
            {
               !isSearching ? (
                  <div className="user-list-content">
                     <ul>
                        {
                           !!allViewers && (
                              <>
                                 <li className={'user-list-header'}>Broadcaster</li>
                                 {
                                    renderViewers(allViewers.broadcaster)
                                 }
                                 <li className={'user-list-header'}>Moderators</li>
                                 {
                                    renderViewers(allViewers.moderators)
                                 }
                                 <li className={'user-list-header'}>VIPs</li>
                                 {
                                    renderViewers(allViewers.vips)
                                 }
                                 <li className={'user-list-header'}>Viewers</li>
                                 {
                                    allViewers?.viewers?.length > 0 ?
                                       <AutoSizer>
                                          {({ height, width }) => (
                                             <List
                                                className="List"
                                                height={300}
                                                itemCount={allViewers?.viewers?.length}
                                                itemSize={() => 20}
                                                width={width}
                                             >
                                                {Row}
                                             </List>
                                          )}
                                       </AutoSizer>
                                       : <Loader />
                                 }
                              </>
                           )
                        }
                     </ul>
                  </div>
               ) : (
                  <div className={'user-list-content'}>
                     <ul>
                        {
                           (results.length > 0) && results.map((user: any) => {
                              return <UserItem key={user}>{user}</UserItem>
                           })
                        }
                     </ul>
                  </div>
               )
            }
         </div>
      </div>
   )
   
}
