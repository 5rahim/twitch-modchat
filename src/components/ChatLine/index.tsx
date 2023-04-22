import React, { memo } from 'react'
import { ChatMessage } from '../../models/ChatMessage'
import { ChatContent } from './ChatLineContent'
import { TwitchAPIBadgeResponse } from '../../hooks/UseChatBadges'

interface ChatLineProps {
   index: number
   style?: any
   data: ChatMessage
   badges: { channelBadges: TwitchAPIBadgeResponse, globalBadges: TwitchAPIBadgeResponse }
   selectUser: any
}

export const ChatLine: React.FC<ChatLineProps> = memo(({ index, selectUser, style, data, badges }: ChatLineProps) => {
   
   if (data?.type == "user-message") {
      return data.userMessage.highlight.isHighlighted ?
         <li className="chat-line-wrap">
            <div
               className="chat-line chat-line-highlighted"
               style={{ backgroundColor: data.userMessage.highlight.color, ...style }}
               data-hl-color={data.userMessage.highlight.color}
            >
               <ChatContent selectUser={selectUser} data={data} badges={badges} />
            </div>
         </li>
         :
         <li className="chat-line-wrap">
            <div className="chat-line" style={{ backgroundColor: (index % 2 == 0 ? '#171717': 'transparent'), ...style }}>
               <ChatContent selectUser={selectUser} data={data} badges={badges} />
            </div>
         </li>
   }
   
   return <></>
   
})

