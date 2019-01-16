import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data.service';

@Component({
  selector: 'app-force-print',
  templateUrl: './force-print.component.html',
  styleUrls: ['./force-print.component.css']
})
export class ForcePrintComponent implements OnInit {

  /**
   * The details of the force being shown
   */
  public force: ForceData;

  public leftModels: ForceModelData[] = [];
  public rightModels: ForceModelData[] = [];

  /**
   * This property is checked by the parent component, and
   * is used to show or hide the application header band
   */
  public showHeader = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private forceDataService: ForceDataService
  ) { }

  async ngOnInit() {
    // load the force object
    const forceId = this.activatedRoute.snapshot.paramMap.get('id');
    this.force = await this.forceDataService.getForceById(forceId);

    // add the first half of the models to the left array, and the second half to the right
    for ( let i = 0; i < this.force.models.length; i++ ) {
      if ( i >= this.force.models.length / 2 ) {
        this.rightModels.push( this.force.models[i] );
      } else {
        this.leftModels.push( this.force.models[i] );
      }
    }

    // open the print window
    // window.print();
  }

}
