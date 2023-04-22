import React                 from 'react'
import { ThemeProvider }     from '@emotion/react'
import { ModalProvider }     from 'react-modal-hook'
import { Router }            from './containers/Router'
import { hot }               from 'react-hot-loader'
import { Provider }          from 'react-redux'
import store                 from './store'
import { TwitchApiProvider } from './contexts/TwitchApiContext'

function App() {
   return (
      <ThemeProvider theme={{}}>
         <ModalProvider>
            <TwitchApiProvider>
               <Provider store={store}>
                  <Router />
               </Provider>
            </TwitchApiProvider>
         </ModalProvider>
      </ThemeProvider>
   )
}

export default hot(module)(App)
