import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForceDataService, ForceData  } from '../../services/force-data/force-data.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-force-list',
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent implements OnInit {

  public forces: ForceData[];

  constructor( 
    private forceDataService: ForceDataService,
    private router: Router,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.forces = await this.forceDataService.getAllForces();
  }

  async newForce() {
    let newForce: ForceData = await this.forceDataService.createForce();
    this.openForce( newForce._id );
  }

  openForce( forceId: string ) {
    this.router.navigateByUrl("/forces/" + forceId );
  }

}
