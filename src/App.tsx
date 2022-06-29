import React, { useEffect } from 'react'
import initWasm from './wasm/pkg'
import { SideBar, Canvas } from 'components'
import { provideAvailableScreenSizeToCss } from 'utils'

function App() {
  useEffect(() => {
    initWasm()
    provideAvailableScreenSizeToCss()
  }, [])

  return (
    <div>
      <Canvas />
      <SideBar />
    </div>
  )
}

export default App
