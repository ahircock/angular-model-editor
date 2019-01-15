import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data.service';
import { ForceData, ForceDataService, ForceModelData } from '../../services/force-data.service';

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
    const forceModelIndex = this.force.models.findIndex( element => element._id === this.model._id );
    this.force.models[forceModelIndex].count++;

    // save the changes and tell the parent component
    this.force = await this.forceDataService.updateForce(this.force);
    this.change.emit();
  }

  async decreaseForceCount() {

    // decrease the count on the force object
    const forceModelIndex = this.force.models.findIndex( element => element._id === this.model._id );
    this.force.models[forceModelIndex].count--;

    // save the changes and tell the parent component
    this.force = await this.forceDataService.updateForce(this.force);
    this.change.emit();
  }
}
