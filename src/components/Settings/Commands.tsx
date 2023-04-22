import { SettingLine }                     from './SettingLine'
import { ItemCreationForm }                from './ItemCreationForm'
import React, { memo }                     from 'react'
import { Cell }                            from './Cell'
import { Box }                             from 'rebass'
import { SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useSelector }                     from '../../store'

export const Commands = memo(() => {
   
   const commands = useSelector(SettingsSelectors.commands)
   
   return (
      <>
         <h4>Commands</h4>
         
         
         <SettingLine>
            
            <ItemCreationForm setting={SettingsKeys.commands} name={'name'} defaultValues={{ func: 'Your new command' }} />
            
            <Box pb={3} opacity={.5}>
               <ul>
                  <li>{String(`{1}, {2}, {3}`)} and so on can be used to insert the 1st, 2nd, 3rd, ... word after the trigger.</li>
                  <li>{String(`{1+}`)} and so on can be used to insert all words starting with the 1st</li>
               </ul>
            </Box>
            
            {commands?.map((data: any, index: number) => {
               return <Cell setting={SettingsKeys.commands} data={{ ...data, index }} key={data.name} />
            })}
         
         </SettingLine>
      </>
   )
   
})
