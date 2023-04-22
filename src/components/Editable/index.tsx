import React, { memo, useEffect, useRef, useState } from 'react'
import '../../styles/Form.scss'

interface EditableProps {
   type?: 'input' | 'textarea'
   value: string | null | undefined
   size?: number
   indication?: boolean
   fullWidth?: boolean
   
   onValueChange?(value: string): void
}

const Editable: React.FC<EditableProps> = memo(({ type = 'input', value, size = 20, onValueChange, indication = false, fullWidth = false }: EditableProps) => {
   
   const [isEditing, setEditing] = useState<boolean>(false)
   const [currentValue, setCurrentValue] = useState<string>(value ? value : ``)
   const [oldValue, setOldValue] = useState(value ? value : ``)
   const inputRef = useRef(null)
   
   useEffect(() => {
      if (inputRef && inputRef.current && isEditing) {
         // @ts-ignore
         inputRef.current.focus()
      }
   }, [isEditing, inputRef])
   
   function handleStartEditing() {
      setEditing(true)
   }
   
   function handleStopEditing(e: any) {
      setEditing(false)
      if(e.target.value.length > 0) {
         onValueChange && onValueChange(e.target.value)
         setCurrentValue(e.target.value)
         setOldValue(e.target.value)
      } else {
         setCurrentValue(oldValue)
      }
   }
   
   const handleKeyDown = (event: any, type: any) => {
      const { key } = event
      const keys = ["Escape", "Tab"]
      const enterKey = "Enter"
      const allKeys = [...keys, enterKey]
      if (
         (type === "textarea" && keys.indexOf(key) > -1) ||
         (type !== "textarea" && allKeys.indexOf(key) > -1)
      ) {
         handleStopEditing(event)
      }
   }
   
   function handleValueChange(e: any) {
      setCurrentValue(e.target.value)
   }
   
   return (
      <>
         {isEditing ? (
            <span onBlur={(e) => handleStopEditing(e)} onKeyDown={e => handleKeyDown(e, type)}>
               {type === 'input' &&
               <div className='field' style={{ display: 'inline-flex', margin: 0 }}>
                   <input
                       spellCheck={'false'}
                       size={(size ? size : 0)}
                       ref={inputRef}
                       type={'text'}
                       className={'input'}
                       value={currentValue}
                       onChange={(e) => handleValueChange(e)}
                   />
               </div>
               }
               {type === 'textarea' &&
               <div className='field' style={{ display: 'inline-flex', margin: 0, width: '100%' }}>
                   <textarea
                       spellCheck={'false'}
                       style={{ width: fullWidth ? '100% !important': 'auto', resize: 'none', height: '100px' }}
                       ref={inputRef}
                       value={currentValue}
                       onChange={(e) => handleValueChange(e)}
                   />
               </div>
               }
            </span>
         ) : (
            <span onClick={() => handleStartEditing()} style={{ cursor: 'pointer' }}>
               <span className={indication ? (type === 'input' ? 'input-indication' : 'textarea-indication') : ''}>
                  {currentValue}
               </span>
            </span>
         )}
      </>
   )
   
})

export default Editable
