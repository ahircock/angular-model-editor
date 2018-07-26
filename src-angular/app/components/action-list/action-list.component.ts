import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../../services/user/user.service'
import { ActionDataService, ActionData } from '../../services/action-data/action-data.service'
import { ModelDataService } from '../../services/model-data/model-data.service';
import { ActionType } from '../../services/db-connector/db-connector.interface';

  
@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {

  /**
   * Controls the type of rule that is being displayed
   */
  public actionType: ActionType = ActionType.Melee;

  /**
   * Used to format the rows that will be displayed in the table
   */
  public actionTableDisplay: any[] = [];

  /**
   * The index of the selected rule in actionData
   */
  public selectedAction: ActionData;

  /**
   * The action that is being hovered over
   */
  public hoverActionId: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionDataService: ActionDataService,
    private modelDataService: ModelDataService,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl("/login");
      return;
    }

    // setup a callback that is triggered whenever the :type parameter of the URL changes
    this.activatedRoute.paramMap.subscribe( (paramMap:ParamMap) => { this.urlChanged( paramMap.get("type") ) })
  }

  private async urlChanged( actionType: string ) {

    // set the action type based on the URL
    switch ( actionType.toUpperCase() ) {
      case ActionType.Melee:
        this.actionType = ActionType.Melee;
        break;
      case ActionType.Ranged:
        this.actionType = ActionType.Ranged;
        break;
      case ActionType.Special:
        this.actionType = ActionType.Special;
        break;
    }
    await this.loadActionList();
  }

  async newAction() {
    let newActionType = this.actionType;
    let newAction: ActionData = await this.actionDataService.createNewAction( newActionType );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedAction = this.actionTableDisplay.find( element => element.action._id == newAction._id );
  }

  async deleteAction( deleteAction: ActionData ) {

    // make sure that this action is not in use by any models
    let modelList = await this.modelDataService.getAllModels();
    for ( let model of modelList ) {
      for ( let action of model.actions ) {
        if ( action._id == deleteAction._id ) {
          window.alert("This action is in use by a model and cannot be deleted")
          return;
        }
      }
    }

    await this.actionDataService.deleteAction( deleteAction );
    await this.loadActionList();
  }

  async cloneAction( cloneAction: ActionData ) {
    let newAction: ActionData = await this.actionDataService.cloneAction( cloneAction );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedAction = this.actionTableDisplay.find( element => element.action._id == newAction._id );
  }

  private async loadActionList() {

    // get the list of actions
    let actionList: ActionData[] = [];


    switch ( this.actionType ) {
      case "MELEE":
        actionList = await this.actionDataService.getMeleeActions();
        break;
      case "RANGED":
        actionList = await this.actionDataService.getRangedActions();
        break;
      case "SPECIAL":
        actionList = await this.actionDataService.getSpecialActions();
        break;
    }

    // clear the display
    this.actionTableDisplay = [];

    // loop through the actions and prepare the table display
    let actionTableIndex = 0;
    let shadeRow = false;
    for ( let action of actionList ) {

      let rowData = { shadeRow: shadeRow, action: action }
      this.actionTableDisplay[actionTableIndex] = rowData;
      actionTableIndex++;

      // add a row for each special rule
      for ( let rule of action.specialRules ) {

        let rowData = { shadeRow: shadeRow, ruleName: rule.ruleName, ruleText: rule.ruleText, action: action };
        this.actionTableDisplay[actionTableIndex] = rowData;
        actionTableIndex++;

      }

      shadeRow = !shadeRow;
    }

    // select the first item in the list
    if ( this.actionTableDisplay.length > 0 ) {
      this.selectedAction = this.actionTableDisplay[0].action;
    }
  }

  selectRow( tableIndex: number ) {
    if ( this.actionTableDisplay[tableIndex].ruleName ) {
      this.selectedAction = this.actionTableDisplay[tableIndex].ruleAction;
    } else {
      this.selectedAction = this.actionTableDisplay[tableIndex];
    }
  }

  hoverRow(tableIndex: number) {
    if ( this.actionTableDisplay[tableIndex].ruleName ) {
      this.hoverActionId = this.actionTableDisplay[tableIndex].ruleAction;
    } else {
      this.hoverActionId = this.actionTableDisplay[tableIndex];
    }

  }

}
