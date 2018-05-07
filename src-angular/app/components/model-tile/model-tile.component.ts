import { Component, OnInit, Input } from '@angular/core';
import { ModelData } from '../../services/model-data/model-data.service'

@Component({
  selector: 'app-model-tile',
  templateUrl: './model-tile.component.html',
  styleUrls: ['./model-tile.component.css']
})
export class ModelTileComponent implements OnInit {

  @Input() model: ModelData;
  @Input() selected: boolean;
  
  constructor(
  ) { }

  ngOnInit() {
  }

}
