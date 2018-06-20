import { Component, OnInit } from '@angular/core';
import { SpecialRuleDataService, SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-special-rule-list',
  templateUrl: './special-rule-list.component.html',
  styleUrls: ['./special-rule-list.component.css']
})
export class SpecialRuleListComponent implements OnInit {

  /**
   * Controls the type of rule that is being displayed
   */
  public ruleType: string = "model";

  /**
   * The list of special rules being displayed
   */
  public ruleData: SpecialRuleData[] = [];

  /**
   * The index of the selected rule in ruleData
   */
  public selectedRuleIndex: number = 0;

  constructor(
    private router: Router,
    private specialRuleDataService: SpecialRuleDataService,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl("/login");
      return;
    }

    await this.loadRuleList();
  }

  async selectType( newType: string ) {
    this.ruleType = newType;
    await this.loadRuleList();
  }

  async loadRuleList() {
    switch ( this.ruleType ) {
      case "model":
        this.ruleData = await this.specialRuleDataService.getModelSpecialRules();
        break;
      case "attack":
        this.ruleData = await this.specialRuleDataService.getAttackSpecialRules();
        break;
      case "special":
        this.ruleData = await this.specialRuleDataService.getActionSpecialRules();
        break;
    }
  }

  public selectRule( ruleIndex: number ) {
    this.selectedRuleIndex = ruleIndex;
  }

  async newRuleClick() {
    let newRule: SpecialRuleData = await this.specialRuleDataService.createNewRule( this.ruleType );
    await this.loadRuleList();

    // select the new rule from the list
    this.selectedRuleIndex = this.ruleData.findIndex( element => element._id == newRule._id );
  }

  async updateRuleData( ruleIndex: number ) {
    let updatedRule = await this.specialRuleDataService.updateRule( this.ruleData[ruleIndex]);
    await this.loadRuleList();

    // select the updated rule from the list
    this.selectedRuleIndex = this.ruleData.findIndex( element => element._id == updatedRule._id );
  }

  async deleteRule( ruleIndex: number ) {
    await this.specialRuleDataService.deleteRule( this.ruleData[ruleIndex] );
    await this.loadRuleList();
  }


}
