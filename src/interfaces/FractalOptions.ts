import { Fractal } from 'enums'

export interface FractalOption {
  label: string
  value: Fractal
}

export const FractalOptions: FractalOption[] = [
  { label: 'Mandelbrot', value: Fractal.Mandelbrot },
  { label: 'Julia', value: Fractal.Julia },
]
export const DefaultFractal = FractalOptions[0]
