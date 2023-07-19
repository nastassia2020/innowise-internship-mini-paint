import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'

import { DrawingData } from '../../Components/Canvas/Canvas'
import { db } from '../../firebase'

export async function saveDrawing(uid: string | null, drawingData: DrawingData): Promise<string> {
  const drawingsCollectionRef = collection(db, 'drawings')
  const drawingRef = await addDoc(drawingsCollectionRef, {
    uid,
    drawingData,
  })
  return drawingRef.id
}

export async function getDrawingsByUser(uid: string): Promise<DrawingData[]> {
  const drawingsCollectionRef = collection(db, 'drawings')
  const querySnapshot = await getDocs(query(drawingsCollectionRef, where('uid', '==', uid)))

  return querySnapshot.docs.map((doc) => {
    const drawingData = doc.data().drawingData
    return {
      id: doc.id,
      dataURL: drawingData.dataURL,
    }
  })
}
