import { useEffect }                       from 'react'
import { useStore }                        from './GlobalStore'
import { getGlobalStorageValues, storage } from './GlobalStorage'
import { settingActions }                  from '../reducers/SettingReducer'


export const useInitGlobalStorage = () => {
   const set = useStore(state => state.set)
   
   useEffect(() => {
      set(state => {state.birds = getGlobalStorageValues().birds})
      set(state => {state.settings = getGlobalStorageValues().settings})
   }, [])
}

export const useSetting = (id: string) => {
   return useStore(state => state.settings[id])
}

export const useToggleSetting = () => {
   const dispatch = useStore(state => state.dispatchSetting)
   return (key: string) => {
      dispatch({ type: settingActions.toggleSetting, payload: { key } })

   }
}
