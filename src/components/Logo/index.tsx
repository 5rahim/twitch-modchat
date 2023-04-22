import React   from "react"
import logo              from '../../logo.png'
import { Box, BoxProps } from 'rebass'


export function Logo(props: BoxProps) {
   return (
      <Box {...props}>
         <img alt={'logo'} width='300px' height='46px' src={logo} />
      </Box>
   )
}
