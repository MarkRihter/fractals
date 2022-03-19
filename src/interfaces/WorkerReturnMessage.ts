import { Optional } from 'interfaces/utils'
import { WorkerReturnMessageType, Fractal } from 'enums'

interface RenderCompleteMessage {
  type: WorkerReturnMessageType.RenderCompleted
  payload: ImageData
}

interface RenderInProgressMessage {
  type: WorkerReturnMessageType.RenderInProgress
  payload: Optional<number>
}

export type WorkerReturnMessage = RenderCompleteMessage | RenderInProgressMessage

export interface WorkerPostMessage {
  fractal: Fractal
  myImageData: ImageData
  mx: number
  my: number
  xCenter: number
  yCenter: number
  cReal: number
  cImaginary: number
}
