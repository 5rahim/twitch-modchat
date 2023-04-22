import ElectronStore       from 'electron-store'
import { InitialSettings }       from '../states/InitialStates'
import { Credentials, Settings } from '../states/Types'

const Store = require('electron-store')

export const credentialStorage: ElectronStore = new Store({ name: 'credentials' })
export const settingsStorage: ElectronStore = new Store({ name: 'settings' })

// If storages don't exist, create them
export function initGlobalStorage() {
   if (!credentialStorage.has('username')) {
      credentialStorage.set({})
   }
   if(!settingsStorage.has('appearance')) {
      settingsStorage.set(InitialSettings)
   }
}

// Get storage values
export function getLocalStorageValues(): { credentials: Credentials | {}, settings: Settings } {
   initGlobalStorage()
   return {
      credentials: credentialStorage.store as Credentials | {},
      settings: settingsStorage.store as any
   }
}

export function getUpdatedSettings(setting: string, value: any): Settings {
   settingsStorage.set(`${setting}`, value)
   return settingsStorage.store as any
}

export function getSetting(setting: string): any {
   return settingsStorage.get(setting)
}
