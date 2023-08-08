import { Outlet, Navigate } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

const ProtectedRoute = () => {
  const { isAuth, isError } = useAppSelector((state) => state.auth)
  return isAuth && !isError ? <Outlet /> : <Navigate to='/register' />
}

export default ProtectedRoute
