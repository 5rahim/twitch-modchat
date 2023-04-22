import { useEffect, useState }   from 'react'
import { HelixStream }           from 'twitch'
import axios                     from 'axios'
import { TwitchConnectionProps } from './UseTwitchConnection'
import { useSelector }           from '../store'
import { CredentialSelectors }   from '../store/slices/CredentialSlice'
import { Dict }                  from '../utils/Dict'

/**
 * Hook to fetch stream data
 */
export const useStreamInfo = ({ twitchClient, chatClient }: TwitchConnectionProps) => {
   
   const channel = useSelector(CredentialSelectors.channel)
   
   const [stream, setStream] = useState<HelixStream | null>(null)
   const [isLive, setIsLive] = useState<boolean>(true)
   const [viewers, setViewers] = useState<Dict>({})
   const [allViewers, setAllViewers] = useState<Dict>({})
   const [isLoading, setIsLoading] = useState<boolean>(true)
   const [uptime, setUptime] = useState<string | null>(null)
   const [followDelay, setFollowDelay] = useState<string | null>(null)
   
   const fetchData = async () => {
    if(twitchClient) {
       try {
          console.log('[Fetching stream]')
          const stream: HelixStream | null = await twitchClient?.helix?.streams?.getStreamByUserName(channel)
          console.log('[Stream fetched]')
          const chatters: any = await axios.get(`https://tmi.twitch.tv/group/user/${channel}/chatters`)
      
          setViewers(chatters.data.chatters.viewers)
          setAllViewers(chatters.data.chatters)
          setStream(stream)
          setIsLive(stream !== null)
          setIsLoading(false)
      
          // Uptime
          if (stream) {
             const milliseconds = Math.abs(stream.startDate.getTime() - new Date(Date.now()).getTime())
             const hours = Math.floor(milliseconds / 36e5)
             const minutes = Math.floor(((milliseconds % 36e5) / 6e4))
             setUptime(hours + 'h ' + minutes + 'm')
          }
      
       } catch (e) {
          console.error(e)
       }
    }
   }
   
   useEffect(() => {
      if (twitchClient && chatClient && channel) {
         
         // Set follow delay & slow mode status
         chatClient.onNamedMessage('ROOMSTATE', (msg) => {
            setFollowDelay(Number(msg.tags.get('followers-only')) + 'm')
         })
         
         fetchData()
         
         // Fetch stream data every 1 minute
         setInterval(() => {
            fetchData()
         }, 60000)
      }
   }, [twitchClient, chatClient])
   
   return { stream, uptime, isLive, isLoading, viewers, allViewers, followDelay, fetchData }
   
}
