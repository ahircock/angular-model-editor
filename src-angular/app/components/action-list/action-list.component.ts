import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../../services/user/user.service'
import { ActionDataService, ActionData } from '../../services/action-data/action-data.service'

  
@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {

  /**
   * Controls the type of rule that is being displayed
   */
  public actionType: string = "ALL";

  /**
   * The list of special rules being displayed
   */
  public actionData: ActionData[] = [];

  public actionTableDisplay: any[] = [];

  /**
   * The index of the selected rule in actionData
   */
  public selectedDataIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionDataService: ActionDataService,
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
    this.actionType = actionType.toUpperCase();
    await this.loadActionList();
  }

  async newAction() {
    let newActionType = this.actionType == "ALL" ? "MELEE" : this.actionType;
    let newAction: ActionData = await this.actionDataService.createNewAction( newActionType );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedDataIndex = this.actionData.findIndex( element => element._id == newAction._id );
  }

  async deleteAction( deleteAction: ActionData ) {
    await this.actionDataService.deleteAction( deleteAction );
    await this.loadActionList();
  }

  async cloneAction( cloneAction: ActionData ) {
    let newAction: ActionData = await this.actionDataService.cloneAction( cloneAction );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedDataIndex = this.actionData.findIndex( element => element._id == newAction._id );
  }

  private async loadActionList() {
    switch ( this.actionType ) {
      case "MELEE":
        this.actionData = await this.actionDataService.getMeleeActions();
        break;
      case "RANGED":
        this.actionData = await this.actionDataService.getRangedActions();
        break;
      case "SPECIAL":
        this.actionData = await this.actionDataService.getSpecialActions();
        break;
      case "ALL":
        let meleeActions = await this.actionDataService.getMeleeActions();
        let rangedActions = await this.actionDataService.getRangedActions();
        let specialActions = await this.actionDataService.getSpecialActions();

        this.actionData = [].concat( meleeActions, rangedActions, specialActions );
    }

  }

}
