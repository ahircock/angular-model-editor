import { Component, OnInit, Input } from '@angular/core';
import { ActionData, ActionDataService } from '../../services/action-data/action-data.service'

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent implements OnInit {

  @Input() action: ActionData;
  @Input() editable: boolean = false;

  constructor(
    private actionDataService: ActionDataService
  ) { }

  ngOnInit() {
  }

  updateAction() {
    this.actionDataService.updateAction(this.action);
  }

}
