import { Component, OnInit, Input } from '@angular/core';
import { ActionData, ActionDataService } from '../../services/action-data/action-data.service'
import { SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent implements OnInit {

  @Input() action: ActionData;
  @Input() editable: boolean = false;

  showAPDropdown: boolean = false;

  constructor(
    private actionDataService: ActionDataService
  ) { }

  ngOnInit() {
  }

  updateAction() {
    this.actionDataService.updateAction(this.action);
  }

  selectAP(ap: number, once: boolean) {
    this.action.AP = ap;
    this.action.ONCE = once;
    this.updateAction();
    this.showAPDropdown = false;
  }

  addAttackRule( rule: SpecialRuleData ) {
    this.action.specialRules.push(rule);
    this.updateAction();
  }

  deleteAttackRule( ruleIndex: number ) {
    this.action.specialRules.splice( ruleIndex, 1 );
    this.updateAction();
  }

}
