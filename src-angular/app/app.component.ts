import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Used to show and hide the header band. By default the header is shown
   */
  public showHeader:boolean = true;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * this method should be called whenever a new route is handled, and the 
   * router-outlet activates a new compoennt
   * @param component the component that was activated in the router-outlet 
   */
  routerOutletActivate( component: any ) {

    // if the component in the router-outlet has a showHeader property, and 
    // that property is set to false, then hide the header band
    if ( typeof component.showHeader == "boolean" && !component.showHeader ) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }
}
