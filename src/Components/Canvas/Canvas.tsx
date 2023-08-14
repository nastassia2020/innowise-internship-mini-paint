import React, { useState, useEffect, useCallback } from 'react'

import { saveDrawing } from '../../features/drawings/drawingsApi'
import './Canvas.css'

export interface DrawingData {
  dataURL: string
  id?: string
}

const Canvas = ({
  width,
  height,
  design,
  strokeStyle,
  lineWidth,
}: {
  width: number
  height: number
  design: string
  strokeStyle: string
  lineWidth: number
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingMode, setDrawingMode] = useState<
    'straight line' | 'line' | 'brush' | 'circle' | 'rectangle' | 'triangle'
  >('line')
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const [strokes, setStrokes] = useState<ImageData[]>([])

  useEffect(() => {
    clearStrokes()
  }, [])

  const clearStrokes = () => {
    setStrokes([])
  }

  const handleCanvasMouseMove = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef
      if (!canvas || !isDrawing) {
        return
      }

      const context = canvas.getContext('2d')
      if (!context) {
        return
      }

      context.lineJoin = 'round'
      context.lineCap = 'round'

      const x = event.offsetX
      const y = event.offsetY

      if (drawingMode === 'line' || drawingMode === 'brush') {
        context.strokeStyle = strokeStyle
        context.lineWidth = lineWidth
        context.beginPath()
        context.moveTo(startPos.x, startPos.y)
        context.lineTo(x, y)
        context.stroke()
        setStartPos({ x, y })
      }

      if (
        drawingMode === 'straight line' ||
        drawingMode === 'circle' ||
        drawingMode === 'rectangle' ||
        drawingMode === 'triangle'
      ) {
        context.clearRect(0, 0, canvas.width, canvas.height)

        for (const stroke of strokes) {
          context.putImageData(stroke, 0, 0)
        }

        if (drawingMode === 'straight line') {
          context.strokeStyle = strokeStyle
          context.lineWidth = lineWidth
          context.beginPath()
          context.moveTo(startPos.x, startPos.y)
          context.lineTo(x, y)
          context.stroke()

          if (!isDrawing) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            strokes.push(imageData)
          }
        } else if (drawingMode === 'circle') {
          const r = Math.sqrt(Math.pow(startPos.x - x, 2) + Math.pow(startPos.y - y, 2))
          context.beginPath()
          context.arc(startPos.x, startPos.y, r, 0, 2 * Math.PI, false)
          context.strokeStyle = strokeStyle
          context.lineWidth = lineWidth
          context.stroke()

          if (!isDrawing) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            strokes.push(imageData)
          }
        } else if (drawingMode === 'rectangle') {
          const width = Math.abs(x - startPos.x)
          const height = Math.abs(y - startPos.y)
          context.strokeStyle = strokeStyle
          context.lineWidth = lineWidth
          context.strokeRect(startPos.x, startPos.y, width, height)

          if (!isDrawing) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            strokes.push(imageData)
          }
        } else if (drawingMode === 'triangle') {
          context.beginPath()
          context.moveTo((startPos.x + x) / 2, startPos.y)
          context.lineTo(x, y)
          context.lineTo(startPos.x, y)
          context.closePath()
          context.strokeStyle = strokeStyle
          context.lineWidth = lineWidth
          context.stroke()

          if (!isDrawing) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            strokes.push(imageData)
          }
        }
      }
    },
    [canvasRef, drawingMode, isDrawing, lineWidth, startPos.x, startPos.y, strokeStyle, strokes],
  )

  const handleCanvasMouseDown = useCallback(
    (event: MouseEvent) => {
      setStartPos({ x: event.offsetX, y: event.offsetY })
      setIsDrawing(true)

      if (drawingMode === 'line' || drawingMode === 'brush') {
        const canvas = canvasRef
        if (!canvas) {
          return
        }

        const context = canvas.getContext('2d')
        if (!context) {
          return
        }
        const x = event.offsetX
        const y = event.offsetY
        context.fillStyle = strokeStyle
        context.beginPath()
        context.arc(x, y, lineWidth, 0, 2 * Math.PI)
        context.fill()
      }
    },
    [lineWidth, strokeStyle],
  )

  const handleCanvasMouseUp = useCallback(
    (event: MouseEvent) => {
      setIsDrawing(false)
      const canvas = canvasRef
      if (!canvas) {
        return
      }

      const context = canvas.getContext('2d')
      if (!context) {
        return
      }

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      strokes.push(imageData)
    },
    [canvasRef, setIsDrawing, strokes],
  )

  useEffect(() => {
    const canvas = canvasRef
    if (!canvas) {
      return
    }

    canvas.addEventListener('mousedown', handleCanvasMouseDown)
    canvas.addEventListener('mouseup', handleCanvasMouseUp)
    canvas.addEventListener('mousemove', handleCanvasMouseMove)

    return () => {
      canvas.removeEventListener('mousedown', handleCanvasMouseDown)
      canvas.removeEventListener('mouseup', handleCanvasMouseUp)
      canvas.removeEventListener('mousemove', handleCanvasMouseMove)
    }
  }, [canvasRef, handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasMouseMove])

  const canvasStyle = { cursor: drawingMode === 'brush' ? 'pointer' : 'crosshair' }

  const uid = localStorage.getItem('Auth uid')

  async function handleSaveDrawing() {
    const drawingData = canvasRef?.toDataURL()
    if (drawingData) {
      const drawingId = await saveDrawing(uid, { dataURL: drawingData })
      if (drawingId) {
        alert('Drawing saved')
      }
    }
  }

  const undoneStrokes: ImageData[] = []

  const handleUndo = (canvasRef: HTMLCanvasElement | null, strokes: ImageData[], undoneStrokes: ImageData[]) => {
    const canvas = canvasRef
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const lastStroke = strokes.pop()
    if (lastStroke) {
      undoneStrokes.push(lastStroke)
      context.clearRect(0, 0, canvas.width, canvas.height)
      strokes.forEach((stroke) => {
        context.putImageData(stroke, 0, 0)
      })
    }
  }

  const handleClearCanvas = () => {
    const canvas = canvasRef
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    const stroke = context.getImageData(0, 0, canvas.width, canvas.height)
    strokes.push(stroke)
    context.clearRect(0, 0, canvas.width, canvas.height)

    clearStrokes()
  }

  return (
    <>
      <div className='canvas-wrapper'>
        <canvas ref={setCanvasRef} width={width} height={height} className={design} style={canvasStyle} />
        <div className='image-buttons'>
          <button className='image-btn save' type='button' onClick={handleSaveDrawing}>
            SAVE IMAGE
          </button>
          <button className='image-btn clear' type='button' onClick={handleClearCanvas}>
            Clear Canvas
          </button>
          <button
            className='image-btn cancel'
            type='button'
            onClick={() => handleUndo(canvasRef, strokes, undoneStrokes)}
          >
            Cancel
          </button>
        </div>
      </div>

      <form className='canvas-form'>
        <p>Choose drawing option:</p>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='line'
            checked={drawingMode === 'line'}
            onChange={() => setDrawingMode('line')}
          />
          Line
        </label>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='brush'
            checked={drawingMode === 'brush'}
            onChange={() => setDrawingMode('brush')}
          />
          Brush
        </label>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='straight line'
            checked={drawingMode === 'straight line'}
            onChange={() => setDrawingMode('straight line')}
          />
          Straight line
        </label>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='circle'
            checked={drawingMode === 'circle'}
            onChange={() => setDrawingMode('circle')}
          />
          Circle
        </label>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='rectangle'
            checked={drawingMode === 'rectangle'}
            onChange={() => setDrawingMode('rectangle')}
          />
          Rectangle
        </label>
        <label>
          <input
            type='radio'
            name='drawing-mode'
            value='triangle'
            checked={drawingMode === 'triangle'}
            onChange={() => setDrawingMode('triangle')}
          />
          Triangle
        </label>
      </form>
    </>
  )
}

export default Canvas
