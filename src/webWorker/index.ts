/* eslint-disable no-restricted-globals */
import { ComplexNumber } from 'classes'
import { Fractal, WorkerReturnMessageType } from 'enums'
import { WorkerPostMessage } from 'interfaces'
import { mandelbrotGenerator, juliaGenerator } from './generators'

function postProgress(progress: number) {
  self.postMessage({ type: WorkerReturnMessageType.RenderInProgress, payload: progress })
}

self.onmessage = (e: MessageEvent<WorkerPostMessage>) => {
  if (e && e.data) {
    const { myImageData, mx, my, xCenter, yCenter, fractal, cReal, cImaginary } = e.data
    const zoomVariable = 0.25

    for (let y = -my / 2; y < my / 2; y++) {
      const canvasY = y + my / 2
      postProgress(canvasY / my)
      for (let x = -mx / 2; x < mx / 2; x++) {
        const canvasX = x + mx / 2

        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 0
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 0
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 0

        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 3] = 255

        const divisor = (mx > my ? mx : my) * zoomVariable

        let value
        switch (fractal) {
          case Fractal.Mandelbrot:
            value = mandelbrotGenerator(
              new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
            )
            break
          case Fractal.Julia:
            value = juliaGenerator(
              new ComplexNumber(cReal, cImaginary),
              new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
            )
            break
        }

        for (let i = 0; i < 100; i++) {
          const z = value.next().value

          if (ComplexNumber.module(z) >= 2) {
            myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 255
            myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 255
            myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 255
            break
          }
        }
      }
    }

    self.postMessage({ type: WorkerReturnMessageType.RenderCompleted, payload: myImageData })
  }
}
