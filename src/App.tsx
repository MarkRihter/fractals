import React, { useEffect } from 'react'
import initWasm from './wasm/pkg'
import { SideBar, Fractal } from 'components'
import { provideAvailableScreenSizeToCss } from 'utils'

function App() {
  useEffect(() => {
    initWasm()
    provideAvailableScreenSizeToCss()
  }, [])

  return (
    <div>
      <Fractal />
      <SideBar />
    </div>
  )
}

export default App
