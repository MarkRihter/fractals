export function requestNotificationPermissions() {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'denied') Notification.requestPermission()
}

export function isNotificationAvailableAndNecessary() {
  return (
    'Notification' in window &&
    Notification.permission === 'granted' &&
    document.visibilityState !== 'visible'
  )
}
