import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import produce                                                                from 'immer'
import { useForm }                                                            from 'react-hook-form'
import { useModal }                                                           from 'react-modal-hook'
import { TimeModal }                                                          from './TimeModal'
import { BiAlarm }                                                            from 'react-icons/all'
import RoomService                                                            from '../../services/RoomService'
import { UseTwitchApiProps, useTwitchApi }                                    from '../../hooks/UseAPI'

interface ChatModeProps {
   children: React.ReactNode
   type: string
   initialState?: boolean
}

export const ChatModesReducer = (state: any, action: any) => {
   switch (action.type) {
      case 'SET_CURRENT_MSG':
         state.currentMsg = action.msg
         return
      case 'SET_IS_ACTIVE':
         state.isActive = action.isActive
         return
      case 'SET_FOLLOW_DELAY':
         state.follow = action.time
         return
      case 'SET_NEW_FOLLOW_DELAY':
         state.newFollow = action.time
         return
      case 'SET_SLOW_DELAY':
         state.slow = action.time
         return
      case 'SET_NEW_SLOW_DELAY':
         state.newSlow = action.time
         return
   }
}


export const ChatMode: React.FC<ChatModeProps> = memo((props: ChatModeProps) => {
   
   const [state, dispatch] = useReducer(produce(ChatModesReducer), {
      isActive: null,
      currentMsg: null,
      follow: undefined,
      slow: undefined,
      newFollow: undefined,
      newSlow: undefined,
   })
   
   const { children, type } = useMemo(() => props, [])
   
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   
   const [statuses, setStatuses] = useState<any>()
   
   
   useEffect(() => {
      if (chatClient && channel) {
         chatClient.onNamedMessage('ROOMSTATE', (msg) => {
            setStatuses((statuses: any) => {
               dispatch({ type: 'SET_CURRENT_MSG', msg: msg })
               return {
                  sub: RoomService.tagExists('subs-only', msg) ? RoomService.hasSubsOnly(msg) : statuses['sub'],
                  emote: RoomService.tagExists('emote-only', msg) ? RoomService.hasEmoteOnly(msg) : statuses['emote'],
                  r9k: RoomService.tagExists('r9k', msg) ? RoomService.hasR9k(msg) : statuses['r9k'],
                  follow: RoomService.tagExists('followers-only', msg) ? RoomService.getFollowDelay(msg) : statuses['follow'],
                  slow: RoomService.tagExists('slow', msg) ? RoomService.getSlow(msg) : statuses['slow'],
               }
            })
         })
      }
   }, [chatClient, channel])
   
   // When statuses change
   useEffect(() => {
      if (statuses) {
         
         if (type !== 'follow' && type !== 'slow') {
            dispatch({ type: 'SET_IS_ACTIVE', isActive: statuses[type] }) // Refresh activation status
         }
         
         // Set follow delay
         if (type === 'follow' && state.currentMsg && RoomService.tagExists('followers-only', state.currentMsg)) {
            dispatch({ type: 'SET_FOLLOW_DELAY', time: Number(statuses[type]) })
            dispatch({ type: 'SET_IS_ACTIVE', isActive: Number(statuses[type]) >= 0 })
         }
         
         // Set slow delay
         if (type === 'slow' && state.currentMsg && RoomService.tagExists('slow', state.currentMsg)) {
            dispatch({ type: 'SET_SLOW_DELAY', time: Number(statuses[type]) })
            dispatch({ type: 'SET_IS_ACTIVE', isActive: Number(statuses[type]) > 0 })
         }
         
      }
   }, [statuses, state.currentMsg])
   
   
   const handleStatusChange = useCallback(() => {
      
      if (state.isActive !== null && chatClient && channel) {
         switch (type) {
            case 'sub':
               RoomService.toggleSubOnly(state.isActive, chatClient, channel)
               break
            case 'emote':
               RoomService.toggleEmoteOnly(state.isActive, chatClient, channel)
               break
            case 'r9k':
               RoomService.toggleR9k(state.isActive, chatClient, channel)
               break
            case 'follow':
               RoomService.promptFollowDelay(state.isActive, state.follow, chatClient, channel)(showFollowModal, dispatch)
               break
            case 'slow':
               RoomService.promptSlowDelay(state.isActive, state.slow, chatClient, channel)(showSlowModal, dispatch)
               break
         }
      }
      
   }, [state.isActive])
   
   
   const { register: sl_register, errors: sl_errors, handleSubmit: sl_handleSubmit } = useForm({
      defaultValues: {
         time: 5,
      },
   })
   
   const { register: fl_register, errors: fl_errors, handleSubmit: fl_handleSubmit } = useForm({
      defaultValues: {
         time: 10,
      },
   })
   
   const [showSlowModal, hideSlowModal] = useModal(() => (
      <TimeModal onSubmit={sl_handleSubmit} handleChange={changeSlow} register={sl_register} onHide={hideSlowModal} />
   ))
   
   const [showFollowModal, hideFollowModal] = useModal(() => (
      <TimeModal onSubmit={fl_handleSubmit} handleChange={changeFollow} register={fl_register} onHide={hideFollowModal} />
   ))
   
   const changeSlow = (data: any) =>
      dispatch({
         type: 'SET_NEW_SLOW_DELAY',
         time: data.time.trim().length === 0 ? 0 : Number(data.time.trim()),
      })
   
   const changeFollow = (data: any) =>
      dispatch({
         type: 'SET_NEW_FOLLOW_DELAY',
         time: data.time.trim().length === 0 ? 0 : Number(data.time.trim()),
      })
   
   useEffect(() =>
         RoomService.enableSlow(state.newSlow, state.slow, chatClient, channel)(hideSlowModal)
      , [state.newSlow])
   
   useEffect(() =>
         RoomService.enableFollow(state.newFollow, state.follow, chatClient, channel)(hideFollowModal)
      , [state.newFollow])
   
   /**
    * End: Change follow delay
    */
   
   function text() {
      switch (type) {
         case 'follow':
            return (state.follow !== undefined) && RoomService.getFollowStatus(state.follow)
            break
         case 'slow':
            return (state.slow !== undefined) && <><BiAlarm /> {RoomService.getSlowStatus(state.slow)}</>
            break
         default:
            return children
      }
   }
   
   return (
      <li className={`stream-option-info ${type}-mode ${state.isActive && 'active'}`} onClick={handleStatusChange}>
         {text()}
      </li>
   )
   
})
