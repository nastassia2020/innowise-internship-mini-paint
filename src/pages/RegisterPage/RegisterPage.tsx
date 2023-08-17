import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

import { registerUser, loginHandler } from '../../features/authSlice/authSlice'
import './RegisterPage.css'

interface Props {}

const RegisterPage: React.FC<Props> = () => {
  const { firstEnter, isError } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (firstEnter === false) {
      navigate('/')
    }
  }, [firstEnter, navigate])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isError) {
      console.log('isError', isError)
    } else {
      dispatch(registerUser(userData))
      dispatch(loginHandler(userData))
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
          value={userData.email}
          placeholder='example@domain.com'
          required
          onChange={changeHandler}
        />
        <label htmlFor='password' title='Password'>
          Password:{' '}
        </label>
        <input
          type='password'
          name='password'
          value={userData.password}
          placeholder='Min 6 characters'
          onChange={changeHandler}
          required
        />
        <button type='submit' className='auth_btn'>
          Register
        </button>
        <button onClick={() => navigate('/login')} type='button' className='auth_btn'>
          Login
        </button>
        <p> Press here if you already have an account</p>
      </form>
    </div>
  )
}

export default RegisterPage
