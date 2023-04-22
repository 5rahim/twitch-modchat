import { useEffect } from 'react'
import { ChatMessage } from '../models/ChatMessage'
import { useTwitchApi } from './UseAPI'
import { useSelector } from '../store'
import { SettingsSelectors } from '../store/slices/SettingsSlice'
import Gettc from '../services/Gettc'

interface HookCallbacks {
   onAnyMessage?(): void
   onUserMessage?(message: ChatMessage): void
   onBacklogMessage?(message: ChatMessage): void
}

export const useMessageListener = (callbacks: HookCallbacks) => {
   
   const { channel, channelID, chatClient } = useTwitchApi()
   const settings = useSelector(SettingsSelectors.settings)
   
   
   /**
    * Get user messages
    */
   useEffect(() => {
      
         const messageListener = chatClient?.onMessage((channel, user, message, msg) => {
            callbacks.onUserMessage && callbacks.onUserMessage(new ChatMessage('user-message', msg, settings))
            callbacks.onAnyMessage && callbacks.onAnyMessage()
         })
         const actionListener = chatClient?.onAction((channel, user, message, msg) => {
            callbacks.onUserMessage && callbacks.onUserMessage(new ChatMessage('user-message', msg, settings))
            callbacks.onAnyMessage && callbacks.onAnyMessage()
         })
      
      
      return () => {
         messageListener && chatClient?.removeListener(messageListener)
         actionListener && chatClient?.removeListener(actionListener)
      }
   }, [chatClient, channelID, settings])
   
   
   /**
    * Get backlog
    */
   useEffect(() => {
      
      async function fetch() {
         if (channel && settings) {
            const backlog = await Gettc.getBacklog(channel)
            backlog?.data?.map((data: any) => {
               callbacks.onBacklogMessage && callbacks.onBacklogMessage(new ChatMessage('user-backlog-message', data, settings))
               callbacks.onAnyMessage && callbacks.onAnyMessage()
            })
         }
      }
      
      fetch()
   }, [channel, settings])

}
