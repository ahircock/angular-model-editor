import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpecialRuleData, SpecialRuleDataService } from '../../services/special-rule-data/special-rule-data.service';

@Component({
  selector: 'app-special-rule-selector',
  templateUrl: './special-rule-selector.component.html',
  styleUrls: ['./special-rule-selector.component.css']
})
export class SpecialRuleSelectorComponent implements OnInit {

  @Input() ruleType: string;
  @Input() title: string = "Select new special rule";
  @Output() ruleSelected = new EventEmitter<SpecialRuleData>();

  public specialRules: SpecialRuleData[] = [];
  public specialRuleInput: string = "";

  public dropdownVisible: boolean = false;

  constructor(
    private specialRuleDataService: SpecialRuleDataService
  ) { }

  async ngOnInit() {
    
    let newval = 1;

    // load the correct type of rule
    switch ( this.ruleType ) {
      case "model": this.specialRules  = await this.specialRuleDataService.getModelSpecialRules(); break;
      case "action": this.specialRules  = await this.specialRuleDataService.getActionSpecialRules(); break;
      case "attack": this.specialRules  = await this.specialRuleDataService.getAttackSpecialRules(); break;
      default: this.specialRules  = await this.specialRuleDataService.getModelSpecialRules();
    }
    
  }

  selectSpecialRule( ruleName: string ) : void {
    let selectedSpecialRule: SpecialRuleData = this.specialRules.find( (element) => { return element.ruleName == ruleName; } );
    this.ruleSelected.emit( selectedSpecialRule );
    this.specialRuleInput = "";
    this.dropdownVisible = false;
  }

  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    setTimeout( () => { this.dropdownVisible = false;}, 200 );
  }
}
