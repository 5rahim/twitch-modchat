import { HelixUser } from 'twitch'
import React, { useEffect } from 'react'
import { useSelector } from '../../store'
import { AppSelectors } from '../../store/slices/AppSlice'
import { useSelectedUser } from '../../hooks/UseSelectedUser'

export const Bookmarks: React.FC<any> = ({ openSection }: any) => {
   
   const bookmarks = useSelector(AppSelectors.bookmarks)
   
   const { user } = useSelectedUser({})
   
   function selectUser(u: HelixUser) {
      if (u) {
         const electron = window.require('electron')
         electron.ipcRenderer.send("select-user", { user: u.name })
         electron.ipcRenderer.send("open-profile", { user: u.name })
         openSection(null)
      }
   }
   
   return (
      <div className="bookmarks">
         <ul>
            {bookmarks?.map(((u: HelixUser) => {
               return <li key={u.displayName} onClick={() => selectUser(u)}>{u.displayName}</li>
            }))}
            {bookmarks?.length === 0 && 'No user bookmarked'}
         </ul>
      </div>
   )
   
}
