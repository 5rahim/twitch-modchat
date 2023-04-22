import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'


export interface TwitchAPIBadgeVersion {
   image_url_1x: string;
}

export interface TwitchAPIBadgeSet {
   versions: Record<string, TwitchAPIBadgeVersion>;
}

export interface TwitchAPIBadgeResponse {
   badge_sets: Record<string, TwitchAPIBadgeSet>;
}

type BadgeResponses = [
   TwitchAPIBadgeResponse,
   TwitchAPIBadgeResponse,
];

export function useChatBadges(channelID: string): BadgeResponses {
   const [
      globalBadges,
      setGlobalBadges,
   ] = useState<TwitchAPIBadgeResponse>({badge_sets: {}});
   const [
      channelBadges,
      setChannelBadges,
   ] = useState<TwitchAPIBadgeResponse>({
      badge_sets: {},
   });
   const resp = useMemo<BadgeResponses>(
      () => [channelBadges, globalBadges],
      [channelBadges, globalBadges],
   );
   
   useEffect(() => {
      axios
         .get<TwitchAPIBadgeResponse>(
            "https://badges.twitch.tv/v1/badges/global/display?language=en",
         )
         .then((res) => setGlobalBadges(res.data))
         .catch((err) =>
            console.error("Failed to get global badges", err),
         );
   }, []);
   
   useEffect(() => {
      if(channelID) {
         axios
            .get<TwitchAPIBadgeResponse>(
               `https://badges.twitch.tv/v1/badges/channels/${encodeURIComponent(
                  channelID,
               )}/display?language=en`,
            )
            .then((res) => setChannelBadges(res.data))
            .catch((err) => console.error("Failed to get badges", err));
      }
   }, [channelID]);
   
   return resp;
}
