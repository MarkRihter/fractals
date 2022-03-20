import mandelbrotGenerator from './mandelbrot'
import juliaGenerator from './julia'
import { WorkerPostMessage } from 'interfaces'
import { Fractal } from 'enums'
import { ComplexNumber } from 'classes'

export default function valueGenerator(data: WorkerPostMessage, x: number, y: number) {
  const { fractal, mx, my, xCenter, yCenter, cReal, cImaginary } = data
  const divisor = (mx > my ? mx : my) * 0.25 // 0.25 to interpolate from 0..1 to 0..4
  switch (fractal) {
    case Fractal.Mandelbrot:
      return mandelbrotGenerator(new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter))
    case Fractal.Julia:
      return juliaGenerator(
        new ComplexNumber(cReal, cImaginary),
        new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
      )
  }
}
