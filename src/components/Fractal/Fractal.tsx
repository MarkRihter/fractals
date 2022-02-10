import React, { useEffect, useRef } from 'react'
import { useStore } from 'effector-react'
import { setImageSize, setFractalCalculating, $fractalConfig } from 'models'
import './index.css'

const Fractal: React.FC = () => {
  const { imgSize, isCalculating } = useStore($fractalConfig)
  const imgRef = useRef<HTMLImageElement>(null)
  const fractalWorkerRef = useRef(new Worker('./fractal.worker.js'))
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))

  useEffect(() => {
    canvasRef.current.width = imgSize
    canvasRef.current.height = imgSize
  }, [imgSize])

  useEffect(() => {
    fractalWorkerRef.current.onmessage = function (e) {
      const canvas2DContext = canvasRef.current.getContext('2d')
      if (!canvas2DContext) return
      canvas2DContext.putImageData(e.data, 0, 0)
      console.log(canvasRef.current.toDataURL())
      if (imgRef.current) imgRef.current.src = canvasRef.current.toDataURL()
      setFractalCalculating(false)
    }

    return () => fractalWorkerRef.current.terminate()
  }, [])

  const drawFractal = () => {
    setFractalCalculating(true)
    const myImageData = new ImageData(imgSize, imgSize)
    fractalWorkerRef.current.postMessage({ myImageData, mx: imgSize, my: imgSize })
  }

  return (
    <div className='fractal'>
      <img alt=' ' ref={imgRef} className='img' />
      <button onClick={drawFractal}>Draw</button>
      <input value={imgSize} onChange={setImageSize} type='number' max={5000} />
      {isCalculating && <p className='calculatingCaption'>Is calculating</p>}
    </div>
  )
}

export default Fractal
