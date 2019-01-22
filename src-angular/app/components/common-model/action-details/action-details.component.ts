import { Component, OnInit, Input } from '@angular/core';
import { ModelActionData } from '../../../services/model-data.service';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})
export class ActionDetailsComponent implements OnInit {

  @Input() action: ModelActionData;
  @Input() cost = -1;

  constructor() { }

  ngOnInit() {
  }

}
