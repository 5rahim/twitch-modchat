import React                 from 'react'
import { Checkbox, Label }   from '@rebass/forms'
import { BirdSettingsStyle } from '../stitches/styles'

function BirdSettings() {
   return (
      <BirdSettingsStyle>
         Settings:
         <Label>
            <Checkbox id={'selected'} /> Show selected bird
         </Label>
         <div style={{ height: '1px', backgroundColor: '#dadada', margin: '1rem 0' }}/>
      </BirdSettingsStyle>
   )
}

export default BirdSettings
