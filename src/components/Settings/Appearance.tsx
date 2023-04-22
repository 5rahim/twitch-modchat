import { Switch }                                           from '../Switch'
import React, { memo, useEffect }                           from 'react'
import { SettingLine }                                      from './SettingLine'
import { useDispatch, useSelector }                         from '../../store'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'

const electron = window.require('electron')

export const Appearance = memo(() => {
   
   const separateWithLines = useSelector(SettingsSelectors.separateWithLines)
   const alternateBackground = useSelector(SettingsSelectors.alternateBackground)
   const boldUsername = useSelector(SettingsSelectors.boldUsername)
   const showTimestamp = useSelector(SettingsSelectors.showTimestamp)
   const redeemedHighlight = useSelector(SettingsSelectors.redeemedHighlight)
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   
   const dispatch = useDispatch()
   
   useEffect(() => {
      electron.ipcRenderer.send("should-open-profile-win", { flag: showPopupProfile })
   }, [])
   
   function changePopupProfileSetting() {
      dispatch(SettingsActions.toggle(SettingsKeys.showPopupProfile, showPopupProfile))
      electron.ipcRenderer.send("should-open-profile-win", { flag: !showPopupProfile })
   }
   
   return (
      <>
         <h4>Messages</h4>
         <SettingLine>
            <Switch
               checked={separateWithLines}
               text={'Separate with lines'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.separateWithLines, separateWithLines))} />
         </SettingLine>
         <SettingLine>
            <Switch
               checked={alternateBackground}
               text={'Alternate background color'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.alternateBackground, alternateBackground))} />
         </SettingLine>
         <SettingLine>
            <Switch
               checked={boldUsername}
               text={'Bold username'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.boldUsername, boldUsername))} />
         </SettingLine>
         <SettingLine>
            <Switch
               checked={showTimestamp}
               text={'Show timestamp'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.showTimestamp, showTimestamp))} />
         </SettingLine>
         <SettingLine>
            <Switch
               checked={redeemedHighlight}
               text={'Highlight messages redeemed with channel points'}
               onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.redeemedHighlight, redeemedHighlight))} />
         </SettingLine>
         
         <div className="divider" />
         
         <h4>User Profile</h4>
         <SettingLine>
            <Switch
               checked={showPopupProfile}
               text={'Open user profile in a new window'}
               onChange={changePopupProfileSetting} />
         </SettingLine>
      </>
   )
   
})
