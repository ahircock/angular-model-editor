import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data/force-data.service';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css']
})
export class ForceDetailsComponent implements OnInit {

  public force: ForceData;
  public selectedModel: ModelData;

  // some cost counterse
  public modelCost: number = 0;
  public equipmentCost: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modelDataService: ModelDataService,
    private forceDataService: ForceDataService
  ) { }

  async ngOnInit() {
    
    // load the forceData object
    let forceId = this.activatedRoute.snapshot.paramMap.get("id");
    this.force = await this.forceDataService.getForceById(forceId);
    
    // mark the first model as selected
    if ( this.force.models.length > 0 ) {
      this.selectedModel = this.force.models[0];
    }
  }

  onModelSelect( selectedModel: ModelData ) {
    this.selectedModel = selectedModel;
  }

  async newModelClick() {
    this.force = await this.forceDataService.addNewModelToForce( this.force );
    
    // select the last model in the list (which should be the new model)
    this.selectedModel = this.force.models[ this.force.models.length - 1 ];
  }

  async refreshData() {
    this.force = await this.forceDataService.getForceById(this.force._id);
  }

  async saveForce() {
    this.force = await this.forceDataService.updateForce( this.force );
  }

}
