import React, { useState }    from 'react'
import { useForm }            from 'react-hook-form'
import { yupResolver }        from '@hookform/resolvers/yup'
import * as yup               from 'yup'
import { StaticAuthProvider } from 'twitch-auth'
import CLIENT_ID             from '../constants/client-id'
import { ApiClient }         from 'twitch'
import { Credentials }       from '../store/states/Types'
import { app }               from '../constants/app'
import { Box, Flex }         from 'rebass'
import { useDispatch }       from '../store'
import { Header }            from '../components/Header'
import { Logo }              from '../components/Logo'
import '../styles/Login.scss'
import '../styles/Form.scss'
import '../styles/Button.scss'
import { CredentialActions } from '../store/slices/CredentialSlice'

const { shell } = window.require('electron')

const LoginSchema = yup.object().shape({
   username: yup.string().min(2).required(),
   channel: yup.string().min(2).required(),
   token: yup.string().min(1).required(),
})

export const Login = () => {
   
   const dispatch = useDispatch()
   
   const [loginError, setLoginError] = useState<boolean>(false)
   
   const { register, errors, handleSubmit } = useForm({
      defaultValues: {
         username: '[myusername]',
         channel: '[streamer]',
         token: 'ru83sjsmc20fhx6yebyhg70ze7jp9s',
      },
      resolver: yupResolver(LoginSchema),
   })
   
   const onSubmit = async (data: Credentials) => {
      setLoginError(false)
      data.username = data.username.trim()
      data.token = data.token.trim()
      data.channel = data.channel.trim()
      
      const authProvider = new StaticAuthProvider(CLIENT_ID, data.token, ['chat:read', 'chat:edit', 'channel:moderate', 'user:read:email'], 'user')
      const twitchClient = new ApiClient({ authProvider })
      
      // Check if user exists
      twitchClient?.helix?.users?.getMe(true)?.then(me => {
         if (me) {
            setLoginError(false)
            dispatch(CredentialActions.save(data))
            // dispatch(AccountActions.login())
         }
      }).catch(e => {
         setLoginError(true)
      })
      
   }
   
   return (
      <>
         <Header title={app.name} window={'main'} />
         
         <div className={'login'}>
            
            <Flex justifyContent={'flex-start'} width={'100%'}>
               <Logo mb={4} />
            </Flex>
            
            <div className="login-box">
               
               <Box mb={4}>
                  <h1>Login</h1>
               </Box>
               
               {loginError && <p className='form-error'>Invalid OAuth token, try again</p>}
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="field">
                     <label htmlFor='username'>Username</label>
                     <input name='username' type="text" ref={register} />
                     {errors.username && <p className='fieldError'>Invalid username</p>}
                  </div>
                  <div className="field">
                     <label htmlFor='channel'>Channel</label>
                     <input name='channel' type="text" ref={register} />
                  </div>
                  <div className="field">
                     <label htmlFor='token'>OAuth Token</label>
                     <input name='token' type="text" ref={register} />
                     {errors.token && <p className='fieldError'>Invalid token</p>}
                  </div>
                  <a onClick={() => shell.openExternal('http://gettc.xyz/password/')}>Click here to generate your token</a>
                  <Box mt={3}>
                     <button className='button'>Continue</button>
                  </Box>
               </form>
               
            </div>
         </div>
      </>
   )
   
}
