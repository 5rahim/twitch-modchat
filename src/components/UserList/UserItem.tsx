import React           from "react"

export const UserItem = ({ style, children }: any) => {
   
   function selectUser() {
      const electron = window.require('electron')
      electron.ipcRenderer.send("select-user", { user: children })
      electron.ipcRenderer.send("open-profile", { user: children })
   }
   
   return (
      <li style={style ?? style} className='user-list-item' onClick={selectUser}>{children}</li>
   )
   
}
