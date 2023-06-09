import { useEffect, useState }      from 'react'
import { ChatClient }               from 'twitch-chat-client'
import { ApiClient }                from 'twitch'
import { useDispatch, useSelector } from '../store'
import { CredentialSelectors }      from '../store/slices/CredentialSlice'
import { AppActions }               from '../store/slices/AppSlice'
import { TwitchConnection }         from '../utils/TwitchConnection'
import { useTwitchApi }             from './UseAPI'

export interface TwitchConnectionProps {
   chatClient: ChatClient | null
   twitchClient: ApiClient | null
}

export const useTwitchConnection = () => {
   
   const [connection, setConnection] = useState<TwitchConnection | null>(null)
   
   const credentials = useSelector(CredentialSelectors.credentials)
   const { establishConnection } = useTwitchApi()
   
   // const dispatch = useDispatch()
   
   useEffect(() => {
      if (connection !== null) {
         connection.connect()
         establishConnection({ twitchClient: connection.getTwitchClient(), chatClient: connection.getChatClient() })
         //dispatch(AppActions.establishConnection({ twitchClient: connection.getTwitchClient(), chatClient: connection.getChatClient() }))
      }
      
      // return () => {
      //    connection?.disconnect()
      // }
      
   }, [connection])
   
   useEffect(() => {
   
      if (Object.keys(credentials).length !== 0) {
         setConnection(new TwitchConnection(credentials))
      }
      
      return () => {
         connection?.disconnect()
         setConnection(new TwitchConnection(credentials))
      }
      
   }, [credentials])
   
}
