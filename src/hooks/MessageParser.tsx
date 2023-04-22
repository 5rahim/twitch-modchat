import { EmoteMap } from '../contexts/third-party-emotes'
import React from 'react'
import { ChatMessage } from '../models/ChatMessage'
import { ChatLineEmote } from '../components/ChatLine/ChatLineEmote'
import { nanoid } from 'nanoid'

export class MessageParser {
   public static parseThirdPartyEmotes(
      emotes: EmoteMap,
      splits: React.ReactNode[],
   ) {
      const res: React.ReactNode[] = []
      const _matchWord = (word: string): React.ReactNode => {
         const emote = emotes[word]
         if (emote) {
            return (
               <ChatLineEmote key={emote.id + nanoid(5)} name={emote.name} url={emote.imageUrl} />
            )
         }
         return word
      }
      
      let buffer = ""
      for (let i = 0; i < splits.length; ++i) {
         const char = splits[i]
         if (!char) continue
         
         if (char === " ") {
            res.push(_matchWord(buffer))
            res.push(" ")
            buffer = ""
         } else if (typeof char === "object") {
            res.push(char)
            buffer = ""
            continue
         } else {
            buffer += char
         }
      }
      
      buffer && res.push(_matchWord(buffer))
      
      return res
   }
   
   public static parseEmotes(message: ChatMessage) {
      // @ts-ignore
      const split: React.ReactNode[] = Array.from(message.userMessage.content)
      for (let i = 0; i < message.userMessage.emotes.length; ++i) {
         const emote = message.userMessage.emotes[i]
         for (let j = 0; j < emote.placements.length; ++j) {
            const placement = emote.placements[j]
            const name = split.slice(placement.start, placement.end + 1)
            split[placement.start] = (
               <ChatLineEmote
                  key={emote.id + message.userMessage.user?.id + nanoid(5)}
                  name={name.join("")}
                  url={`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`}
               />
            )
            
            for (let k = placement.start + 1; k <= placement.end; ++k) {
               split[k] = null
            }
         }
      }
      
      return split
   }
   
}
