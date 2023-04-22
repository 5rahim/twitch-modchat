import React                from 'react'
import { BirdPreviewStyle } from '../stitches/styles'
import { useBirdForm }      from './store/use-birds'

function BirdPreview() {
   const [bird] = useBirdForm()
   return (
      <BirdPreviewStyle>
         <strong>{bird}</strong>
      </BirdPreviewStyle>
   )
}

export default BirdPreview
