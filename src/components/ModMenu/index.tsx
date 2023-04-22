import React, { useEffect, useState } from 'react'
import '../../styles/Form.scss'
import '../../styles/ModMenu.scss'
import { Flex } from 'rebass'
import { Nuke } from './Nuke'
import { GameCategory } from './GameCategory'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useDispatch, useSelector } from '../../store'


export const ModMenu = ({ streamOption }: any) => {
   
   const quickMode = useSelector(SettingsSelectors.quickMode)
   const dispatch = useDispatch()
   
   const [openedSection, setOpenedSection] = useState<string | null>(null)
   
   useEffect(() => {
      setOpenedSection(null)
   }, [streamOption])
   
   function toggleQuickMode() {
      dispatch(SettingsActions.toggle(SettingsKeys.quickMode, quickMode))
      setOpenedSection(null)
   }
   
   
   return (
      <>
   
         <div className='stream-option-dropdown'>
            <ul>
               <li className={`stream-option-info ${quickMode ? 'purple-bg' : 'hover-background-color-bg'}`} onClick={toggleQuickMode}>
                  Advanced mode
               </li>
               <li className={`stream-option-info hover-green-bg`} onClick={() => setOpenedSection('nuke')}>
                  Nuke
               </li>
               <li className={`stream-option-info hover-pink-bg`} onClick={() => setOpenedSection('game')}>
                  Game/Category
               </li>
            </ul>
         </div>
         
         {openedSection === 'nuke' && <Nuke/>}
         {openedSection === 'game' && <GameCategory/>}
      
      </>
   )
   
}
