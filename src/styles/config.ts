import { createStyled } from '@stitches/react'
import Color from 'tinycolor2'

export const { styled, css } = createStyled({
   prefix: '',
   tokens: {
      colors: {
         $backgroundColor: '#121212',
         $streamInfoColor: '#' + Color('#121212').lighten(5).toHex(),
         $primary500: '#3296db',
         $blue500: '#3296db',
         $gray500: '#565656',
         $red500: '#c43a3a',
         $orange500: '#CF792F',
         $green500: '#43aa43',
         $purple500: '#7743aa',
         $pink500: '#aa438b'
      },
      space: {
         $1: '5px',
         $2: '10px',
         $3: '15px',
      }
   },
   breakpoints: {},
   utils: {
      m: (config) => (value) => ({
         marginTop: value,
         marginBottom: value,
         marginLeft: value,
         marginRight: value,
      }),
      mt: (config) => (value) => ({
         marginTop: value,
      }),
      mr: (config) => (value) => ({
         marginRight: value,
      }),
      mb: (config) => (value) => ({
         marginBottom: value,
      }),
      ml: (config) => (value) => ({
         marginLeft: value,
      }),
      mx: (config) => (value) => ({
         marginLeft: value,
         marginRight: value,
      }),
      my: (config) => (value) => ({
         marginTop: value,
         marginBottom: value,
      }),
   },
})
