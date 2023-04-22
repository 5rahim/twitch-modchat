import { useCallback, useEffect, useState } from "react"
import { HelixUser }                        from 'twitch'
import { AppActions, AppSelectors }         from '../store/slices/AppSlice'
import { useDispatch, useSelector } from '../store'
import { useTwitchApi }     from './UseAPI'

interface HookCallbacks {
   onSelected?(user: string): void
   onUnselected?(): void
}


export function useSelectedUser(callbacks: HookCallbacks) {
   
   // I cannot use dispatch in here, idk why for now so I use a local state
   
   const electron = window.require('electron')
   const ipcRenderer = electron.ipcRenderer
   
   const [selectedUser, setSelectedUser] = useState<string | null>(null)
   const { twitchClient } = useTwitchApi()
   const [user, setUser] = useState<HelixUser | null | undefined>(null)
   
   useEffect(() => {
      
      ipcRenderer.on('selected-user', (event: any, user: any) => {
         setSelectedUser(user)
         callbacks.onSelected && callbacks.onSelected(user)
      })
      
      return () => {
         ipcRenderer.removeAllListeners('selected-user')
         // unselectUser()
      }
   }, [])
   
   useEffect(() => {
      async function fetchUser() {
         if (selectedUser) {
            setUser(await twitchClient?.helix?.users?.getUserByName(selectedUser))
         } else {
            setUser(user => user)
         }
      }
      
      fetchUser()
      
      // Reset states to avoid glitches when user profile unmounts
      return () => {
         unselectUser()
      }
   }, [selectedUser])
   
   const unselectUser = useCallback(() => {
      setUser(null)
      ipcRenderer.send("select-user", { user: null })
      callbacks.onUnselected && callbacks.onUnselected()
   }, [])
   
   return { user, unselectUser }
   
}
