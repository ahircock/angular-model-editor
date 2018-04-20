import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() model: ModelData;
  public modelId: string;

  constructor( 
    private location: Location,
    private route: ActivatedRoute,
    private modelDataService: ModelDataService
   ) { }

  async ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.model = await this.modelDataService.getModel(id);
  }

  ok(): void {
    this.location.back();
  }

}
