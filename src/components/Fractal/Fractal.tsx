import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

const Fractal: React.FC = () => {
  const [isCalculating, setCalculating] = useState(false)
  const [imgSize, setImgSize] = useState(150)
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
      setCalculating(false)
    }

    return () => fractalWorkerRef.current.terminate()
  }, [])

  const drawFractal = () => {
    setCalculating(true)
    const myImageData = new ImageData(imgSize, imgSize)
    fractalWorkerRef.current.postMessage({
      myImageData,
      mx: imgSize,
      my: imgSize,
    })
  }

  const onSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImgSize(parseInt(e.target.value, 10))
  }

  return (
    <div className='fractal'>
      <img ref={imgRef} className='img' />
      <button onClick={drawFractal}>Draw</button>
      <input value={imgSize} onChange={onSizeChange} />
      {isCalculating && <p className='calculatingCaption'>Is calculating</p>}
    </div>
  )
}

export default Fractal
