import { Component } from '@angular/core';
import { WindowService } from './services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.backgrounds.css']
})
export class AppComponent {

  /**
   * Used to show and hide the header band. By default the header is shown
   */
  public showHeader = true;

  constructor(
    private windowService: WindowService
  ) {}

  /**
   * Angular calls this method whenever a new route is handled, and the
   * router-outlet activates a new component. Components are able to hide the
   * header by creating an instance variable named showHeader and setting it to
   * false.
   *
   * @param component the component that was activated in the router-outlet
   */
  routerOutletActivate( component: any ) {

    // if the component in the router-outlet has a showHeader property, and
    // that property is set to false, then hide the header band
    if ( typeof component.showHeader === 'boolean' && !component.showHeader ) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }

  windowResized() {
    this.windowService.windowResized();
  }
}
