import React, { memo, useEffect, useState } from "react"
import 'milligram/dist/milligram.min.css'
import Header                               from './Header'
import BirdForm                             from './BirdForm'
import FeaturedBird                         from './FeaturedBird'
import BirdList                             from './BirdList'
import BirdSettings                         from './BirdSettings'
import { useInitGlobalStorage }             from './store/use-setting'

export const ZustandApp = () => {
   
   useInitGlobalStorage()
   
   return (
      <>
         <Header />
         <BirdSettings />
         <FeaturedBird />
         <BirdForm />
         <BirdList />
      </>
   )
   
}
