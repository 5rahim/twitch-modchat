import React, { useEffect } from 'react'
import { memo }             from 'react'
import { useSelector }      from '../store'
import { Login }            from './Login'
import { AppSelectors }     from '../store/slices/AppSlice'
import { ModChat }          from './ModChat'

export const Main = memo(() => {
   
   const needLogin = useSelector(AppSelectors.needLogin)
   
   return (
      <div className={'app'}>
         {needLogin === true ? <Login /> : <ModChat />}
      </div>
   )
   
})
