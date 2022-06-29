import React, { useEffect } from 'react'
import initWasm from './wasm/pkg'
import { SideBar, Canvas } from 'components'
import { provideAvailableScreenSizeToCss, requestNotificationPermissions } from 'utils'

function App() {
  useEffect(() => {
    initWasm()
    provideAvailableScreenSizeToCss()
    requestNotificationPermissions()
  }, [])

  return (
    <div>
      <Canvas />
      <SideBar />
    </div>
  )
}

export default App
