import create, { SetState, StateCreator, UseStore } from 'zustand'
import { immerMiddleware, logMiddleware }           from './StoreMiddlewares'
import { WritableDraft }                            from 'immer/dist/types/types-external'
import produce                                      from 'immer'
import { initialSettings }                          from './InitialStates'
import { birdReducer }                              from '../reducers/BirdReducer'
import { settingReducer }                           from '../reducers/SettingReducer'

export type Settings = { [key: string]: any }
export type Bird = { id: string, name: string, views: number }

export type GlobalStore = {
   birds: Bird[] | [],
   settings: Settings
   set: ImmerSetState
   birdInput: string
   dispatchBird: (args: ReducerProps) => void
   dispatchSetting: (args: ReducerProps) => void
}

export type ReducerProps = { type: any, payload: any }
export type ImmerSetState = (fn: (draft: WritableDraft<GlobalStore>) => void) => void
export type Store = StateCreator<GlobalStore, (fn: (draft: WritableDraft<GlobalStore>) => void) => void>


const store: Store = (set: ImmerSetState, get, api) => ({
   birds: [],
   settings: initialSettings,
   birdInput: '',
   set: set,
   dispatchBird: (args: ReducerProps) => void set(state => birdReducer(state, args)),
   dispatchSetting: (args: ReducerProps) => void set(state => settingReducer(state, args))
})

/**
 * Hook for using the store
 * @type {UseStore<GlobalStore>}
 */
export const useStore =
   create<GlobalStore>(
      logMiddleware<GlobalStore>(
         immerMiddleware<GlobalStore>(store),
      ),
   )

//export const useTrackedStore = createTrackedSelector<GlobalStore>(useStore);

