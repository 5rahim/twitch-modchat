import React    from 'react'
import { Flex } from 'rebass'
import '../../styles/Modal.scss'

interface ModalProps {
   children?: React.ReactNode
   title?: string | null
   fluid?: boolean
}

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
   
   const { children, title, fluid = false } = props
   
   return (
      <div className={`modal ${fluid && 'modal-fluid'}`}>
         <div className='modal-box'>
            {title && <div className='modal-title'>{title}</div>}
            <div className="modal-body">
               {children}
            </div>
         </div>
      </div>
   )
   
}

interface ModalActionsProps {
   children?: React.ReactNode
}

export const ModalActions: React.FC<ModalActionsProps> = (props: ModalActionsProps) => {
   
   const { children } = props
   
   return (
      <Flex justifyContent={'flex-end'}>
         {children}
      </Flex>
   )
   
}
