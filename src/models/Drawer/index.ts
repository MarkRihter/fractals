import { BehaviorSubject } from 'rxjs'

class Drawer {
  public isDrawerOpened = new BehaviorSubject(false)

  public openDrawer = () => {
    this.isDrawerOpened.next(true)
  }

  public closeDrawer = () => {
    this.isDrawerOpened.next(false)
  }
}

export default new Drawer()
