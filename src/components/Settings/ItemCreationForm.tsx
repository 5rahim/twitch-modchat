import { useForm }         from 'react-hook-form'
import { Button }          from '../Button'
import { Box, Flex }       from 'rebass'
import React, { memo }     from 'react'
import { yupResolver }     from '@hookform/resolvers/yup'
import * as yup            from 'yup'
import { useToggle }       from '../../hooks/UseToggle'
import { useDispatch }     from '../../store'
import { getSetting }      from '../../store/storage/LocalStorage'
import { SettingsActions } from '../../store/slices/SettingsSlice'

interface ItemCreationFormProps {
   setting: string
   name: string
   defaultValues?: { [key: string]: any }
}

export const ItemCreationForm: React.FC<ItemCreationFormProps> = memo((props: ItemCreationFormProps) => {
   
   const [flag, toggleFlag] = useToggle(false)
   
   const dispatch = useDispatch()
   
   const { name, setting, defaultValues } = props
   
   const form = useForm({
      defaultValues: { [name]: '' },
      resolver: yupResolver(yup.object().shape({ [name]: yup.string().min(1).required() })),
   })
   
   function onFormSubmit(data: any) {
      const currentSettings = getSetting(setting)
      const existingSetting = !defaultValues ? currentSettings.includes(data[name]) : currentSettings.filter((val: any) => val[name] === data[name]).length > 0
      if (!existingSetting) {
         // If defaultValues then the value to insert in an object
         dispatch(SettingsActions.addItem(setting, !defaultValues ? data[name] : { [name]: data[name], ...defaultValues }))
         form.setValue(name as never, '')
      }
   }
   
   
   return (
      <>
         <Box mb={3}><button className={'button'} onClick={toggleFlag}>Add</button></Box>
         
         <div style={{ display: flag ? 'block' : 'none' }}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
               <Flex mb={2} style={{ placeItems: 'baseline' }} justifyContent={'space-between'}>
                  <div className="field" style={{ marginRight: '1rem', flexGrow: 1 }}>
                     <input name={name} ref={form.register} type="text" className="input" />
                  </div>
                  <button className={'button'} style={{ flexBasis: '1.5rem' }} type={'submit'}>Ok</button>
               </Flex>
            </form>
         </div>
      </>
   )
   
})
