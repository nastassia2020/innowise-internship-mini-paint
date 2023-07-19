import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs } from 'firebase/firestore'

import { DrawingData } from '../../Components/Canvas/Canvas'
import { db } from '../../firebase'

interface CollectionData {
  drawingData: DrawingData
  uid: string
}

interface CollectionState {
  status: string
  collections: CollectionData[]
  error: string | null
}

const initialState: CollectionState = {
  status: 'idle',
  collections: [],
  error: null,
}

export const getAllCollections = createAsyncThunk('collections/getAll', async () => {
  const snapshot = await getDocs(collection(db, 'drawings'))

  const collections: CollectionData[] = []

  snapshot.forEach((doc) =>
    collections.push({ drawingData: doc.data().drawingData, uid: doc.data().uid, id: doc.id } as CollectionData),
  )

  return collections
})

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCollections.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getAllCollections.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.collections = action.payload
        state.error = null
      })
      .addCase(getAllCollections.rejected, (state, action) => {
        state.status = 'failed'
        state.collections = []
        state.error = action.error.message ?? 'Error fetching collections'
      })
  },
})

export default collectionSlice.reducer
