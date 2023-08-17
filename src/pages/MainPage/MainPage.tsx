import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import Canvas from '../../Components/Canvas/Canvas'
import './MainPage.css'

const MainPage = () => {
  const [strokeStyle, setStrokeStyle] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(1)
  const [canvasWidth, setCanvasWidth] = useState(1000)
  const [canvasHeight, setCanvasHeight] = useState(600)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth - 600)
      setCanvasHeight(window.innerHeight - 100)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='main-page'>
      <button
        className='collection-btn my-collection'
        type='button'
        title='My collection'
        onClick={() => navigate('/drawings')}
      >
        {' '}
        MY COLLECTION
      </button>
      <button className='collection-btn all-collections' type='button' onClick={() => navigate('/allcollections')}>
        ALL USERS COLLECTION
      </button>
      <Canvas
        width={canvasWidth}
        height={canvasHeight}
        design={'canvas'}
        lineWidth={lineWidth}
        strokeStyle={strokeStyle}
      />
      <form className='color-width-options'>
        <label htmlFor='color' title='Color'>
          Choose color
        </label>
        <input
          type='color'
          name='color'
          onChange={(e) => setStrokeStyle(e.target.value)}
          placeholder='Choose your color'
        />
        <label htmlFor='lineWidth'>Choose line width: </label>
        <input
          type='range'
          name='lineWidth'
          id='lineWidth'
          min='1'
          max='10'
          step='1'
          value={lineWidth}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value, 10)
            setLineWidth(value)
          }}
        />
        <output htmlFor='lineWidth'>{lineWidth}</output>
      </form>
    </div>
  )
}

export default MainPage
