import React, { useEffect } from 'react'
import { memo }             from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Main }                         from './Main'
import { useInitSettings }              from '../hooks/UseSettings'
import { useTwitchConnection }          from '../hooks/UseTwitchConnection'
import { UserList }                     from '../components/UserList'
import { useSelector }                  from '../store'
import { SettingsSelectors }            from '../store/slices/SettingsSlice'
import { UserProfile }                  from '../components/UserProfile'
import '../styles/App.scss'


export const Router = memo(() => {
   
   useInitSettings()
   useTwitchConnection()
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   
   return (
      <BrowserRouter>
         <Switch>
            <Route exact path="/main_window" component={Main} />
            <Route exact path="/users" component={UserList} />
            {showPopupProfile && <Route exact path="/profile" component={UserProfile} />}
         </Switch>
      </BrowserRouter>
   )
})

