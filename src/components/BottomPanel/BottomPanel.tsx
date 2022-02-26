import React from 'react'
import { useStore } from 'effector-react'
import { $fractalConfig, setImageSize, drawFractal } from 'models'
import './styles.scss'

const BottomPanel: React.FC = () => {
  const { imgSize } = useStore($fractalConfig)

  return (
    <div className='bottomPanel'>
      <button onClick={() => drawFractal()}>Draw</button>
      <input value={imgSize} onChange={setImageSize} type='number' max={5000} />
    </div>
  )
}

export default BottomPanel
