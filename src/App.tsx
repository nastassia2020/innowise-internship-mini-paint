import './App.css'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useAppSelector } from './app/hooks'
import DrawingsList from './Components/DrawingList/DrawingList'
import Header from './Components/Header/Header'
import ErrorBoundary from './features/ErrorBoundary/ErrorBoundary'
import AllCollectionsPage from './pages/AllCollectionsPage/AllCollectionsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import MainPage from './pages/MainPage/MainPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'

function App() {
  const { isAuth, isError } = useAppSelector((state) => state.auth)

  return (
    <div className='App'>
      <Header />
      <Toaster position='top-left' />
      <ErrorBoundary>
        <Suspense fallback={<h1> ...</h1>}>
          <BrowserRouter>
            <Routes>
              {isAuth && !isError ? (
                <>
                  <Route path='/' element={<MainPage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/drawings' element={<DrawingsList />} />
                  <Route path='/allcollections' element={<AllCollectionsPage />} />
                </>
              ) : (
                <>
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/' element={<Navigate replace to='/register' />} />
                  <Route path='/drawings' element={<Navigate replace to='/register' />} />
                  <Route path='/allcollections' element={<Navigate replace to='/register' />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
