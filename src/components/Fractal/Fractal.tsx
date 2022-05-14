import React from 'react'
import clsx from 'clsx'
import { useStore } from 'effector-react'
import EmptyState from '@atlaskit/empty-state'
import Button from '@atlaskit/button'
import ProgressBar from '@atlaskit/progress-bar'
import { CenterLayout } from 'components'
import { $fractalConfig, $sidePanelSettings, drawFractal, openDrawer } from 'models'
import { useScreenSize } from 'utils'
import breakpoints from 'styles/breakpoints.module.scss'
import './styles.scss'

const Fractal: React.FC = () => {
  const { img, isCalculating, progress } = useStore($fractalConfig)
  const { isImageOnFullscreen } = useStore($sidePanelSettings)
  const screenSize = useScreenSize()

  const render = () => drawFractal()
  const configure = () => openDrawer()

  const isScreenSmall = screenSize.width <= parseInt(breakpoints.smallScreen)

  return (
    <div className='fractal'>
      {!img && !isCalculating && (
        <CenterLayout className='emptyCaptionWrapper'>
          <EmptyState
            width={isScreenSmall ? 'narrow' : 'wide'}
            header='No fractal had been rendered'
            description='You can set up custom fractal configuration or render an image'
            primaryAction={
              <Button isDisabled={isCalculating} appearance='primary' onClick={render}>
                Render
              </Button>
            }
            secondaryAction={
              <Button isDisabled={isCalculating} onClick={configure}>
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
      <img src={img} alt='fractal' className={clsx('img', isImageOnFullscreen && 'onFullscreen')} />
    </div>
  )
}

export default Fractal
