import { Optional } from 'interfaces/utils'
import { WorkerReturnMessageType, FractalType, CalculationProvider } from 'enums'

export interface RenderCompleteMessagePayload {
  data: number[]
  xSize: number
  ySize: number
}

export interface RenderCompleteMessage {
  type: WorkerReturnMessageType.RenderCompleted
  payload: RenderCompleteMessagePayload
}

export interface RenderInProgressMessage {
  type: WorkerReturnMessageType.RenderInProgress
  payload: Optional<number>
}

export type WorkerReturnMessage = RenderCompleteMessage | RenderInProgressMessage

export interface WorkerPostMessage {
  calculationProvider: CalculationProvider
  fractal: FractalType
  xSize: number
  ySize: number
  xCenter: number
  yCenter: number
  cReal: number
  cImaginary: number
  zoom: number
  iterationsCount: number
}
