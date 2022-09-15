import { ComplexNumber } from 'classes'
import { CalculationProvider, WorkerReturnMessageType } from 'enums'
import { WorkerPostMessage } from 'interfaces'
import init, { render_fractal } from 'wasm/pkg'
import valueGenerator from './generator'

self.onmessage = async (e: MessageEvent<WorkerPostMessage>) => {
  if (e && e.data) {
    const {
      xSize: x_size,
      ySize: y_size,
      fractal: fractal_type,
      xCenter: x_center,
      yCenter: y_center,
      cReal: c_real,
      cImaginary: c_imaginary,
      zoom,
      iterationsCount: iterations_count,
    } = e.data
    switch (e.data.calculationProvider) {
      case CalculationProvider.Rust:
        await init()
        render_fractal({
          x_size,
          y_size,
          fractal_type,
          x_center,
          y_center,
          c_real,
          c_imaginary,
          zoom,
          iterations_count,
        })
        break
      case CalculationProvider.JS:
        renderFractal(e.data)
        break
    }
  }
}

function renderFractal(data: WorkerPostMessage) {
  const { xSize, ySize, iterationsCount } = data
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

      for (let i = 0; i < iterationsCount; i++) {
        const { value } = valueIterator.next()

        if (ComplexNumber.module(value) >= 2) {
          const continuesIndexLog = i + 1 - Math.log(2) / ComplexNumber.module(value) / Math.log(2)

          pixelData[canvasX * 4 + canvasY * xSize * 4] =
            Math.sin(0.016 * continuesIndexLog + 2) * 100 + 155

          pixelData[canvasX * 4 + canvasY * xSize * 4 + 1] =
            Math.sin(0.014 * continuesIndexLog + 3) * 100 + 155

          pixelData[canvasX * 4 + canvasY * xSize * 4 + 2] =
            Math.sin(0.08 * continuesIndexLog + 4) * 100 + 155

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
