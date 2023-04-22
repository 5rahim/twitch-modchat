import { Bird, useStore }      from './GlobalStore'
import shallow                 from 'zustand/shallow'
import { birdActions }         from '../reducers/BirdReducer'
import { useEffect, useState } from 'react'
import * as R                  from 'ramda'
import { view }                from 'ramda'

export const useBirds = (): Bird[] => {
   return useStore(state => state.birds, shallow)
}

type SetBird = (value: string) => void

export const useBirdForm = () => {
   const dispatch = useStore(state => state.dispatchBird)
   const bird: string = useStore(state => state.birdInput)
   
   const setBird: SetBird = (value: string) => {
      dispatch({ type: birdActions.formInput, payload: { value } })
   }
   
   return [bird, setBird] as [string, SetBird]
}


/**
 * Get top bird
 */
export const useTopBird = () => {
   const birds = useStore(state => state.birds)
   const [topBird, setTopBird] = useState<Bird | {}>({})
   useEffect(() => {
      if (birds) {
         setTopBird(R.slice(0, 1, R.sortWith([R.descend(R.prop('views'))])(birds))[0])
      }
   }, [birds])
   
   return topBird as Bird
}


