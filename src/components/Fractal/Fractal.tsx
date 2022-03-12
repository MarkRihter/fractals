import React from 'react'
import clsx from 'clsx'
import { useStore } from 'effector-react'
import EmptyState from '@atlaskit/empty-state'
import Button from '@atlaskit/button'
import ProgressBar from '@atlaskit/progress-bar'
import { CenterLayout } from 'components'
import { $fractalConfig, $sidePanelSettings, drawFractal, openDrawer } from 'models'
import './styles.scss'

const Fractal: React.FC = () => {
  const { img, isCalculating, progress } = useStore($fractalConfig)
  const { isImageOnFullscreen } = useStore($sidePanelSettings)

  const render = () => drawFractal()
  const configure = () => openDrawer()

  return (
    <div className='fractal'>
      {!img && !isCalculating && (
        <CenterLayout className='emptyCaptionWrapper'>
          <EmptyState
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
      <img src={img} alt=' ' className={clsx('img', isImageOnFullscreen && 'onFullscreen')} />
    </div>
  )
}

export default Fractal
