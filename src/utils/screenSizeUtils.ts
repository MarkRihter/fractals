export function provideAvailableScreenSizeToCss() {
  const onResize = () => {
    const heightMeasurer = document.createElement('div')
    heightMeasurer.style.width = '0px'
    heightMeasurer.style.height = '100vh'
    heightMeasurer.style.position = 'absolute'

    document.body.appendChild(heightMeasurer)
    const availableScreenHeight = heightMeasurer.getBoundingClientRect().height
    document.body.removeChild(heightMeasurer)

    document.body.style.setProperty('--fullHeight', `${window.innerHeight}px`)
    document.body.style.setProperty('--fullWidth', `${window.innerWidth}px`)
    document.body.style.setProperty(
      '--addressBarHeight',
      `${availableScreenHeight - window.innerHeight}px`
    )
  }
  onResize()
  window.addEventListener('resize', onResize)
}
