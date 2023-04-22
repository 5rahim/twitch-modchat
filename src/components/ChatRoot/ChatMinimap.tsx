import React from 'react'
import ReactMinimap from 'react-minimap'


interface ChatMinimapProps {
   children: React.ReactNode
   height: any
}

export const ChatMinimap = ({ children, height }: ChatMinimapProps) => {
   return (
      <ReactMinimap
         selector=".chat-line-content"
         height={height}
         width={6}
         style={{ backgroundColor: 'red' }}
         childComponent={MinimapNode}
      >
         {children}
      </ReactMinimap>
   )
}

const MinimapNode = ({ node, ...props }: any) => (
   <div
      style={{
         ...props,
         width: '6px',
         position: "absolute",
         minHeight: '2px',
         opacity: '.85',
         backgroundColor: node.dataset.hlColor
      }}
   />
);

export default MinimapNode;
