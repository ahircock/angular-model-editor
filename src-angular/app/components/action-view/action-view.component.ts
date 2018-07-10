import { Component, OnInit, Input } from '@angular/core';
import { ActionData } from '../../services/action-data/action-data.service'

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent implements OnInit {

  @Input() action: ActionData;

  constructor() { }

  ngOnInit() {
    console.log( this.action.toString() )
  }

}
