import React, { memo }                           from 'react'
import { ChatMode }                              from './ChatMode'
import { UseTwitchApiProps, useTwitchApi }       from '../../hooks/UseAPI'
import { BiAlarm, BiBadgeCheck, BiCctv, BiCool } from 'react-icons/all'

export const ChatModes: React.FC<any> = memo((props) => {
   
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   
   return (
      <div className='stream-option-dropdown'>
         <ul>
            {(chatClient && channel) && (
               <>
                  <ChatMode type={'follow'}>Follow delay</ChatMode>
                  <ChatMode type={'slow'}><BiAlarm /> Slow mode</ChatMode>
                  <ChatMode type={'sub'}><BiBadgeCheck /> Subscriber-only mode</ChatMode>
                  <ChatMode type={'emote'}><BiCool /> Emote-only mode</ChatMode>
                  <ChatMode type={'r9k'}><BiCctv /> R9K</ChatMode>
               </>
            )}
         </ul>
      </div>
   )
   
})
