import { useThirdPartyEmotes } from './UseThirdPartyEmotes'
import { useMemo } from 'react'
import { ChatMessage } from '../models/ChatMessage'
import { MessageParser } from './MessageParser'

export function useMessageContent(message: ChatMessage) {
   const {
      bttvGlobalEmotes,
      bttvUserEmotes,
      ffzGlobalEmotes,
      ffzUserEmotes,
   } = useThirdPartyEmotes()
   
   const emoteMap = useMemo(
      () => ({
         ...bttvGlobalEmotes,
         ...ffzGlobalEmotes,
         ...ffzUserEmotes,
         ...bttvUserEmotes,
      }),
      [
         bttvGlobalEmotes,
         bttvUserEmotes,
         ffzGlobalEmotes,
         ffzUserEmotes,
      ],
   )
   
   return MessageParser.parseThirdPartyEmotes(
      emoteMap,
      MessageParser.parseEmotes(message),
   )
}
