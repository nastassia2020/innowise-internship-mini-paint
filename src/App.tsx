import './App.css'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DrawingsList from './Components/DrawingList/DrawingList'
import Header from './Components/Header/Header'
import ErrorBoundary from './features/ErrorBoundary/ErrorBoundary'
import AllCollectionsPage from './pages/AllCollectionsPage/AllCollectionsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import MainPage from './pages/MainPage/MainPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ProtectedRoute from './utils/ProtectedRoute'

function App() {
  return (
    <div className='App'>
      <Header />
      <Toaster position='top-left' />
      <ErrorBoundary>
        <Suspense fallback={<h1> ...</h1>}>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path='/' element={<MainPage />} />
                <Route path='/drawings' element={<DrawingsList />} />
                <Route path='/allcollections' element={<AllCollectionsPage />} />
              </Route>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/' element={<Navigate replace to='/register' />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
