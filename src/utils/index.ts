export function downloadFromCanvas(canvas: HTMLCanvasElement, name: string) {
  const link = document.createElement('a')
  link.download = name
  link.href = canvas.toDataURL()
  link.click()
}
