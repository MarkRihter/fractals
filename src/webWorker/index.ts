import { ComplexNumber } from 'classes'
import { CalculationProvider, WorkerReturnMessageType } from 'enums'
import { WorkerPostMessage } from 'interfaces'
import init, { render_fractal } from 'wasm/pkg'
import valueGenerator from './generator'

self.onmessage = (e: MessageEvent<WorkerPostMessage>) => {
  if (e && e.data) {
    const { xSize, ySize, fractal, xCenter, yCenter, cReal, cImaginary, zoom } = e.data
    switch (e.data.calculationProvider) {
      case CalculationProvider.Rust:
        init().then(() =>
          render_fractal(xSize, ySize, fractal, xCenter, yCenter, cReal, cImaginary, zoom)
        )
        break
      case CalculationProvider.JS:
        renderFractal(e.data)
        break
    }
  }
}

function renderFractal(data: WorkerPostMessage) {
  const { xSize, ySize } = data
  const pixelData = []
  let dispatchedProgress = 0

  for (let y = -ySize / 2; y < ySize / 2; y++) {
    const canvasY = y + ySize / 2

    const currentProgress = Number((canvasY / ySize).toFixed(2))
    if (currentProgress > dispatchedProgress) {
      dispatchedProgress = currentProgress
      postProgress(currentProgress)
    }

    for (let x = -xSize / 2; x < xSize / 2; x++) {
      const canvasX = x + xSize / 2

      pixelData[canvasX * 4 + canvasY * xSize * 4] = 0
      pixelData[canvasX * 4 + canvasY * xSize * 4 + 1] = 0
      pixelData[canvasX * 4 + canvasY * xSize * 4 + 2] = 0

      pixelData[canvasX * 4 + canvasY * xSize * 4 + 3] = 255

      const valueIterator = valueGenerator(data, x, y)

      for (let i = 0; i < 100; i++) {
        const { value } = valueIterator.next()

        if (ComplexNumber.module(value) >= 2) {
          pixelData[canvasX * 4 + canvasY * xSize * 4] = 255
          pixelData[canvasX * 4 + canvasY * xSize * 4 + 1] = 255
          pixelData[canvasX * 4 + canvasY * xSize * 4 + 2] = 255
          break
        }
      }
    }
  }

  completeRender(pixelData, xSize, ySize)
}

export function postProgress(progress: number) {
  self.postMessage({ type: WorkerReturnMessageType.RenderInProgress, payload: progress })
}

export function completeRender(pixelData: number[], xSize: number, ySize: number) {
  self.postMessage({
    type: WorkerReturnMessageType.RenderCompleted,
    payload: { data: pixelData, xSize: xSize, ySize: ySize },
  })
}
