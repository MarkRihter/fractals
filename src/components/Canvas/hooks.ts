import { useEffect, RefObject, useRef } from 'react'
import { Fractal } from 'models'
import { useObserver } from 'utils'

export function useCanvasUpdate(canvasRef: RefObject<HTMLCanvasElement>) {
  const imgData = useObserver(Fractal.imgData)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!imgData || imgData.data.length === 0 || !canvasEl) return

    const ctx = canvasRef.current?.getContext('2d') ?? new CanvasRenderingContext2D()
    const { xSize, ySize } = Fractal.configuration
    canvasRef.current.width = xSize
    canvasRef.current.height = ySize

    ctx.putImageData(imgData, 0, 0)
  }, [imgData])
}

type MousePosition = {
  x: number
  y: number
}

export function useCanvasZoom(
  canvasRef: RefObject<HTMLCanvasElement>,
  fractalImgData: ImageData | null
) {
  const mouseDownPosition = useRef<MousePosition | null>(null)

  const canvasEl = canvasRef.current
  const ctx = canvasEl?.getContext('2d')
  if (!canvasEl || !ctx) return

  ctx.strokeStyle = '#0065FF'
  ctx.fillStyle = '#0065FF1A'

  canvasEl.onmousedown = ({ x, y }) => (mouseDownPosition.current = { x, y })

  canvasEl.onmousemove = ({ x: xMove }) => {
    if (!mouseDownPosition.current || !ctx || !fractalImgData) return
    const { x: xDown, y: yDown } = mouseDownPosition.current

    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      ctx.putImageData(fractalImgData, 0, 0)
      ctx.beginPath()
      const selectedRegionWidth = xMove - xDown
      ctx.rect(xDown, yDown, selectedRegionWidth, selectedRegionWidth / Fractal.imageAspectRatio)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    })
  }

  canvasEl.onmouseup = ({ x: xUp }) => {
    if (!mouseDownPosition.current) return

    const { xSize, zoom: currentZoom } = Fractal.configuration
    const { x: xDown, y: yDown } = mouseDownPosition.current

    const xCenterInWindowCoordinates = xDown + (xUp - xDown) / 2

    const yCenterInWindowCoordinates = yDown + (xUp - xDown) / Fractal.imageAspectRatio / 2

    const xCenter = ((xCenterInWindowCoordinates - window.innerWidth / 2) / window.innerWidth) * 4
    const yCenter =
      (((window.innerHeight / 2 - yCenterInWindowCoordinates) / window.innerHeight) * 4) /
      Fractal.imageAspectRatio

    const zoom = (xSize / Math.abs(xUp - xDown)) * currentZoom
    Fractal.setConfiguration({ ...Fractal.configuration, zoom, xCenter, yCenter })
    Fractal.drawFractal()

    mouseDownPosition.current = null
  }
}
