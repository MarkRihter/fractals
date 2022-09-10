import React from 'react'
import EmptyState from '@atlaskit/empty-state'
import Button from '@atlaskit/button'
import ProgressBar from '@atlaskit/progress-bar'
import { CenterLayout } from 'components'
import { Fractal, Drawer } from 'models'
import { useObserver, useScreenSize } from 'utils'
import breakpoints from 'styles/breakpoints.module.scss'
import './styles.scss'

const Canvas: React.FC = () => {
  const screenSize = useScreenSize()
  const isCalculating = useObserver(Fractal.isCalculating)
  const img = useObserver(Fractal.img)
  const progress = useObserver(Fractal.progress)

  const isScreenSmall = screenSize.width <= parseInt(breakpoints.smallScreen)

  return (
    <div className='fractal'>
      {!img && !isCalculating && (
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
      <img src={img} alt='fractal' className='img' />
    </div>
  )
}

export default Canvas
