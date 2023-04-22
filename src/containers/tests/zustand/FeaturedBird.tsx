import React                 from 'react'
import { FeaturedBirdStyle } from '../stitches/styles'
import { useSetting }        from './store/use-setting'
import { useTopBird }        from './store/use-birds'
import { Bird }              from './store/GlobalStore'

function FeaturedBird() {
   const showTopBird = useSetting('showTopBird')
   const topBird: Bird = useTopBird()
   
   if(!topBird) return ``
   
   return (
      showTopBird &&
      (<FeaturedBirdStyle>
         <strong>Most seen bird:</strong> {topBird.name} ({topBird.views} views)
      </FeaturedBirdStyle>)
   )
}

export default FeaturedBird
