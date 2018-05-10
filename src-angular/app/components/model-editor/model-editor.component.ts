import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelData, ModelDataService, ModelActionData } from '../../services/model-data/model-data.service';
import { SpecialRuleData, SpecialRuleDataService } from '../../services/special-rule-data/special-rule-data.service';

interface StatCost {
  stat: number;
  cost: number;
}

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() model: ModelData;
  @Output() change: EventEmitter<void> = new EventEmitter();

  constructor( 
    private location: Location,
    private route: ActivatedRoute,
    private modelDataService: ModelDataService,
    private specialRuleDataService: SpecialRuleDataService
   ) { }

  async ngOnInit() {
  }

  selectModelStat( value: any, statName: string ): void {
    
    let newStat = Number(value);
    
    switch ( statName ) {
      case "SPD": this.model.SPD = newStat; break;
      case "EV": this.model.EV = newStat; break;
      case "ARM": this.model.ARM = newStat; break;
      case "HP": this.model.HP = newStat; break;
    }

    // save the changed model to the database
    this.saveModelData();
  }

  addModelSpecialRule( newSpecialRule: SpecialRuleData ) : void {
    this.model.specialRules.push( newSpecialRule);
    this.saveModelData();
  }

  deleteModelSpecialRule( ruleIndex: number ): void {
    this.model.specialRules.splice( ruleIndex, 1 );
    this.saveModelData();
  }

  selectActionStat( index: number, value: any, type: string ): void {
    
    let newStat = Number(value);

    switch ( type ) {
      case "RNG-MELEE": this.model.actions[index].RNG = newStat; break;
      case "RNG-RANGED":this.model.actions[index].RNG = newStat; break;
      case "HIT": this.model.actions[index].HIT = newStat; break;
      case "DMG": this.model.actions[index].DMG = newStat; break;
    }

    // update the cost of the model
    this.saveModelData();
  }

deleteAction( actionIndex: number ) {
    this.model.actions.splice( actionIndex, 1 );
    this.saveModelData();
  }

  addMeleeAction() : void {
    let newAction = JSON.parse( JSON.stringify(this.modelDataService.NEW_MELEE_ACTION));
    this.model.actions.push(newAction);
    this.saveModelData();
  }

  addRangedAction(): void {
    let newAction = JSON.parse( JSON.stringify(this.modelDataService.NEW_RANGED_ACTION));
    this.model.actions.push(newAction);
    this.saveModelData();
  }

  addSpecialAction( newSpecialRule: SpecialRuleData ): void {
    let newAction: ModelActionData = { type:"SPECIAL", name:newSpecialRule.ruleName, AP:1, specialRules:[ newSpecialRule ] };
    this.model.actions.push(newAction);
    this.saveModelData();
  }

  addAttackSpecialRule( actionIndex: number, newRule: SpecialRuleData ): void {
    this.model.actions[actionIndex].specialRules.push(newRule);
    this.saveModelData();    
  }

  deleteAttackSpecialRule( actionIndex: number, ruleIndex: number ): void {
    this.model.actions[actionIndex].specialRules.splice( ruleIndex, 1 );
    this.saveModelData();
  }

  async saveModelData() {
    let updatedModel = await this.modelDataService.updateModel( this.model );
    this.model = updatedModel;
    this.change.emit();
  }
}