export interface WorkerMessage {
  type: 'renderCompleted' | 'renderInProgress'
  payload: any
}
