import React from 'react';
import { ChangeEvent, memo } from 'react'

interface SwitchProps {
   text: string
   size?: string
   checked?: boolean
   disabled?: boolean
   onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const Switch = memo((props: SwitchProps) => {
   
   const {
      text,
      size = "default",
      checked = false,
      disabled = false,
      onChange,
   } = props
   
   let displayStyle = checked ? 'checked' : 'non-checked';
   
   return (
      <>
         <label>
            <span className={`${size} switch-wrapper`}>
               <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={e => onChange && onChange(e)}
               />
               <span className={`${displayStyle} switch`}>
                  <span className="switch-handle" />
               </span>
            </span>
            <span className="switch-label">{text}</span>
         </label>
      </>
   )
   
})
