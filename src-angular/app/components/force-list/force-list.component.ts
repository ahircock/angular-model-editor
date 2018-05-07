import { Component, OnInit } from '@angular/core';
import { ForceDataService, ForceData  } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-force-list',
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent implements OnInit {

  public forces: ForceData[];

  constructor( private forceDataService: ForceDataService ) { }

  async ngOnInit() {
    this.forces = await this.forceDataService.getForces();
  }

  onSelect( selectedForce: ForceData ) {
    
  }

}
