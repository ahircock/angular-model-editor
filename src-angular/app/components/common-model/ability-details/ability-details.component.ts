import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ModelAbilityData } from '../../../services/model-data.service';

@Component({
  selector: 'app-ability-details',
  templateUrl: './ability-details.component.html',
  styleUrls: ['./ability-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbilityDetailsComponent implements OnInit {

  @Input() ability: ModelAbilityData;

  constructor() { }

  ngOnInit() {
  }

}
