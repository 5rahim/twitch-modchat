import { BiCopyAlt } from 'react-icons/all'
import copy          from 'copy-to-clipboard'
import React         from 'react'
import '../../styles/CopyButton.scss'

interface CopyButtonProps {
   text: string | null | undefined
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }: CopyButtonProps) => {
   
   const handleClick = () => text && copy(text)
   
   return (
      <div className='copy-button' onClick={handleClick}><BiCopyAlt /></div>
   )
   
}
