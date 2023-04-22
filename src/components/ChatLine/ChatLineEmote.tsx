import React from 'react'

interface Props {
   name: string;
   url: string;
}

export const ChatLineEmote: React.FC<Props> = (
   props: Props,
) => {
   return (
      <span style={{ position: "relative", verticalAlign: "middle" }}>
         <img style={{ position: "relative", marginTop: '-5px' }} src={props.url} alt={props.name} />
      </span>
   )
}
