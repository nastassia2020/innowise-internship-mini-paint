import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getDrawings } from '../../features/drawings/DrawingsSlice'

import './DrawingList.css'

function DrawingsList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const uid = localStorage.getItem('Auth uid')
  const drawings = useAppSelector((state) => state.drawings.items)

  useEffect(() => {
    if (uid) {
      dispatch(getDrawings(uid))
    }
  }, [dispatch, uid])

  console.log(drawings)

  return (
    <div className='drawings-list'>
      <h2>My Drawings</h2>
      <button className='drawings-list-btn' type='button' onClick={() => navigate('/')}>
        Return to canvas
      </button>
      {drawings.map((drawing) => (
        <img className='drawing' key={drawing.id} src={drawing.dataURL} alt={`Drawing ${drawing.id}`} />
      ))}
    </div>
  )
}

export default DrawingsList
