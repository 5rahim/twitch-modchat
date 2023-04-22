import React from 'react'

interface MinimapNodeChildProps {
   width: number,
   height: number,
   top: number,
   left: number,
   node: React.ReactNode,
}

export const MinimapNodeChild: React.FC<MinimapNodeChildProps> = (
   {
      width, height, top, left, node,
   }:
      MinimapNodeChildProps) => {
   
   return (
      <div
         style={{
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
         }}
         className="minimap-children"
      />
   )
   
}
