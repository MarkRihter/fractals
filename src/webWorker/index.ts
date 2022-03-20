import { ComplexNumber } from 'classes'
import { WorkerReturnMessageType } from 'enums'
import { WorkerPostMessage } from 'interfaces'
import valueGenerator from './generator'

function postProgress(progress: number) {
  self.postMessage({ type: WorkerReturnMessageType.RenderInProgress, payload: progress })
}

self.onmessage = (e: MessageEvent<WorkerPostMessage>) => {
  if (e && e.data) {
    const { myImageData, mx, my } = e.data

    for (let y = -my / 2; y < my / 2; y++) {
      const canvasY = y + my / 2
      postProgress(canvasY / my)
      for (let x = -mx / 2; x < mx / 2; x++) {
        const canvasX = x + mx / 2

        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 0
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 0
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 0

        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 3] = 255

        const valueIterator = valueGenerator(e.data, x, y)

        for (let i = 0; i < 100; i++) {
          const { value } = valueIterator.next()

          if (ComplexNumber.module(value) >= 2) {
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
