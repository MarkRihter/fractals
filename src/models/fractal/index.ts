import { createEvent, createStore } from 'effector'
import {
  FractalOption,
  DefaultFractal,
  CalculationProviderOption,
  DefaultCalculationProvider,
} from 'interfaces'
import { Optional, WorkerReturnMessage } from 'interfaces'
import { WorkerReturnMessageType } from 'enums'
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
  calculationProvider: CalculationProviderOption
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
export const setCalculationProvider = createEvent<CalculationProviderOption>()
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
  calculationProvider: DefaultCalculationProvider,
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
  .on(setCalculationProvider, (state, calculationProvider) => ({ ...state, calculationProvider }))
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
  .on(
    drawFractal,
    ({ xSize, ySize, fractal, xCenter, yCenter, cReal, cImaginary, calculationProvider }) => {
      console.time('calculation')
      setFractalCalculating(true)
      setImage(undefined)
      worker.postMessage({
        calculationProvider: calculationProvider.value,
        xSize,
        ySize,
        fractal: fractal.value,
        xCenter,
        yCenter,
        cReal,
        cImaginary,
      })
    }
  )

export const $isImageExists = $fractalConfig.map(({ img }) => !!img)

const worker = new Worker(new URL('../../webWorker', import.meta.url))
const canvas = document.createElement('canvas')
const canvas2DContext = canvas.getContext('2d')
if (canvas2DContext) {
  canvas2DContext.imageSmoothingEnabled = true
  canvas2DContext.imageSmoothingQuality = 'high'
}
const fractalConfig = $fractalConfig.getState()
canvas.width = fractalConfig.xSize
canvas.height = fractalConfig.ySize
worker.onmessage = function (e: MessageEvent<WorkerReturnMessage>) {
  switch (e.data.type) {
    case WorkerReturnMessageType.RenderCompleted:
      renderImageDataOnCanvas(e.data.payload.data, e.data.payload.xSize, e.data.payload.ySize)
      break
    case WorkerReturnMessageType.RenderInProgress:
      setProgress(e.data.payload)
      break
  }
}

export function renderImageDataOnCanvas(data: number[], xSize: number, ySize: number) {
  console.timeEnd('calculation')
  if (!canvas2DContext) return
  const imageData = new ImageData(xSize, ySize)
  imageData.data.set(data)
  canvas2DContext.putImageData(imageData, 0, 0)
  setImage(canvas.toDataURL())
  setFractalCalculating(false)
}
