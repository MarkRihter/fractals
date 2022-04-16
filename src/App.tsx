import React, { useEffect } from 'react'
import initWasm from './wasm/pkg'
import { SideBar, Fractal } from 'components'

function App() {
  useEffect(() => {
    initWasm()
  }, [])

  return (
    <div>
      <Fractal />
      <SideBar />
    </div>
  )
}

export default App
