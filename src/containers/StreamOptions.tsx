import React, { memo, useState } from 'react'
import { BiBookmark, BiConversation, BiGroup, BiShield } from 'react-icons/all'
import { Bookmarks } from '../components/Bookmarks'
import { ChatModes } from '../components/ChatModes'
import { ModMenu } from '../components/ModMenu'
import { useSelector } from '../store'
import { SettingsSelectors } from '../store/slices/SettingsSlice'
import { useTwitchApi } from '../hooks/UseAPI'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer


interface StreamOptionsProps {

}

export const StreamOptions: React.FC<StreamOptionsProps> = memo((props: StreamOptionsProps) => {
   
   const [openedSection, setOpenedSection] = useState<string | null>(null)
   
   const { channel } = useTwitchApi()
   
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   
   function openBookmarks() {
      if(!showPopupProfile) {
         setOpenedSection(o => o ? null : 'bookmarks')
      } else {
         if(channel) {
            const electron = window.require('electron')
            electron.ipcRenderer.send("select-user", { user: channel })
            electron.ipcRenderer.send("open-profile", { user: channel })
         }
      }
   }
   
   return (
      
      <div className="stream-options">
         
         <div className="stream-option">
            <div className="stream-option-button" onClick={openBookmarks}>
               <BiBookmark />
            </div>
            <div style={{ display: (openedSection === 'bookmarks') ? 'block' : 'none' }}>
               <Bookmarks openSection={setOpenedSection} />
            </div>
         </div>
         
         <div className="stream-option">
            <div className="stream-option-button" onClick={() => ipcRenderer.send("toggle-userlist")}>
               <BiGroup />
            </div>
         </div>
         
         <div className="stream-option">
            <div className="stream-option-button" onClick={() => setOpenedSection(o => o ? null : 'chat-modes')}>
               <BiConversation />
            </div>
            <div style={{ display: (openedSection === 'chat-modes') ? 'block' : 'none' }}>
               <ChatModes />
            </div>
         </div>
         
         <div className="stream-option">
            <div className="stream-option-button" onClick={() => setOpenedSection(o => o ? null : 'mod-menu')}>
               <BiShield />
            </div>
            <div style={{ display: (openedSection === 'mod-menu') ? 'block' : 'none' }}>
               <ModMenu streamOption={openedSection} />
            </div>
         </div>
      
      
      </div>
   )
   
})
