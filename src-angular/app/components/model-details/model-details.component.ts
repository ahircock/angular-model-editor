import { Component, OnInit, Input } from '@angular/core';
import { ModelData } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css']
})
export class ModelDetailsComponent implements OnInit {

  @Input() model: ModelData;

  constructor() { }

  ngOnInit() {
  }

}
