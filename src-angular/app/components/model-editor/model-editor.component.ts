import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelData, ModelDataService, ModelActionData } from '../../services/model-data/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';

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

  public model: ModelData;
  
  // These constant arrays are used to calculate the total cost of a model
  public BASE_COST = 10;
  public SPD_COST: StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:6} ];
  public EV_COST:  StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:5} ];
  public ARM_COST: StatCost[] = [ {stat:0, cost:0 }, {stat:1, cost:1 }, {stat:2,  cost:2}, {stat:3, cost:4}, {stat:4, cost:6} ];
  public HP_COST:  StatCost[] = [ {stat:5, cost:0 }, {stat:8, cost:3 }, {stat:10, cost:5} ];
  public HIT_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public DMG_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public MELEE_RNG_COST:  StatCost[] = [ {stat:0, cost:-1 }, {stat:1, cost:0 }, {stat:2, cost:2} ];
  public RANGED_RNG_COST: StatCost[] = [ {stat:8, cost:2 }, {stat:12, cost:3 }, {stat:24, cost:5}, {stat:60, cost:7} ];

  public NEW_MELEE_ACTION: ModelActionData = { type: "MELEE", name: "NEW", AP:1, RNG:1, HIT:6, DMG:6, specialRules:[] };
  public NEW_RANGED_ACTION: ModelActionData = { type: "RANGED", name: "NEW", AP:1, RNG:12, HIT:6, DMG:6, specialRules:[] };

  constructor( 
    private location: Location,
    private route: ActivatedRoute,
    private modelDataService: ModelDataService
   ) { }

  async ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.model = await this.modelDataService.getModel(id);

    // calculate the cost of the model
    this.calculateCost();
  }

  ok(): void {
    this.location.back();
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
    this.calculateCost();
  }

  selectModelStat( value: any, statName: string ): void {
    
    let newStat = Number(value);
    
    switch ( statName ) {
      case "SPD": this.model.SPD = newStat; break;
      case "EV": this.model.EV = newStat; break;
      case "ARM": this.model.ARM = newStat; break;
      case "HP": this.model.HP = newStat; break;
    }

    this.calculateCost();
  }

  addSpecialRule( ruleName: string ) : void {
    let newRule: SpecialRuleData = { "_id":"S0000", ruleType:"", ruleName:ruleName, ruleText:"This is a new rule", ruleCost:2 };
    this.model.specialRules.push(newRule);
    this.calculateCost();
  }

  deleteSpecialRule( ruleIndex: number ): void {
    this.model.specialRules.splice( ruleIndex, 1 );
    this.calculateCost();
  }

  deleteAction( actionIndex: number ) {
    this.model.actions.splice( actionIndex, 1 );
    this.calculateCost();
  }

  addMeleeAction() : void {
    let newAction = JSON.parse( JSON.stringify(this.NEW_MELEE_ACTION));
    this.addAction( newAction );
  }

  addRangedAction(): void {
    let newAction = JSON.parse( JSON.stringify(this.NEW_RANGED_ACTION));
    this.addAction( newAction );
  }

  addSpecialAction( newRule: string ): void {
    let newSpecialRule: SpecialRuleData = { "_id":"S0000", ruleType:"", ruleName:newRule, ruleText:"This is a new action", ruleCost:2 };
    let newAction: ModelActionData = { type:"SPECIAL", name:newRule, AP:1, specialRules:[ newSpecialRule ] };
    this.addAction( newAction );
  }

  private addAction( newAction: ModelActionData ) {
    this.model.actions.push(newAction);
    this.calculateCost();
  }

  addAttackSpecialRule( actionIndex: number, ruleName: string ): void {
    let newRule: SpecialRuleData = { "_id":"S0000", ruleType:"", ruleName:ruleName, ruleText:"This is a new rule", ruleCost:2 };
    this.model.actions[actionIndex].specialRules.push(newRule);
    this.calculateCost();
  }

  deleteAttackSpecialRule( actionIndex: number, ruleIndex: number ): void {
    this.model.actions[actionIndex].specialRules.splice( ruleIndex, 1 );
    this.calculateCost();
  }

  calculateCost(): void {
    this.model.cost = this.BASE_COST;

    // add the cost of model stats
    this.model.cost += this.SPD_COST.find( (element) => { return element.stat == this.model.SPD; } ).cost;
    this.model.cost += this.EV_COST.find( (element) => { return element.stat == this.model.EV; } ).cost;
    this.model.cost += this.ARM_COST.find( (element) => { return element.stat == this.model.ARM; } ).cost;
    this.model.cost += this.HP_COST.find( (element) => { return element.stat == this.model.HP; } ).cost;

    // add the special rule costs
    for ( let specialRule of this.model.specialRules ) {
      this.model.cost += specialRule.ruleCost;
    }
    
    // add the action costs, based on the type of action
    for ( let action of this.model.actions ) {

      let actionCost = 0;

      switch ( action.type ) {

        case "MELEE":
          actionCost += this.MELEE_RNG_COST.find( (element) => { return element.stat == action.RNG; } ).cost;
          actionCost += this.HIT_COST.find( (element) => { return element.stat == action.HIT; } ).cost;
          actionCost += this.DMG_COST.find( (element) => { return element.stat == action.DMG; } ).cost;
          
          // add in the cost of all special rules
          for ( let specialRule of action.specialRules ) {
            actionCost += specialRule.ruleCost;
          }

          break;

        case "RANGED":
          actionCost += this.RANGED_RNG_COST.find( (element) => { return element.stat == action.RNG; } ).cost;
          actionCost += this.HIT_COST.find( (element) => { return element.stat == action.HIT; } ).cost;
          actionCost += this.DMG_COST.find( (element) => { return element.stat == action.DMG; } ).cost;

          // add in the cost of all special rules
          for ( let specialRule of action.specialRules ) {
            actionCost += specialRule.ruleCost;
          }

          break;

        case "SPECIAL":
          actionCost += action.specialRules[0].ruleCost;
      }

      // actions cannot have a negative cost
      if ( actionCost > 0 ) {
        this.model.cost += actionCost;
      }
    }
  }
}
