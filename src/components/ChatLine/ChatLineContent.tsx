import { ChatMessage } from '../../models/ChatMessage'
import React, { memo } from 'react'
import { useMessageContent } from '../../hooks/UseMessageContent'
import { ChatLineBadges } from './ChatLineBadges'
import { TwitchAPIBadgeResponse } from '../../hooks/UseChatBadges'
import { ColorCorrection } from '../../utils/ColorCorrection'

interface ChatContentProps {
   data: ChatMessage
   badges: { channelBadges: TwitchAPIBadgeResponse, globalBadges: TwitchAPIBadgeResponse }
   selectUser: any
}

const colorCorrector = new ColorCorrection()

export const ChatContent: React.FC<ChatContentProps> = memo((
   {
      data,
      badges,
      selectUser
   }: ChatContentProps,
) => {
   
   const { channelBadges, globalBadges } = badges
   
   const { userMessage } = data
   
   const { isAction, user } = userMessage
   
   const content = useMessageContent(data)
   
   const color = user?.color ? colorCorrector.calculate(user.color) : "grey"
   
   
   return (
      <div className="chat-line-content">
         
         {userMessage.badges.length > 0 && (
            <ChatLineBadges
               channelBadges={channelBadges}
               globalBadges={globalBadges}
               badges={userMessage.badges}
            />
         )}
         
         <span className="chat-line-username" onDoubleClick={() => selectUser(user?.username)} style={{ color: color, fontWeight: 600 }}>
            {user?.displayName}
            {!isAction ? ": " : " "}
         </span>
         
         <span style={{ color: isAction ? color : '#efefef' }}>{content}</span>
      
      </div>
   )
   
})
