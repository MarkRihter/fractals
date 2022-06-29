import { FractalType } from 'enums'

export interface FractalOption {
  label: string
  value: FractalType
}

export const FractalOptions: FractalOption[] = [
  { label: 'Mandelbrot', value: FractalType.Mandelbrot },
  { label: 'Julia', value: FractalType.Julia },
]
export const DefaultFractal = FractalOptions[0]
