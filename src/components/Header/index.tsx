import { BiCog, BiMinus, BiWindow, BiX } from 'react-icons/all'
import React, { memo }                   from 'react'
import classNames                        from "classnames"
import '../../styles/Header.scss'
import { useDispatch, useSelector } from '../../store'
import { AppActions, AppSelectors } from '../../store/slices/AppSlice'

const electron = window.require('electron')

interface HeaderProps {
   title: string
   window: string
   noMinimization?: boolean
   noMaximization?: boolean
   whiteHeader?: boolean
   settingCog?: boolean
   onClose?: any
}

export const Header: React.FC<HeaderProps> = memo((
   { title, window, noMaximization = false, noMinimization = false, whiteHeader = false, settingCog = false, onClose }: HeaderProps,
) => {
   
   //const showSettingsWindow = useSelector(AppSelectors.showSettingsWindow)
   
   const dispatch = useDispatch()
   
   const sendHeaderEvent = (event: string) => electron.ipcRenderer.send('header', { event, window })
   
   function handleClose() {
      onClose && onClose()
      sendHeaderEvent('close')
   }
   
   return (
      <header className={classNames('header', {
         white: whiteHeader,
      })}>
         <div className="header-title">{title}</div>
         <ul>
            {
               settingCog &&
               <li className={'settings'} onClick={() => dispatch(AppActions.toggleSettingsWindow())}>
                   <BiCog />
               </li>
            }
            {
               !noMinimization &&
               <li className={'minimize'} onClick={() => sendHeaderEvent('minimize')}>
                   <BiMinus />
               </li>
            }
            {
               !noMaximization &&
               <li className={'maximize'} onClick={() => sendHeaderEvent('maximize')}>
                   <BiWindow />
               </li>
            }
            <li className={'close'} onClick={handleClose}>
               <BiX />
            </li>
         </ul>
      </header>
   )
   
})
