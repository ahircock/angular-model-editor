import { Component, OnInit } from '@angular/core';
import { ModelDataService, ModelData  } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-force-list',
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent implements OnInit {

  public models: ModelData[];
  public selectedModel: ModelData;

  constructor( private modelDataService: ModelDataService ) { }

  async ngOnInit() {
    this.models = await this.modelDataService.getModels();

    // select the first one
    if ( this.models.length > 0 ) {
      this.selectedModel = this.models[0];
    }
  }

}
