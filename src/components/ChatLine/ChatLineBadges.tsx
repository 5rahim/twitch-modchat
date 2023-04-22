import { TwitchAPIBadgeResponse } from '../../hooks/UseChatBadges'
import { ChatBadge } from '../../models/ChatBadge'
import React from 'react'

interface Props {
   channelBadges: TwitchAPIBadgeResponse;
   globalBadges: TwitchAPIBadgeResponse;
   badges: ChatBadge[]
}

export const ChatLineBadges: React.FunctionComponent<Props> = (
   props: Props,
) => {
   return (
      <span className="chat-line-badges">
      {props.badges.map((badge) => {
         const badgeSrc =
            props.channelBadges.badge_sets[badge.name]?.versions[
               badge.version
               ]?.image_url_1x ||
            props.globalBadges.badge_sets[badge.name]?.versions[
               badge.version
               ]?.image_url_1x ||
            ""
         if (!badgeSrc) return null
         return (
            <span key={badge.name}>
            <img
               className="chat-line-badges-image"
               alt={badge.name}
               src={badgeSrc}
            />
          </span>
         )
      })}
    </span>
   )
}
