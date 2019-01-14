import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActionDataService, ActionData, ActionType } from '../../services/action-data.service';
import { ModelDataService } from '../../services/model-data.service';

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

  public actionList: ActionData[] = [];

  public selectedAction: ActionData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionDataService: ActionDataService,
    private modelDataService: ModelDataService,
    private userService: UserService
  ) {}

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    // setup a callback that is triggered when the URL is initialized
    this.activatedRoute.url.subscribe( (urlSegments: UrlSegment[]) => { this.initUrl( urlSegments[0].path ); });
  }

  private async initUrl( url: string ) {
    switch ( url ) {
      case 'melee-actions':
        this.actionType = ActionType.Melee;
        break;
      case 'ranged-actions':
        this.actionType = ActionType.Ranged;
        break;
      case 'special-actions':
        this.actionType = ActionType.Special;
        break;
    }

    // load the action list
    await this.loadActionList();

    // select the first action in the list
    if ( this.actionList.length > 0 ) {
      this.selectedAction = this.actionList[0];
    }
  }

  private async loadActionList() {

    // set the action type based on the URL
    switch ( this.actionType ) {
      case ActionType.Melee:
        this.actionList = await this.actionDataService.getMeleeActions();
        break;
      case ActionType.Ranged:
        this.actionList = await this.actionDataService.getRangedActions();
        break;
      case ActionType.Special:
        this.actionList = await this.actionDataService.getSpecialActions();
        break;
    }
  }

  async newAction() {
    const newActionType = this.actionType;
    const newAction: ActionData = await this.actionDataService.createNewAction( newActionType );
    await this.loadActionList();

    // select the new action from the list
    this.selectedAction = newAction;
  }

  async deleteAction( deleteAction: ActionData ) {

    // make sure that this action is not in use by any models
    const modelList = await this.modelDataService.getAllModels();
    for ( const model of modelList ) {
      for ( const action of model.actions ) {
        if ( action._id === deleteAction._id ) {
          window.alert('This action is in use by a model and cannot be deleted');
          return;
        }
      }
    }

    await this.actionDataService.deleteAction( deleteAction );
    await this.loadActionList();
  }

  async cloneAction( cloneAction: ActionData ) {
    const newAction: ActionData = await this.actionDataService.cloneAction( cloneAction );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedAction = newAction;
  }

  selectRow( action: ActionData ) {
    this.router.navigateByUrl('/actions/' + action._id );
  }

}
