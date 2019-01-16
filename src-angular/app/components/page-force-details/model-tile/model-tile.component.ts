import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForceData, ForceDataService, ForceModelData } from '../../../services/force-data.service';

@Component({
  selector: 'app-model-tile',
  templateUrl: './model-tile.component.html',
  styleUrls: ['./model-tile.component.css']
})
export class ModelTileComponent implements OnInit {

  @Input() model: ForceModelData;
  @Input() force: ForceData;
  @Input() selected: boolean;
  @Output() increaseCount: EventEmitter<void> = new EventEmitter();
  @Output() decreaseCount: EventEmitter<void> = new EventEmitter();

  constructor(
    private forceDataService: ForceDataService
  ) { }

  ngOnInit() {
  }
}
