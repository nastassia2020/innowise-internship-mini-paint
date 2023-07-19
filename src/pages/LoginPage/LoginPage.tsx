import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

import {
  loginUser,
  loginHandler,
  checkUserHandler,
  loginCheckStatusHandler,
  clearErrorHandler,
} from '../../features/authSlice/authSlice'

interface Props {}

const LoginPage: React.FC<Props> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { isError } = useAppSelector((state) => state.auth)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(checkUserHandler())
    dispatch(loginCheckStatusHandler())
    if (isError) {
      navigate('/login')
    } else {
      dispatch(clearErrorHandler())
      dispatch(loginUser({ email, password }))
      dispatch(loginHandler({ email, password }))
      navigate('/')
    }
  }

  return (
    <div className='auth'>
      <form className='auth_form' onSubmit={handleSubmit}>
        <label htmlFor='email' title='Email'>
          Email:{' '}
        </label>
        <input
          type='email'
          name='email'
          value={email}
          placeholder='example@domain.com'
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor='password' title='Password'>
          Password:{' '}
        </label>
        <input
          type='password'
          name='password'
          value={password}
          placeholder='Min 6 characters'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit' className='auth_btn'>
          Login
        </button>
        <button type='button' className='auth_btn' onClick={() => navigate('/register')}>
          Return to register page
        </button>
      </form>
    </div>
  )
}

export default LoginPage
