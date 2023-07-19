import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs } from 'firebase/firestore'

import { db } from '../../firebase'

interface User {
  uid: string
  email: string
}

interface AllUsers {
  status: 'idle' | 'loading' | 'failed'
  users: User[]
  error: string
}

const initialState: AllUsers = {
  status: 'idle',
  users: [],
  error: '',
}

export const getAllUsers = createAsyncThunk('users/getAll', async () => {
  const snapshot = await getDocs(collection(db, 'users'))

  const users: User[] = []

  snapshot.forEach((doc) => users.push({ email: doc.data().email, uid: doc.data().uid } as User))

  return users
})

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<AllUsers>) => {
      state.users = action.payload.users
      console.log('userList **** ', state.users)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'idle'
        state.users = action.payload
        state.error = ''
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.users = []
        state.error = action.error.message ?? 'Error fetching collections'
      })
  },
})

export const { setUserList } = userSlice.actions

export default userSlice.reducer
