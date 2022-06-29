import mandelbrotGenerator from './mandelbrot'
import juliaGenerator from './julia'
import { WorkerPostMessage } from 'interfaces'
import { FractalType } from 'enums'
import { ComplexNumber } from 'classes'

export default function valueGenerator(data: WorkerPostMessage, x: number, y: number) {
  const { fractal, xSize, ySize, xCenter, yCenter, cReal, cImaginary } = data
  const divisor = (xSize > ySize ? xSize : ySize) * 0.25
  switch (fractal) {
    case FractalType.Mandelbrot:
      return mandelbrotGenerator(new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter))
    case FractalType.Julia:
      return juliaGenerator(
        new ComplexNumber(cReal, cImaginary),
        new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
      )
    default:
      return mandelbrotGenerator(new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter))
  }
}
