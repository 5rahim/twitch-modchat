import React             from 'react'
import { BirdListStyle } from '../stitches/styles'
import { useBirds }      from './store/use-birds'

function BirdList() {
   
   const birds = useBirds()
   
   return (
      <BirdListStyle>
         <h3>List:</h3>
         <ul>
            {birds.map((bird) => {
               return <BirdItem key={bird.id} {...bird} />
            })}
         </ul>
      </BirdListStyle>
   )
}

export default BirdList

function BirdItem({ id, name, views }: { id: string, name: string, views: number }) {
   return (
      <li>
         <strong style={{ marginRight: '1rem' }}>{name}</strong>
         <span style={{ marginRight: '1rem' }}>Views: {views}</span>
         <a style={{ marginRight: '1.5rem', cursor: 'pointer' }}>Add</a>
         <a style={{ color: 'red', cursor: 'pointer' }}>Remove</a>
      </li>
   )
}
