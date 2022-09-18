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
  iterationsCount: number
}

class Fractal {
  private readonly worker = new Worker(new URL('webWorker', import.meta.url))

  public configuration = {
    xSize: window.innerWidth,
    ySize: window.innerHeight,
    xCenter: 0,
    yCenter: 0,
    cReal: 0,
    cImaginary: 0,
    zoom: 1,
    iterationsCount: 100,
    fractal: DefaultFractal,
    calculationProvider: DefaultCalculationProvider,
  }

  public progress = new BehaviorSubject<Optional<number>>(undefined)
  public fractal = new BehaviorSubject(DefaultFractal)
  public isCalculating = new BehaviorSubject(false)
  public imgData = new BehaviorSubject<ImageData | null>(null)

  constructor() {
    this.worker.onmessage = this.onWorkerMessage
  }

  private onWorkerMessage = (e: MessageEvent<WorkerReturnMessage>) => {
    switch (e.data.type) {
      case WorkerReturnMessageType.RenderCompleted:
        this.renderImageDataOnCanvas(e.data.payload.data)
        break
      case WorkerReturnMessageType.RenderInProgress:
        this.setProgress(e.data.payload)
        break
    }
  }

  private renderImageDataOnCanvas = (data: number[]) => {
    console.timeEnd('calculation')

    this.setImage(data)
    this.setFractalCalculatingState(false)

    if (isNotificationAvailableAndNecessary()) new Notification('Fractal is complete!')
  }

  public setConfiguration = (configuration: IConfigurationFields) => {
    this.configuration = {
      ...this.configuration,
      ...configuration,
      ySize: Math.round((window.innerHeight / window.innerWidth) * configuration.xSize),
    }
  }

  public setProgress = (progress: Optional<number>) => {
    this.progress.next(progress)
  }

  public setFractalCalculatingState = (isCalculating: boolean) => {
    this.isCalculating.next(isCalculating)
  }

  public setImage = (image: number[]) => {
    const { xSize, ySize } = this.configuration
    const newImageData = new ImageData(xSize, ySize)
    newImageData.data.set(image)
    this.imgData.next(newImageData)
    this.progress.next(undefined)
  }

  public downloadImage = () => {
    if (this.imgData.value) {
      const name = `${this.fractal.value ? 'Julia' : 'Mandelbrot'}_${this.configuration.xSize}x${
        this.configuration.ySize
      }`

      const canvas = document.createElement('canvas')
      const { xSize, ySize } = this.configuration
      canvas.width = xSize
      canvas.height = ySize
      canvas.getContext('2d')?.putImageData(this.imgData.value, 0, 0)

      downloadFromCanvas(canvas, name)
    }
  }

  public drawFractal = () => {
    console.time('calculation')
    this.setFractalCalculatingState(true)
    this.setImage([])

    const { calculationProvider, fractal, ...restConfig } = this.configuration

    this.worker.postMessage({
      calculationProvider: calculationProvider.value,
      fractal: fractal.value,
      ...restConfig,
    })
  }

  public get imageAspectRatio() {
    const { xSize, ySize } = this.configuration

    return xSize / ySize
  }
}

export default new Fractal()
