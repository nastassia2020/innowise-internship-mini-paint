import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import { createUserFetch, LoginFetch, LogOutFetch } from './authAPI'

import { saveUser } from '../allUsers/allUsersAPI'

export interface RegisterUserArgs {
  email: string | null
  password: string | null
}

export interface RegisterUserResponse {
  uid: string | null
  email: string | null
}

export interface UserState {
  user: RegisterUserArgs | RegisterUserResponse | null
  status: 'idle' | 'loading' | 'failed'
  firstEnter: boolean
  isAuth: boolean
  error: string
  isError: boolean
}

const initialState: UserState = {
  user: {
    email: '',
    password: '',
    uid: '',
  },
  isAuth: false,
  status: 'idle',
  firstEnter: true,
  error: '',
  isError: false,
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await createUserFetch({ email, password })()
    await saveUser(response.uid || '', response.email || '')
    return response
  },
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await LoginFetch({ email, password })()
      localStorage.setItem('Auth uid', response.uid || '')
      return response
    } catch (error) {
      toast.error("user doesn't exist")
      throw error
    }
  },
)

export const logoutUser = createAsyncThunk('auth/logoutUser', () => {
  return LogOutFetch()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginHandler: (state, action: PayloadAction<RegisterUserArgs | RegisterUserResponse>) => {
      state.user = action.payload
      state.isAuth = true
    },
    loginCheckStatusHandler: (state) => {
      const uid = localStorage.getItem('Auth uid') || null
      if (uid) {
        state.isAuth = true
      } else state.isAuth = false
    },
    logoutHandler: (state) => {
      state.user = null
      state.isAuth = false
      localStorage.removeItem('Auth uid')
    },
    firstLoadHandler: (state, action: PayloadAction<boolean>) => {
      state.firstEnter = action.payload
    },
    checkUserHandler: (state) => {
      if (state.status === 'failed') {
        state.error = 'something went wrong'
        state.isError = true
      } else {
        state.error = ''
        state.isError = false
      }
    },
    clearErrorHandler: (state) => {
      state.error = ''
      state.isError = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload
        state.isAuth = true
        state.isError = false
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed'
        state.isAuth = false
        state.isError = true
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        state.isAuth = false
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const {
  loginHandler,
  logoutHandler,
  firstLoadHandler,
  loginCheckStatusHandler,
  checkUserHandler,
  clearErrorHandler,
} = authSlice.actions

export default authSlice.reducer
