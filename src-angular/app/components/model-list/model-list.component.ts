import { Component, OnInit } from '@angular/core';
import { ModelDataService, ModelData  } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  public models: ModelData[];
  public selectedModel: ModelData;

  constructor( private modelDataService: ModelDataService ) { }

  ngOnInit() {
    this.models = this.modelDataService.getModels();
  }

  onSelect(selectedModel: ModelData ) {
    this.selectedModel = selectedModel;
  }
}
