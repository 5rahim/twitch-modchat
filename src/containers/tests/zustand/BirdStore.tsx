import create, { GetState, SetState, State, StateCreator, StoreApi } from 'zustand'
import produce, { Draft }                                            from 'immer'
import { devtools }                                                  from 'zustand/middleware'

const Store = require('electron-store')

const birdStorage = new Store({ name: 'bird-store' })


type BirdStore = {

}

// Log every time state is changed
const log = <T extends State>(config: any) => (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => config((args: any) => {
   //console.log("  applying", args)
   set(args)
   console.log("  new state", get())
}, get, api)

// Turn the set method into an immer proxy
const immer = <T extends State>
(config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>): StateCreator<T> =>
   (set, get, api) => {
      return config((fn) => set(produce(fn) as (state: T) => T), get, api)
   }


const useStore = create<BirdStore>(
   devtools(
      log(
         immer<BirdStore>((set) => ({
         
         })),
      ),
   ),
)
