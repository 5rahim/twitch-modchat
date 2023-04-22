import React             from 'react'
import { BirdListStyle } from '../stitches/styles'

function BirdList() {
   return (
      <BirdListStyle>
         <h3>List:</h3>
         <ul>
            <li>
               <strong style={{ marginRight: '1rem' }}>Bruh</strong>
               <span style={{ marginRight: '1rem' }}>Views: 0</span>
               <a style={{ marginRight: '1.5rem', cursor: 'pointer' }}>Add</a>
               <a style={{ color: 'red', cursor: 'pointer' }}>Remove</a>
            </li>
         </ul>
      </BirdListStyle>
   )
}

export default BirdList
