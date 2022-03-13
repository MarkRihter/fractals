import { createEvent, createStore } from 'effector'
import { FractalOption, DefaultFractal } from 'interfaces'
import { Optional, WorkerMessage } from 'interfaces'
import { downloadFromCanvas } from 'utils'

interface Store {
  xSize: number
  ySize: number
  xCenter: number
  yCenter: number
  cReal: number
  cImaginary: number
  progress: Optional<number>
  fractal: FractalOption
  isCalculating: boolean
  img: Optional<string>
}

export const setXSize = createEvent<number>()
export const setYSize = createEvent<number>()
export const setXCenter = createEvent<number>()
export const setYCenter = createEvent<number>()
export const setCReal = createEvent<number>()
export const setCImaginary = createEvent<number>()
export const setProgress = createEvent<Optional<number>>()
export const setFractalType = createEvent<FractalOption>()
export const setFractalCalculating = createEvent<boolean>()
export const drawFractal = createEvent()
export const setImage = createEvent<Optional<string>>()
export const downloadImage = createEvent()

export const $fractalConfig = createStore<Store>({
  xSize: window.innerWidth,
  ySize: window.innerHeight,
  xCenter: 0,
  yCenter: 0,
  cReal: 0,
  cImaginary: 0,
  progress: undefined,
  fractal: DefaultFractal,
  isCalculating: false,
  img: undefined,
})
$fractalConfig
  .on(setXSize, (state, xSize) => {
    canvas.width = xSize
    return { ...state, xSize }
  })
  .on(setYSize, (state, ySize) => {
    canvas.height = ySize
    return { ...state, ySize }
  })
  .on(setFractalType, (state, fractal) => ({ ...state, fractal }))
  .on(setXCenter, (state, xCenter) => ({ ...state, xCenter }))
  .on(setYCenter, (state, yCenter) => ({ ...state, yCenter }))
  .on(setCReal, (state, cReal) => ({ ...state, cReal }))
  .on(setCImaginary, (state, cImaginary) => ({ ...state, cImaginary }))
  .on(setProgress, (state, progress) => ({ ...state, progress }))
  .on(setFractalCalculating, (state, isCalculating) => ({ ...state, isCalculating }))
  .on(setImage, (state, img) => ({ ...state, img, progress: undefined }))
  .on(downloadImage, ({ img, xSize, ySize, fractal }) => {
    if (img) {
      const name = `${fractal.value ? 'Julia' : 'Mandelbrot'}_${xSize}x${ySize}`
      downloadFromCanvas(canvas, name)
    }
  })
  .on(drawFractal, ({ xSize, ySize, fractal, xCenter, yCenter, cReal, cImaginary }) => {
    setFractalCalculating(true)
    setImage(undefined)
    const myImageData = new ImageData(xSize, ySize)
    worker.postMessage({
      myImageData,
      mx: xSize,
      my: ySize,
      fractal: fractal.value,
      xCenter,
      yCenter,
      cReal,
      cImaginary,
    })
  })

export const $isImageExists = $fractalConfig.map(({ img }) => !!img)

const worker = new Worker('worker/fractal.js')
const canvas = document.createElement('canvas')
const fractalConfig = $fractalConfig.getState()
canvas.width = fractalConfig.xSize
canvas.height = fractalConfig.ySize
worker.onmessage = function (e: MessageEvent<WorkerMessage>) {
  const canvas2DContext = canvas.getContext('2d')
  switch (e.data.type) {
    case 'renderCompleted':
      if (!canvas2DContext) return
      canvas2DContext.putImageData(e.data.payload, 0, 0)
      setImage(canvas.toDataURL())
      setFractalCalculating(false)
      break
    case 'renderInProgress':
      setProgress(e.data.payload)
      break
  }
}
