import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForceDataService, ForceData  } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-force-list',
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent implements OnInit {

  public forces: ForceData[];

  constructor( 
    private forceDataService: ForceDataService,
    private router: Router 
  ) { }

  async ngOnInit() {
    this.forces = await this.forceDataService.getAllForces();
  }

  async newForce() {
    let newForce: ForceData = await this.forceDataService.addNewForce();
    this.openForce( newForce._id );
  }

  openForce( forceId: string ) {
    this.router.navigateByUrl("/forces/" + forceId );
  }

}
