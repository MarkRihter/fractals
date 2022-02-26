import React from 'react'
import { useStore } from 'effector-react'
import { $fractalConfig } from 'models'
import './index.scss'

const Fractal: React.FC = () => {
  const { img } = useStore($fractalConfig)

  return (
    <div className='fractal'>
      <img src={img} alt=' ' className='img' />
    </div>
  )
}

export default Fractal
