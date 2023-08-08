import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

import { RegisterUserResponse } from './authSlice'

import { auth } from '../../firebase'

export function createUserFetch({ email, password }: { email: string; password: string }) {
  return async (): Promise<RegisterUserResponse> => {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    const user = response.user
    if (user) {
      return { uid: user.uid, email: user.email }
    } else {
      throw new Error('User not created')
    }
  }
}

export function LoginFetch({ email, password }: { email: string; password: string }) {
  return async (): Promise<RegisterUserResponse> => {
    const response = await signInWithEmailAndPassword(auth, email, password)
    const user = response.user
    if (user) {
      return { uid: user.uid, email: user.email }
    } else {
      throw new Error('User not logged in')
    }
  }
}

export function LogOutFetch() {
  return async () => await signOut(auth)
}
