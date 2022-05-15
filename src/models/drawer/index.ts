import { createStore, createEvent } from 'effector'

interface Store {
  isDrawerOpened: boolean
}

export const openDrawer = createEvent()
export const closeDrawer = createEvent()

export const $sidePanelSettings = createStore<Store>({
  isDrawerOpened: false,
})
$sidePanelSettings
  .on(openDrawer, state => ({ ...state, isDrawerOpened: true }))
  .on(closeDrawer, state => ({ ...state, isDrawerOpened: false }))
