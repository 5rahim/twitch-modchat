import { Box }                      from 'rebass'
import { Button }                   from '../Button'
import { memo }                     from 'react'
import { useToggle }                from '../../hooks/UseToggle'
import { useDispatch, useSelector } from '../../store'
import { CredentialSelectors }      from '../../store/slices/CredentialSlice'
import { AppActions }               from '../../store/slices/AppSlice'
import React from 'react'

export const Account = memo(() => {
   
   const username = useSelector(CredentialSelectors.username)
   const channel = useSelector(CredentialSelectors.channel)
   
   const dispatch = useDispatch()
   
   const [confirmation, toggleConfirmation] = useToggle(false)
   
   function onSignout() {
      const electron = window.require('electron')
      electron.ipcRenderer.send("user-signed-out")
      dispatch(AppActions.logout())
   }
   
   return (
      <>
         <h4>Account</h4>
         <Box mb={2}>Your account is: <strong>{username}</strong></Box>
         <Box mb={2}>Channel: <strong>{channel}</strong></Box>
         <div className="divider" />
         <Box>
            <Box mb={2}>
               <a onClick={toggleConfirmation}>Change account / Change channel</a>
               <Box>
                  <i>This won't log you out</i>
               </Box>
            </Box>
            <Box display={confirmation ? 'block' : 'none'}>
               <Button mr={2} danger onClick={onSignout}>Confirm</Button>
            </Box>
         </Box>
      </>
   )
   
})
