import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class WindowService {

  public windowResizedEvent: EventEmitter<number> = new EventEmitter();
  private MOBILE_WINDOW_WIDTH = 600;

  constructor() { }

  windowResized() {
    this.windowResizedEvent.emit(this.getWindowWidth());
  }

  getWindowWidth() {
    return window.innerWidth;
  }

  isWindowMobile() {
    return this.getWindowWidth() <= this.MOBILE_WINDOW_WIDTH ? true : false;
  }

}
