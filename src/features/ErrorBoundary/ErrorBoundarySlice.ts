import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ErrorState {
  hasError: boolean
  error: Error | null
}

const initialState: ErrorState = {
  hasError: false,
  error: null,
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<Error>) => {
      state.hasError = true
      state.error = action.payload
    },
    clearError: (state) => {
      state.hasError = false
      state.error = null
    },
  },
})

export const { setError, clearError } = errorSlice.actions

export const errorReducer = errorSlice.reducer
