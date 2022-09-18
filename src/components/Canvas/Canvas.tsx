import React, { useRef } from 'react'
import { Fractal, Drawer } from 'models'
import EmptyState from '@atlaskit/empty-state'
import Button from '@atlaskit/button'
import ProgressBar from '@atlaskit/progress-bar'
import { CenterLayout } from 'components'
import { useObserver, useScreenSize } from 'utils'
import { useCanvasUpdate, useCanvasZoom } from './hooks'
import breakpoints from 'styles/breakpoints.module.scss'
import './styles.scss'

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenSize = useScreenSize()
  const isCalculating = useObserver(Fractal.isCalculating)
  const imgData = useObserver(Fractal.imgData)
  const progress = useObserver(Fractal.progress)

  useCanvasUpdate(canvasRef)
  useCanvasZoom(canvasRef, imgData)

  const isScreenSmall = screenSize.width <= parseInt(breakpoints.smallScreen)

  return (
    <div className='fractal'>
      {!imgData && !isCalculating && (
        <CenterLayout className='emptyCaptionWrapper'>
          <EmptyState
            width={isScreenSmall ? 'narrow' : 'wide'}
            header='No fractal has been rendered'
            description='You can set up custom fractal configuration or render an image'
            primaryAction={
              <Button isDisabled={isCalculating} appearance='primary' onClick={Fractal.drawFractal}>
                Render
              </Button>
            }
            secondaryAction={
              <Button isDisabled={isCalculating} onClick={Drawer.openDrawer}>
                Configure
              </Button>
            }
            isLoading={isCalculating}
          />
        </CenterLayout>
      )}
      {isCalculating && (
        <div className='progressBarWrapper'>
          <CenterLayout>
            <div className='progressBar'>
              <ProgressBar value={progress} />
            </div>
          </CenterLayout>
        </div>
      )}
      <canvas ref={canvasRef} className='canvas' />
    </div>
  )
}

export default Canvas
