import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getDrawingsByUser } from './drawingsApi'

import { RootState } from '../../app/store'

import { DrawingData } from '../../Components/Canvas/Canvas'

interface DrawingsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  items: DrawingData[]
  error: string | null
}

const initialState: DrawingsState = {
  status: 'idle',
  items: [],
  error: null,
}

export const getDrawings = createAsyncThunk('drawings/getDrawings', async (uid: string) => {
  const drawings = await getDrawingsByUser(uid)
  return drawings
})

const drawingsSlice = createSlice({
  name: 'drawings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDrawings.pending, (state) => {
        state.status = 'loading'
        state.items = []
        state.error = null
      })
      .addCase(getDrawings.fulfilled, (state, action: PayloadAction<DrawingData[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
      })
      .addCase(getDrawings.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        state.error = action.error.message ?? 'Failed to fetch drawings'
      })
  },
})

export const selectDrawings = (state: RootState) => state.drawings.items

export default drawingsSlice.reducer
