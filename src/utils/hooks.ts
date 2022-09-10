import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'
import { getWindowSize } from './screenSizeUtils'

type ScreenSize = {
  width: number
  height: number
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(getWindowSize())

  useEffect(() => {
    const onResize = () => {
      setScreenSize(getWindowSize())
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return screenSize
}

export function useObserver<T>(subject: BehaviorSubject<T>) {
  const [state, setState] = useState(subject.value)

  useEffect(() => {
    subject.subscribe(setState)
    return () => {
      subject.unsubscribe()
    }
  }, [])

  return state
}
