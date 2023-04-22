import React                                                 from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import 'milligram/dist/milligram.min.css'
import Header                                                from './Header'
import BirdSettings                                          from './BirdSettings'
import FeaturedBird                                          from './FeaturedBird'
import BirdForm                                              from './BirdForm'
import BirdList                                              from './BirdList'

export const RecoilApp = () => {
   
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
