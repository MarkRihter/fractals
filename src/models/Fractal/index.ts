import { BehaviorSubject } from 'rxjs'
import {
  CalculationProviderOption,
  DefaultCalculationProvider,
  DefaultFractal,
  FractalOption,
  Optional,
  WorkerReturnMessage,
} from 'interfaces'
import { downloadFromCanvas, isNotificationAvailableAndNecessary } from 'utils'
import { WorkerReturnMessageType } from 'enums'

export interface IConfigurationFields {
  xSize: number
  ySize: number
  fractal: FractalOption
  cReal: number
  cImaginary: number
  calculationProvider: CalculationProviderOption
  xCenter: number
  yCenter: number
  zoom: number
}

class Fractal {
  private readonly worker = new Worker(new URL('webWorker', import.meta.url))
  private readonly canvas = document.createElement('canvas')

  public configuration = {
    xSize: window.innerWidth,
    ySize: window.innerHeight,
    xCenter: 0,
    yCenter: 0,
    cReal: 0,
    cImaginary: 0,
    zoom: 1,
    fractal: DefaultFractal,
    calculationProvider: DefaultCalculationProvider,
  }

  public progress = new BehaviorSubject<Optional<number>>(undefined)
  public fractal = new BehaviorSubject(DefaultFractal)
  public isCalculating = new BehaviorSubject(false)
  public img = new BehaviorSubject<Optional<string>>(undefined)

  constructor() {
    this.canvas.width = this.configuration.xSize
    this.canvas.height = this.configuration.ySize

    this.worker.onmessage = this.onWorkerMessage
  }

  private get canvasContext() {
    return this.canvas.getContext('2d')
  }

  private onWorkerMessage = (e: MessageEvent<WorkerReturnMessage>) => {
    switch (e.data.type) {
      case WorkerReturnMessageType.RenderCompleted:
        this.renderImageDataOnCanvas(
          e.data.payload.data,
          e.data.payload.xSize,
          e.data.payload.ySize
        )
        break
      case WorkerReturnMessageType.RenderInProgress:
        this.setProgress(e.data.payload)
        break
    }
  }

  private renderImageDataOnCanvas = (data: number[], xSize: number, ySize: number) => {
    console.timeEnd('calculation')
    if (!this.canvasContext) return
    const imageData = new ImageData(xSize, ySize)
    imageData.data.set(data)
    this.canvasContext.putImageData(imageData, 0, 0)
    this.setImage(this.canvas.toDataURL())
    this.setFractalCalculatingState(false)

    if (isNotificationAvailableAndNecessary()) new Notification('Fractal is complete!')
  }

  public setConfiguration = (configuration: IConfigurationFields) => {
    this.configuration = configuration

    this.canvas.width = configuration.xSize
    this.canvas.height = configuration.ySize
  }

  public setProgress = (progress: Optional<number>) => {
    this.progress.next(progress)
  }

  public setFractalCalculatingState = (isCalculating: boolean) => {
    this.isCalculating.next(isCalculating)
  }

  public setImage = (image: Optional<string>) => {
    this.img.next(image)
    this.progress.next(undefined)
  }

  public downloadImage = () => {
    if (this.img.value) {
      const name = `${this.fractal.value ? 'Julia' : 'Mandelbrot'}_${this.configuration.xSize}x${
        this.configuration.ySize
      }`
      downloadFromCanvas(this.canvas, name)
    }
  }

  public drawFractal = () => {
    console.time('calculation')
    this.setFractalCalculatingState(true)
    this.setImage(undefined)

    const { calculationProvider, fractal, ...restConfig } = this.configuration

    this.worker.postMessage({
      calculationProvider: calculationProvider.value,
      fractal: fractal.value,
      ...restConfig,
    })
  }
}

export default new Fractal()
