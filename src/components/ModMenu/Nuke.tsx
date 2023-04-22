import React, { useEffect, useState } from 'react'
import { useTwitchApi, UseTwitchApiProps } from '../../hooks/UseAPI'
import { useForm } from 'react-hook-form'
import { useSelector } from '../../store'
import { SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { Cell } from '../Settings/Cell'

export const Nuke = () => {
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   const nukes = useSelector(SettingsSelectors.nukes)
   
   const [rawNuke, setRawNuke] = useState<string | null>(null)
   
   const { register, errors, handleSubmit, setValue } = useForm({
      defaultValues: {
         msg: '',
         rad: '5m',
         reach: '1m',
         duration: '1m',
      },
   })
   
   useEffect(() => {
      if(chatClient && channel && rawNuke) {
         chatClient.say(channel, rawNuke)
         setRawNuke(null)
      }
   }, [chatClient, channel, rawNuke])
   
   function setNuke(nuke: any) {
      if(nuke) {
         // setRawNuke(`!nuke ${nuke.pattern} ${nuke.radiation ? `-r=${nuke.radiationLength}`: ''} ${nuke.reach} ${nuke.duration}`)
         setValue('msg', nuke.pattern)
         setValue('rad', nuke.radiation ? nuke.radiationLength : '')
         setValue('reach', nuke.reach)
         setValue('duration', nuke.duration)
      }
   }
   
   function onSendNuke(data: any) {
      if(data && data.msg) {
         setRawNuke(`!nuke ${data.msg} ${data.rad ? `-r=${data.rad}`: ''} ${data.reach} ${data.duration}`)
      }
   }
   
   
   
   
   
   return (
      <div className={'choice-dropdown'} style={{ paddingBottom: 0 }}>
         <div className={'choice-title'} style={{ color: '#43aa43' }}>Nuke</div>
         
         <div style={{ marginBottom: '1.5rem' }}>
            <form onSubmit={handleSubmit(onSendNuke)}>
               <div className="field" style={{ marginBottom: '.5rem' }}>
                  <div style={{
                     display: 'flex',
                     gridGap: '.2rem',
                  }}>
                     <input ref={register} name="msg" className={'input'} type="text" style={{ height: '25px', fontSize: '14px' }} />
                     <div style={{
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                     }}>r=
                     </div>
                     <input ref={register} name="rad" style={{ width: '50px', height: '25px', fontSize: '14px' }} className={'input'} type="text" />
                     <input ref={register} name="reach" style={{ width: '50px', height: '25px', fontSize: '14px' }} className={'input'} type="text" />
                     <input ref={register} name="duration" style={{ width: '50px', height: '25px', fontSize: '14px' }} className={'input'} type="text" />
                  </div>
               </div>
               <button className={'button'} style={{ width: '100%', backgroundColor: '#43aa43' }} type={'submit'}>Nuke!</button>
            </form>
         </div>
         
         <ul>
            {nukes?.map((nuke: any, index: number) => {
               return <li
                  key={nuke.pattern}
                  className={`choice-dropdown-item`}
                  onClick={() => setNuke(nuke)}
               >
                  
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{
                        height: '19px',
                        display: 'block',
                        width: '199px',
                        overflow: 'hidden',
                     }}>
                        {nuke.pattern}
                     </span>
                     <span>[{nuke.radiation ? `-r=${nuke.radiationLength}`: ``} {nuke.reach} {nuke.duration}]</span>
                  </div>
                  
               </li>
            })}
         </ul>
      </div>
   )
   
}
