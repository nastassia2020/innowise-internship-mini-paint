import { Outlet, Navigate } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

const ProtectedRoute = () => {
  const { isError } = useAppSelector((state) => state.auth)
  const logged = localStorage.getItem('logged')
  return logged && !isError ? <Outlet /> : <Navigate to='/register' />
}

export default ProtectedRoute
