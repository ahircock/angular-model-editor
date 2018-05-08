import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData } from '../../services/force-data/force-data.service';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css']
})
export class ForceDetailsComponent implements OnInit {

  public id: string;
  public force: ForceData;
  public models: ModelData[];
  public selectedModel: ModelData;

  // some cost counterse
  public modelCost: number;
  public equipmentCost: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modelDataService: ModelDataService,
    private forceDataService: ForceDataService
  ) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if ( this.id == "NEW") {
      this.initNewForce();
    } else {
      await this.initForceFromId();
    }

    this.calculateCost();
    
    // mark the first model as selected
    if ( this.models.length > 0 ) {
      this.selectedModel = this.models[0];
    }

  }

  private initNewForce() {
    this.force = { _id:this.id, name:"New Force", sizeName:"Standard", maxCost:200, cost:0, models:[], equipment:[]};
    this.models = [];
  }

  private async initForceFromId() {
    this.force = await this.forceDataService.getForceById(this.id);    
    let modelIdList: string[] = [];
    for ( let forceModelData of this.force.models ) {
      modelIdList.push( forceModelData._id );
    }
    this.models = await this.modelDataService.getModelListById( modelIdList );
  }

  onModelSelect( selectedModel: ModelData ) {
    this.selectedModel = selectedModel;
  }

  newModelClick() {
    let newModel = this.modelDataService.initNewModel();
    this.force.models.push ( { _id:newModel._id, count:1 } );
    this.models.push( newModel );
    this.calculateCost();
  }

  calculateCost() {
    
    // get the total cost of models
    this.modelCost = 0;
    for ( let i=0; i<this.models.length; i++ ) {
      this.modelCost += this.models[i].cost * this.force.models[i].count;
    }

    // get the total cost of equipment
    this.equipmentCost = 0;

    this.force.cost = this.modelCost + this.equipmentCost;
  }

}
