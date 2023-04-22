import React                   from 'react'
import { Modal, ModalActions } from '../Modal'
import { Flex }                from 'rebass'

export const TimeModal: React.FC<any> = ({ onSubmit, handleChange, register, onHide }) => {
   return (
      <Modal title={'Time:'}>
         <form onSubmit={onSubmit(handleChange)}>
            <div className="field">
               <input name='time' type="text" ref={register} />
            </div>
            <ModalActions>
               <Flex mr={2}>
               <button className={'button'} type='submit'>Ok</button>
               </Flex>
               <button className={'button'} onClick={onHide}>Cancel</button>
            </ModalActions>
         </form>
      </Modal>
   )
}
