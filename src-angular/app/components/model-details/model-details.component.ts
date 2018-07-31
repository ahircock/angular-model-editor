import { Component, OnInit, Input } from '@angular/core';
import { ModelData } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css']
})
export class ModelDetailsComponent implements OnInit {

  @Input() model: ModelData;

  visibleModelRules: boolean = false;

  constructor() { }

  ngOnInit() {

    // loop through and find out if there are any visible model rules
    for ( let rule of this.model.specialRules ) {
      if ( rule.printVisible ) this.visibleModelRules = true;
    }

  }

}
