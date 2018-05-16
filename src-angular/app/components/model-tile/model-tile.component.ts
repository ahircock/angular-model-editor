import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';
import { ForceData, ForceDataService } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-model-tile',
  templateUrl: './model-tile.component.html',
  styleUrls: ['./model-tile.component.css']
})
export class ModelTileComponent implements OnInit {

  @Input() model: ModelData;
  @Input() force: ForceData;
  @Input() selected: boolean;
  @Output() change: EventEmitter<void> = new EventEmitter();
  
  constructor(
    private modelDataService: ModelDataService,
    private forceDataService: ForceDataService
  ) { }

  ngOnInit() {
  }

  async increaseForceCount() {
    
    // increase the count on the force object
    let forceModelIndex = this.force.models.findIndex( element => element._id == this.model._id );
    this.force.models[forceModelIndex].count++;

    // save the changes and tell the parent component
    this.force = await this.forceDataService.updateForce(this.force);
    this.change.emit();
  }

  async decreaseForceCount() {

    // decrease the count on the force object
    let forceModelIndex = this.force.models.findIndex( element => element._id == this.model._id );
    this.force.models[forceModelIndex].count--;

    // if the count is now 0, then delete the model entirely
    if ( this.force.models[forceModelIndex].count <= 0 ) {
      this.force.models.splice( forceModelIndex, 1 );
    }

    // save the changes and tell the parent component
    this.force = await this.forceDataService.updateForce(this.force);
    this.change.emit();

  }

}
