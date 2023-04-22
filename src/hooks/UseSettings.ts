import { getLocalStorageValues }                  from '../store/storage/LocalStorage'
import { useEffect }                              from 'react'
import { useDispatch, useSelector }               from '../store'
import { AppActions }                             from '../store/slices/AppSlice'
import { SettingsActions, SettingsSelectors }     from '../store/slices/SettingsSlice'
import { Credentials }                            from '../store/states/Types'
import { CredentialActions, CredentialSelectors } from '../store/slices/CredentialSlice'
import * as R                                     from 'ramda'

export const useInitSettings = () => {
   // Initializes and returns local storage values
   const localStorageValues = getLocalStorageValues()
   const dispatch = useDispatch()
   const credentials = useSelector(CredentialSelectors.credentials)
   
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   
   useEffect(() => {
      // If there are settings in the local storage, save them in the global store
      if (!R.isEmpty(localStorageValues.settings)) {
         dispatch(SettingsActions.init(localStorageValues.settings))
      }
      // else { // Else save the default settings
      //    dispatch(SettingsActions.init(InitialSettings))
      // }
      
      // If there are no saved credentials, ask for login
      if (R.isEmpty(localStorageValues.credentials)) {
         dispatch(AppActions.needsLogin())
      } else {
         // If there are credentials, save them
         dispatch(CredentialActions.save(localStorageValues.credentials as Credentials))
      }
   }, [])
   
   useEffect(() => {
      const electron = window.require('electron')
      electron.ipcRenderer.send("should-open-profile-win", { flag: showPopupProfile })
   }, [showPopupProfile])
   
   useEffect(() => {
      // If user's credential are updated, log them in
      if (!R.isEmpty(credentials)) {
         dispatch(AppActions.login(credentials))
         const electron = window.require('electron')
         electron.ipcRenderer.send("user-logged-in")
      }
   }, [credentials])
   
   // useEffect(() => {
   //    if (!!settings) {
   //       console.log('Storing settings')
   //       settingsStorage.store = settings as any
   //    }
   // }, [settings])
   
}
