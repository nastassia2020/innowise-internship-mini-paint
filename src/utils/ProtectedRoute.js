import { useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

const ProtectedRoute = () => {
  const { isError } = useAppSelector((state) => state.auth)
  const isAuth = !!localStorage.getItem('Auth')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth || isError) {
      navigate('/register')
    }
  }, [isAuth, isError, navigate])

  return <>{isAuth && !isError ? <Outlet /> : <Navigate replace to='/register' />}</>
}

export default ProtectedRoute
