import React, { memo, useEffect } from 'react'
import { Header } from '../components/Header'
import AutoSizer from 'react-virtualized-auto-sizer'
import { app } from '../constants/app'
import '../styles/Chat.scss'
import '../styles/StreamInfo.scss'
import { useSelector } from '../store'
import { CredentialSelectors } from '../store/slices/CredentialSlice'
import { SettingsSelectors } from '../store/slices/SettingsSlice'
import { AppSelectors } from '../store/slices/AppSlice'
import { useTwitchApi } from '../hooks/UseAPI'
import { useStreamInfo } from '../hooks/UseStreamInfo'
import { ChatBox } from '../components/ChatBox'
import { StreamOptions } from './StreamOptions'
import { UserProfile } from '../components/UserProfile'
import { Settings } from './Settings'
import { ThirdPartyEmotesProvider } from '../contexts/third-party-emotes'
import { ChatRoot } from '../components/ChatRoot'

export const ModChat: React.FC<any> = memo(() => {
   
   const channel = useSelector(CredentialSelectors.channel)
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   const showSettingsWindow = useSelector(AppSelectors.showSettingsWindow)
   
   const { chatClient, twitchClient, channelID } = useTwitchApi()
   
   const { stream, isLive, viewers, isLoading, uptime } = useStreamInfo({ twitchClient, chatClient })
   
   // useEffect(() => {
   //    if (chatClient) {
   //       chatClient.onMessage((channel: any, user: any, message: any) => {
   //          if (message === '!ping') {
   //             chatClient.say(channel, 'Pong!')
   //          } else if (message === '!dice') {
   //             const diceRoll = Math.floor(Math.random() * 6) + 1
   //             chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
   //          }
   //       })
   //    }
   // }, [chatClient])
   
   /**
    * Stream Info
    * @returns {JSX.Element | string}
    */
   function info() {
      if (!isLoading && isLive)
         return <span><strong>{stream?.userDisplayName}</strong> <span className={'live-signal'} /> {uptime} - {stream?.viewers}</span>
      else if (!isLive)
         return <span><strong>{channel}</strong> - {viewers.length} offline viewers</span>
      else
         return 'Loading...'
   }
   
   return (
      <>
         <Header title={app.name} window={'main'} settingCog />
         <div className="content-wrapper">
            
            
            <div className="stream-info">
               {info()}
               <StreamOptions />
            </div>
            
            {showSettingsWindow && <Settings />}
            
            {/*<div style={{ display: !showPopupProfile ? 'block' : 'none' }}>*/}
            {/*</div>*/}
            {!showPopupProfile && <UserProfile />}
            
            <div className="chat-content">
               
               <ThirdPartyEmotesProvider channelId={channelID}>
                  
                  <div className="chat-wrapper">
                     <AutoSizer>
                        {({ height, width }) => (
                           <ChatRoot height={height} width={width} />
                        )}
                     </AutoSizer>
                  </div>
                  
                  <ChatBox />
               </ThirdPartyEmotesProvider>
            
            </div>
         
         </div>
      </>
   )
   
})
