import React         from 'react'
import { FormStyle } from '../stitches/styles'
import BirdPreview   from './BirdPreview'

function BirdForm() {
   return (
      <FormStyle>
         <h4>Add a bird:</h4>
         <BirdPreview />
         <input type="text" placeholder={'Bird name'} />
         <button>Add</button>
      </FormStyle>
   )
}

export default BirdForm
