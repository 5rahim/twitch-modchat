import { styled } from './config'

export const HeaderStyle = styled('div', {
   backgroundColor: '#a851ee',
   padding: '1rem',
   color: '#fff',
   display: 'flex',
   justifyContent: 'space-between',
   marginBottom: '1rem',
   'h4, p': {
      margin: '0 !important',
      padding: 0,
   }
})

export const FormStyle = styled('div', {
   padding: '1rem'
})

export const FeaturedBirdStyle = styled('div', {
   borderRadius: '.5rem',
   border: '2px #a851ee solid',
   padding: '1rem',
   margin: '1rem 1rem'
})

export const BirdListStyle = styled('div', {
   padding: '1rem',
})

export const BirdPreviewStyle = styled('div', {
   marginTop: '-2rem',
   padding: '1rem 1rem 1rem 0',
})

export const BirdSettingsStyle = styled('div', {
   padding: '1rem 1rem 1rem 1rem',
})
