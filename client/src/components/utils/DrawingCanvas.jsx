import * as React from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import { FaEraser, FaTrash } from 'react-icons/fa'
import '../../styles/DrawingCanvas.css'

const ToggleButton = props => {
  const [checked, setChecked] = React.useState(false)
  const buttonRef = React.useRef(null)
  React.useEffect(() => {
    if (checked) {
      props.canvasRef.current.eraseMode(true)
      buttonRef.current.classList.remove('btn-outline-dark')
      buttonRef.current.classList.add('btn-dark')
    } else {
      props.canvasRef.current.eraseMode(false)
      buttonRef.current.classList.remove('btn-dark')
      buttonRef.current.classList.add('btn-outline-dark')
    }
  }, [checked])

  return (
    <button
      data-toggle='tooltip'
      data-placement='top'
      title='Toggle eraser'
      ref={buttonRef}
      id='eraserButton'
      onClick={() => {
        setChecked(!checked)
      }}
      type='button'
      className={`btn btn-outline-dark`}
    >
      <FaEraser />
    </button>
  )
}

const DrawingCanvas = props => {
  const [strokeColor, setStrokeColor] = React.useState('black')

  return (
    <>
      <label className='align-self-start mt-3' htmlFor='drawingCanvasWrapper'>
        Draw sumn
      </label>
      <div id='toolBar'>
        <button
          data-toggle='tooltip'
          data-placement='top'
          title='Clear canvas'
          onClick={() => {
            props.canvasRef.current.clearCanvas()
          }}
          className='btn btn-outline-danger'
        >
          <FaTrash />
        </button>

        <input
          data-toggle='tooltip'
          data-placement='top'
          title='Pick color'
          type='color'
          onChange={event => {
            setStrokeColor(event.target.value)
          }}
          className='btn btn-outline-dark align-self-stretch h-100'
        />

        <ToggleButton canvasRef={props.canvasRef} />
      </div>
      <div className='form-control drawingCanvasWrapper'>
        <ReactSketchCanvas
          eraserWidth={20}
          ref={props.canvasRef}
          height='400px'
          width='700px'
          strokeColor={strokeColor}
          className='form-control m-1 p-1 react-sketch-canvas'
        />
      </div>
    </>
  )
}

export default DrawingCanvas
