import { initialBirds, initialSettings } from './InitialStates'
import { useEffect }                     from 'react'
import ElectronStore                     from 'electron-store'

const Store = require('electron-store')

export const storage: ElectronStore = new Store({ name: 'bird-store' })

// If storage doesn't exist, create one
export function initGlobalStorage() {
   if (!storage.has('birds') && !storage.has('settings')) {
      storage.set('birds', initialBirds)
      storage.set('settings', initialSettings)
   }
}

// Get storage values
export function getGlobalStorageValues(): any {
   initGlobalStorage()
   return storage.store
}
