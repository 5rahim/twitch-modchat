import React, { useState } from 'react'
import { FormStyle }       from '../stitches/styles'
import BirdPreview         from './BirdPreview'
import { useStore }        from './store/GlobalStore'
import { useBirdForm }     from './store/use-birds'

function BirdForm() {
   const [bird, setBird] = useBirdForm()
   return (
      <FormStyle>
         <h4>Add a bird:</h4>
         <BirdPreview />
         <input type="text" placeholder={'Bird name'} value={bird} onChange={_ => setBird(_.target.value)} />
         <button>Add</button>
      </FormStyle>
   )
}

export default BirdForm
