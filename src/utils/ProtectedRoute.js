import { useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

const ProtectedRoute = () => {
  const { isError } = useAppSelector((state) => state.auth)
  const isAuth = !!localStorage.getItem('Auth email')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth && !isError) {
      navigate('/')
    }
    console.log('isAuth', isAuth)
  }, [isAuth, isError, navigate])

  return isAuth && !isError ? <Outlet /> : <Navigate to='/register' />
}

export default ProtectedRoute
