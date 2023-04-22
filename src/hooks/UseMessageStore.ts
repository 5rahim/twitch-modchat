import { useEffect, useMemo, useState } from 'react'
import { ChatMessage } from '../models/ChatMessage'

const MAX_BUFFER = 500
// const MAX_LIFETIME = 60 * 1000;
const SLICE_LEVEL = -Math.abs(MAX_BUFFER - 1)

export const useMessageStore = (afterEffect?: any) => {
   
   const [messages, setMessages] = useState<ChatMessage[]>([])
   
   useEffect(() => {
      afterEffect && afterEffect()
   }, [messages])
   
   const actions = useMemo(
      () => ({
         shift() {
            // if (messages.length > 0 && messages.length > 100) {
            //    const arr = messages
            //    arr.shift()
            //    setMessages(arr)
            // }
         },
         getMessages() {
            return messages
         },
         addMessage(message: ChatMessage) {
            setMessages((messages) => {
               
               // console.log(message)
               return [...messages, message]
            })
         },
         timeoutUser(login: string) {
         
         },
         deleteMessage(id: string) {
         
         },
      }),
      [messages],
   )
   
   return actions
   
}
