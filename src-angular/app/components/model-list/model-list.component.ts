import { Component, OnInit } from '@angular/core';
import { ModelDataService, ModelData  } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  public models: ModelData[];
  public selectedModelIndex: number;

  constructor( private modelDataService: ModelDataService ) { }

  async ngOnInit() {
    this.models = await this.modelDataService.getAllTemplates();

    // select the first one
    if ( this.models.length > 0 ) {
      this.selectedModelIndex = 0;
    }
  }

  async refreshData() {
    this.models = await this.modelDataService.getAllTemplates();
  }

  onSelect( selectedModelIndex: number ) {
    this.selectedModelIndex = selectedModelIndex;
  }

  async modelDetailsChanged( modelIndex: number ) {
    let updatedModel = await this.modelDataService.getModelById( this.models[modelIndex]._id );
    this.models[modelIndex] = updatedModel;    
  }
}
