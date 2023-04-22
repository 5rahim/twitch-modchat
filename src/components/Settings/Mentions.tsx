import { SettingLine }                                      from './SettingLine'
import { Switch }                                           from '../Switch'
import React, { memo }                                      from 'react'
import { Box }                                              from 'rebass'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useDispatch, useSelector }                         from '../../store'

export const Mentions = memo(() => {
   
   const salutationPopup = useSelector(SettingsSelectors.showSalutationPopup)
   const dispatch = useDispatch()
   
   return (
      <>
         <h4>Mentions</h4>
         <SettingLine>
            <Switch
               checked={salutationPopup}
               text={'Show salutation popup'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.showSalutationPopup, salutationPopup))}
            />
            <Box py={1} opacity={.5}>
               <i>These show up when a user says hi to you</i>
            </Box>
         
         </SettingLine>
      </>
   )
   
})
