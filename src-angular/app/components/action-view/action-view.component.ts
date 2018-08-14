import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionData, ActionDataService } from '../../services/action-data.service'
import { SpecialRuleData } from '../../services/special-rule-data.service';
import { ModelDataService, ModelActionData } from '../../services/model-data.service'

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent implements OnInit, OnChanges {

  @Input() action: ActionData;
  @Input() allowEdit: boolean = false;
  @Input() showMetaInfo: boolean = false;
  @Output() deleteModelAction = new EventEmitter<ActionData>();
  @Output() updated = new EventEmitter<ActionData>();
  editable: boolean = false;

  showAPDropdown: boolean = false;
  isModelAction: boolean = false;
  modelActionEditable: boolean = false;

  public AP_VALUES = [ {ap:0, once:false}, {ap:1, once:false}, {ap:2, once:false}, {ap:0, once:true}, {ap:1, once:true}, {ap:2, once:true} ];

  constructor(
    private actionDataService: ActionDataService,
    public modelDataService: ModelDataService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    // if this action is on a model
    let modelAction: ModelActionData = ( this.action as ModelActionData );
    if ( typeof modelAction.modelActionName != "undefined" ) {
      this.isModelAction = true;
    } else {
      this.isModelAction = false;
    }

    // if the action changes, then make sure this one is editable
    if ( this.allowEdit && this.action.editable && !this.isModelAction ) {
      this.editable = true;
    } else {
      this.editable = false;
    }

    // can you edit the model action name
    if ( this.isModelAction && this.allowEdit ) {
      this.modelActionEditable = true;
    } else {
      this.modelActionEditable = false;
    }
  }

  async updateAction() {

    // as long as this action has an _id, then update it
    if ( this.action._id ) {
      await this.actionDataService.updateAction(this.action);
    }

    // notify parents that this changed
    this.updated.emit();
  }

  selectAP(ap: number, once: boolean) {
    this.action.AP = ap;
    this.action.ONCE = once;
    this.updateAction();
    this.showAPDropdown = false;
  }

  addRule( rule: SpecialRuleData ) {
    this.action.specialRules.push(rule);
    this.updateAction();
  }

  deleteRule( ruleIndex: number ) {
    this.action.specialRules.splice( ruleIndex, 1 );
    this.updateAction();
  }

  selectStat( value: any, type: string ): void {
    
    let newStat = Number(value);

    switch ( type ) {
      case "RNG-MELEE": this.action.RNG = newStat; break;
      case "RNG-RANGED":this.action.RNG = newStat; break;
      case "HIT": this.action.HIT = newStat; break;
      case "DMG": this.action.DMG = newStat; break;
    }

    // update the cost of the model
    this.updateAction();
  }

}
