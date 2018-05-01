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
  public editMode: boolean = false;

  constructor( private modelDataService: ModelDataService ) { }

  async ngOnInit() {
    this.models = await this.modelDataService.getModels();

    // select the first one
    if ( this.models.length > 0 ) {
      this.selectedModel = this.models[0];
    }
  }

  onSelect(selectedModel: ModelData ) {
    this.selectedModel = selectedModel;
    this.editMode = false;
  }

  setEditMode(newVal: boolean) {
    this.editMode = newVal;
  }
}
