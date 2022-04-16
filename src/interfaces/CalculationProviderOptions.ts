import { CalculationProvider } from 'enums'

export interface CalculationProviderOption {
  label: string
  value: CalculationProvider
}

export const CalculationProviderOptions: CalculationProviderOption[] = [
  { label: 'Rust via wasm', value: CalculationProvider.Rust },
  { label: 'JavaScript', value: CalculationProvider.JS },
]
export const DefaultCalculationProvider = CalculationProviderOptions[0]
