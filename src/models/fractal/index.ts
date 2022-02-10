import { createStore, createEvent } from 'effector'
import { ChangeEvent } from 'react'

export const setImageSize = createEvent<ChangeEvent<HTMLInputElement>>()
export const setFractalCalculating = createEvent<boolean>()

export const $fractalConfig = createStore({ imgSize: 150, isCalculating: false })

$fractalConfig
  .on(setImageSize, (state, sizeChangeEvent) => ({
    ...state,
    imgSize: parseInt(sizeChangeEvent.target.value, 10),
  }))
  .on(setFractalCalculating, (state, isCalculating) => ({ ...state, isCalculating }))
