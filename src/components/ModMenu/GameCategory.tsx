import React, { useEffect, useState } from 'react'
import { useTwitchApi, UseTwitchApiProps } from '../../hooks/UseAPI'
import { useSelector } from '../../store'
import { SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'

export const GameCategory = () => {
   
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   const games = useSelector(SettingsSelectors.games)
   
   const [rawCommand, setRawCommand] = useState<string | null>(null)
   
   useEffect(() => {
      if(chatClient && channel && rawCommand) {
         console.log(rawCommand)
         chatClient.say(channel, rawCommand)
         setRawCommand(null)
      }
   }, [chatClient, channel, rawCommand])
   
   function sendRawCommand(game: string) {
      setRawCommand(`!setgame ${game}`)
   }
   
   return (
      <div className={'choice-dropdown'} style={{ paddingBottom: 0 }}>
         <div className={'choice-title'} style={{ color: '#aa438b' }}>Game/Category</div>
   
         <ul>
            {games?.map((game: string, index: number) => {
               return <li key={index} className="choice-dropdown-item" onClick={() => sendRawCommand(game)}>
                  {game}
               </li>
            })}
         </ul>
         
      </div>
   )
   
}
