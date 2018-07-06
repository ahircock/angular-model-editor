import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  public actionType: string = "melee";

  /**
   * The list of special rules being displayed
   */
  public actionData: ActionData[] = [];

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

    // get the action type from the URL
    this.actionType = this.activatedRoute.snapshot.paramMap.get("type");

    // load the list of actions
    await this.loadActionList();
  }

  async newActionClick() {
    let newAction: ActionData = await this.actionDataService.createNewAction( this.actionType );
    await this.loadActionList();

    // select the new rule from the list
    this.selectedDataIndex = this.actionData.findIndex( element => element._id == newAction._id );
  }

  private async loadActionList() {
    switch ( this.actionType ) {
      case "melee":
        this.actionData = await this.actionDataService.getMeleeActions();
        break;
      case "ranged":
        this.actionData = await this.actionDataService.getRangedActions();
        break;
      case "special":
        this.actionData = await this.actionDataService.getSpecialActions();
        break;
    }

  }

}
