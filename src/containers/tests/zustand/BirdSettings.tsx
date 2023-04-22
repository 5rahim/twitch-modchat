import React                            from 'react'
import { Checkbox, Label }              from '@rebass/forms'
import { BirdSettingsStyle }            from '../stitches/styles'
import { useSetting, useToggleSetting } from './store/use-setting'
import { useStore }                     from './store/GlobalStore'

function BirdSettings() {
   
   const showTopBird: boolean = useSetting('showTopBird')
   const toggle = useToggleSetting()
   
   
   return (
      <BirdSettingsStyle>
         Settings:
         <Label>
            <Checkbox checked={showTopBird} id={'topBird'} onChange={_ => toggle('showTopBird')} /> Show most seen bird
         </Label>
         <div style={{ height: '1px', backgroundColor: '#dadada', margin: '1rem 0' }} />
      </BirdSettingsStyle>
   )
}

export default BirdSettings
