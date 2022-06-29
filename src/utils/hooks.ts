import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

type ScreenSize = {
  width: number
  height: number
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const onResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
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
    return subject.unsubscribe
  }, [])

  return state
}
