import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public showHeader:boolean = true;

  routerOutletActivate( component: any ) {

    if ( typeof component.showHeader == "boolean" && !component.showHeader ) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}
