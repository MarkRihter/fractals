import { createStore, createEvent } from 'effector'

interface Store {
  isDrawerOpened: boolean
  isImageOnFullscreen: boolean
}

export const openDrawer = createEvent()
export const closeDrawer = createEvent()
export const setImageSizeState = createEvent<boolean>()

export const $sidePanelSettings = createStore<Store>({
  isDrawerOpened: false,
  isImageOnFullscreen: false,
})
$sidePanelSettings
  .on(openDrawer, state => ({ ...state, isDrawerOpened: true }))
  .on(closeDrawer, state => ({ ...state, isDrawerOpened: false }))
  .on(setImageSizeState, (state, isImageOnFullscreen) => ({ ...state, isImageOnFullscreen }))
