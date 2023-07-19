import { collection, addDoc } from 'firebase/firestore'

import { db } from '../../firebase'

export interface UserData {
  uid: string
  email: string
}

export async function saveUser(uid: string, email: string): Promise<string> {
  const allUsersRef = collection(db, 'users')
  const newUser = await addDoc(allUsersRef, {
    uid,
    email,
  })
  return newUser.id
}
