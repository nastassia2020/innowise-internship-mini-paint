import { SlLogout } from 'react-icons/sl'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

import { logoutHandler } from '../../features/authSlice/authSlice'
import './Header.css'

const Header = () => {
  const isAuth = !!localStorage.getItem('Auth')
  const dispatch = useAppDispatch()

  const authHandler = () => {
    dispatch(logoutHandler())
  }

  return (
    <div className='header'>
      <div className='header_info'>
        <p> Pretty Paint </p>
      </div>
      {isAuth && <SlLogout className='header_exit' onClick={authHandler} />}
    </div>
  )
}

export default Header
