import { createStore, createEvent } from 'effector'
import { ChangeEvent } from 'react'
import { Optional } from 'interfaces'

export interface Store {
  imgSize: number
  isCalculating: boolean
  img: Optional<string>
}

export const setImageSize = createEvent<ChangeEvent<HTMLInputElement>>()
export const setFractalCalculating = createEvent<boolean>()
export const drawFractal = createEvent()
export const setImage = createEvent<string>()

export const $fractalConfig = createStore<Store>({
  imgSize: 150,
  isCalculating: false,
  img: undefined,
})
$fractalConfig
  .on(setImageSize, (state, sizeChangeEvent) => {
    const imgSize = parseInt(sizeChangeEvent.target.value, 10)
    canvas.width = imgSize
    canvas.height = imgSize
    return {
      ...state,
      imgSize,
    }
  })
  .on(setFractalCalculating, (state, isCalculating) => ({ ...state, isCalculating }))
  .on(setImage, (state, img) => ({ ...state, img }))
  .on(drawFractal, ({ imgSize }) => {
    setFractalCalculating(true)
    const myImageData = new ImageData(imgSize, imgSize)
    worker.postMessage({ myImageData, mx: imgSize, my: imgSize })
  })

const worker = new Worker('./fractal.worker.js')
const canvas = document.createElement('canvas')
const initialImgSize = $fractalConfig.getState().imgSize
canvas.width = initialImgSize
canvas.height = initialImgSize
worker.onmessage = function (e) {
  const canvas2DContext = canvas.getContext('2d')
  if (!canvas2DContext) return
  canvas2DContext.putImageData(e.data, 0, 0)
  console.log(canvas.toDataURL())
  setImage(canvas.toDataURL())
  setFractalCalculating(false)
}
