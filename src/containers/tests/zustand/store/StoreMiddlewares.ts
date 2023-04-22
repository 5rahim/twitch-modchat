import { GetState, SetState, State, StateCreator, StoreApi } from 'zustand'
import produce, { Draft }                                    from 'immer'

// Immer middleware
export const immerMiddleware = <T extends State>(
   config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
): StateCreator<T> => (set, get, api) =>
   config((fn) => set(produce(fn) as (state: T) => T), get, api)

export const logMiddleware = <T extends State>(
   config: any,
) => (
   set: SetState<T>, get: GetState<T>, api: StoreApi<T>,
) =>
   config((args: any) => {
      //console.log("  applying", args)
      set(args)
      //console.log("  new state", get())
   }, get, api)
