import { Component, OnInit } from '@angular/core';
import { SpecialRuleDataService, SpecialRuleData, RuleType } from '../../services/special-rule-data.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-special-rule-list',
  templateUrl: './special-rule-list.component.html',
  styleUrls: ['./special-rule-list.component.css']
})
export class SpecialRuleListComponent implements OnInit {

  /**
   * Controls the type of rule that is being displayed
   */
  public ruleType: RuleType = RuleType.Model;

  /**
   * The list of special rules being displayed
   */
  public ruleData: SpecialRuleData[] = [];

  /**
   * The index of the selected rule in ruleData
   */
  public selectedRule: SpecialRuleData;

  constructor(
    private router: Router,
    private specialRuleDataService: SpecialRuleDataService,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    await this.loadRuleList();

    // select the first rule in the list
    if ( this.ruleData.length > 0 ) {
      this.selectedRule = this.ruleData[0];
    }
  }

  async selectType( newType: string ) {
    if ( newType === 'special' ) { this.ruleType = RuleType.Special; }
    if ( newType === 'attack' ) { this.ruleType = RuleType.Attack; }
    if ( newType === 'model' ) { this.ruleType = RuleType.Model; }
    await this.loadRuleList();
  }

  async loadRuleList() {
    switch ( this.ruleType ) {
      case 'model':
        this.ruleData = await this.specialRuleDataService.getModelSpecialRules();
        break;
      case 'attack':
        this.ruleData = await this.specialRuleDataService.getAttackSpecialRules();
        break;
      case 'special':
        this.ruleData = await this.specialRuleDataService.getActionSpecialRules();
        break;
    }
  }

  async newRuleClick() {
    const newRule: SpecialRuleData = await this.specialRuleDataService.createNewRule( this.ruleType );
    await this.loadRuleList();

    // select the new rule from the list
    this.selectedRule = newRule;
  }

  async ruleDetailsUpdated( updatedRule: SpecialRuleData ) {

    // reload the list
    await this.loadRuleList();
  }

  async deleteRule( deleteRule: SpecialRuleData ) {
    await this.specialRuleDataService.deleteRule( deleteRule );
    await this.loadRuleList();

    // select the first rule in the list
    if ( this.ruleData.length > 0 ) {
      this.selectedRule = this.ruleData[0];
    }
  }

  async cloneRule( cloneRule: SpecialRuleData ) {
    const newRule: SpecialRuleData = await this.specialRuleDataService.cloneRule( cloneRule );
    await this.loadRuleList();

    // select the new rule from the list
    this.selectedRule = newRule;
  }


}
