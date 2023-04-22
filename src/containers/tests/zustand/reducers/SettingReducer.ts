import { GlobalStore, ReducerProps } from '../store/GlobalStore'
import { WritableDraft }             from 'immer/dist/types/types-external'
import { storage }                   from '../store/GlobalStorage'

export const settingActions = { toggleSetting: "TOGGLE_SETTING" }

export const settingReducer = (state: WritableDraft<GlobalStore>, { type, payload }: ReducerProps) => {
   switch (type) {
      
      case settingActions.toggleSetting:
         storage.set(`settings.${payload.key}`, !state.settings[payload.key])
         state.settings[payload.key] = !state.settings[payload.key]
         return
      
   }
}
