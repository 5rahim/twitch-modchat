import React                                   from 'react'
import { ButtonProps, Button as RebassButton } from 'rebass'
import styled                                  from '@emotion/styled'

interface ButtonOptions {
   children?: React.ReactNode
   small?: boolean
   danger?: boolean
}

export const Button: React.FC<any> = (props: ButtonProps & ButtonOptions) => {
   
   const {
      children,
      small,
      danger,
      ...rest
   } = props
   
   const style = {
      display: 'inline-block',
      padding: small ? '.1rem .5rem' : '',
   }
   
   return (
      <RebassButton {...props}>
         {children}
      </RebassButton>
   )
   
}
