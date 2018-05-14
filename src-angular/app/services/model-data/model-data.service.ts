import { Injectable } from '@angular/core';

import { SpecialRuleData } from '../special-rule-data/special-rule-data.service';

export interface ModelData {
  _id: string;
  name: string;
  traits?: string;
  picture: string;
  cost: number;
  SPD: number;
  EV: number;
  ARM: number;
  HP: number;
  specialRules: SpecialRuleData[];
  actions: ModelActionData[];
}

export interface ModelActionData {
  type: string;
  name: string;
  traits?: string;
  AP: number;
  RNG?: number;
  HIT?: number;
  DMG?: number;
  ONCE?: boolean;
  specialRules: SpecialRuleData[];
}

export interface StatCost {
  stat: number;
  cost: number;
}



@Injectable()
export class ModelDataService {

  // this array will simulate the data that comes back from a database
  private modelDB: ModelData[] = [
    {"_id":"M0001","name":"Templar General","traits":"Templar","picture":"templar - general.jpg","cost":15,"SPD":5,"EV":5,"ARM":4,"HP":8,"specialRules":[],"actions":[{"type":"MELEE","name":"Warhammer","traits":null,"AP":1,"RNG":0,"HIT":7,"DMG":5,"ONCE":false,"specialRules":[]}]},
    {"_id":"M0002","name":"Templar Knight","traits":"Templar","picture":"templar - knight.jpg","cost":16,"SPD":5,"EV":5,"ARM":3,"HP":8,"specialRules":[],"actions":[{"type":"MELEE","name":"Warhammer","traits":null,"AP":1,"RNG":1,"HIT":7,"DMG":7,"ONCE":false,"specialRules":[]},{"type":"SPECIAL","name":"Shield Wall","traits":"","AP":1,"specialRules":[{"_id": "S0001", "ruleType": "special", "ruleCost": 2, "ruleAP": 1, "ruleName": "Armor Stance", "ruleText": "This model gains the following condition for one round: <i>Armor Stance<\/i> - This model gets +2 ARM\n"}]}]},
    {"_id":"M0003","name":"Templar Paladin","traits":"Templar","picture":"templar - paladin.jpg","cost":21,"SPD":5,"EV":5,"ARM":3,"HP":8,"specialRules":[],"actions":[{"type":"MELEE","name":"StarMaul","traits":null,"AP":1,"RNG":2,"HIT":8,"DMG":9,"ONCE":false,"specialRules":[{"_id": "S0002", "ruleType": "attack", "ruleCost": 2, "ruleName": "Stun", "ruleText": "Target model gets the following condition for one round (<i>Stunned<\/i>: This model gets -1 action point during its activation)"}]}]},
    {"_id":"M0004","name":"Templar Soulwarden2","traits":"Templar, Hero","picture":"templar - soulwarden.jpg","cost":25,"SPD":5,"EV":5,"ARM":3,"HP":10,"specialRules":[{     "_id": "S0004",     "ruleType": "model",     "ruleCost": 3,     "ruleName": "Soul Collector",     "ruleText": "This model can gain <i>soul tokens<\/i>. When this model destroys a living enemy model with an attack, this model gains a soul token. This model can have up to three soul tokens at any time.<br><li> This model can spend a soul token to perform any <i>soul-powered<\/i> action with AP 1 for free.<br><li> This model can spend a soul token to focus or boost any <i>soul-powered<\/i> attack for free." }],"actions":[{"type":"MELEE","name":"Relic Hammer","traits":"","AP":1,"RNG":1,"HIT":7,"DMG":7,"ONCE":false,"specialRules":[]},{"type":"RANGED","name":"Soul Fire","traits":"soul-powered","AP":1,"RNG":12,"HIT":6,"DMG":6,"ONCE":false,"specialRules":[{"_id": "S0003", "ruleType": "attack","ruleCost": 2, "ruleName": "Weaken", "ruleText": "Target model gets the following condition for one round (<i>Weakened<\/i>: This model gets -2 DMG on all attacks)" }]},{"type":"SPECIAL","name":"Reinforce Soul","traits":"soul-powered","AP":1,"ONCE":false,"specialRules":[{"_id": "S0012","ruleType": "special","ruleCost": 3,"ruleAP": 1,"ruleName": "Healing Touch","ruleText": "Target friendly model within 0\" receives a 6/0 heal test."}]}]},
    {"_id":"M0005","name":"Chaos Marauder","traits":"Chaos","picture":"chaos - marauder.jpg","cost":6,"SPD":6,"EV":5,"ARM":0,"HP":5,"specialRules":[],"actions":[{"type":"MELEE","name":"Reaver Blade","traits":"","AP":1,"RNG":1,"HIT":6,"DMG":6,"ONCE":false,"specialRules":[]}]},
    {"_id":"M0007","name":"Chaos Warrior","traits":"Chaos","picture":"chaos - warrior.jpg","cost":16,"SPD":5,"EV":5,"ARM":3,"HP":8,"specialRules":[],"actions":[{"type":"MELEE","name":"GoreAxe","traits":"","AP":1,"RNG":1,"HIT":7,"DMG":7,"ONCE":false,"specialRules":[]},{"type":"SPECIAL","name":"Frenzy","traits":"","AP":2,"ONCE":false,"specialRules":[{ "_id": "S0018", "ruleType": "special", "ruleCost": 2, "ruleName": "Rapid Strike", "ruleText": "This model may make up to 3 melee attacks with AP 1 against a single target", "ruleAP": 2}]}]},
    {"_id":"M0008","name":"Chaos Champion 2","traits":"Chaos","picture":"chaos - general.jpg","cost":25,"SPD":5,"EV":5,"ARM":3,"HP":10,"specialRules":[{ "_id": "S0028", "ruleType": "model", "ruleCost": 4, "ruleName": "Melee Expert", "ruleText": "This model gains 1 additional AP which may only be used to make melee attacks"},{ "_id": "S0014", "ruleType": "model", "ruleCost": 2, "ruleName": "Berserk", "ruleText": "If this model destroys an enemy model with an attack, it must make a second melee attack with an AP cost of 1 against another model, friendly or enemy, within melee range. This additional attack costs no AP."}],"actions":[{"type":"MELEE","name":"Demon Axe","traits":"","AP":1,"RNG":1,"HIT":9,"DMG":7,"ONCE":false,"specialRules":[{ "_id": "S0016", "ruleType": "attack", "ruleCost": 2, "ruleName": "Armor Piercing", "ruleText": "Target model gets -2 ARM against this attack"}]}]},
    {"_id":"M0009","name":"Templar (Basic)","traits":"Templar","picture":"basic.jpg","cost":14,"SPD":5,"EV":5,"ARM":3,"HP":8,"specialRules":[],"actions":[{"type":"MELEE","name":"Templar Weapon","traits":null,"AP":1,"RNG":1,"HIT":7,"DMG":7,"ONCE":false,"specialRules":[]}]},
    {"_id":"M0010","name":"Aidan-Akar General","traits":"Chaos","picture":"chaos - general.jpg","cost":24,"SPD":5,"EV":5,"ARM":3,"HP":10,"specialRules":[{ "_id": "S0028", "ruleType": "model", "ruleCost": 4, "ruleName": "Melee Expert", "ruleText": "This model gains 1 additional AP which may only be used to make melee attacks"}],"actions":[{"type":"MELEE","name":"Demon Axe","traits":"","AP":1,"RNG":1,"HIT":9,"DMG":8,"ONCE":false,"specialRules":[{ "_id": "S0016", "ruleType": "attack", "ruleCost": 2, "ruleName": "Armor Piercing", "ruleText": "Target model gets -2 ARM against this attack"}]}]},
    {"_id":"M0011","name":"Templar Soulwarden1","traits":"Templar, Hero","picture":"templar - soulwarden.jpg","cost":22,"SPD":5,"EV":5,"ARM":3,"HP":10,"specialRules":[],"actions":[{"type":"MELEE","name":"Relic Hammer","traits":"","AP":1,"RNG":1,"HIT":7,"DMG":7,"ONCE":false,"specialRules":[]},{"type":"RANGED","name":"Soul Fire","traits":"soul-powered","AP":1,"RNG":12,"HIT":6,"DMG":6,"ONCE":false,"specialRules":[]},{"type":"SPECIAL","name":"Reinforce Soul","traits":"soul-powered","AP":1,"ONCE":false,"specialRules":[{"_id": "S0012","ruleType": "special","ruleCost": 3,"ruleAP": 1,"ruleName": "Healing Touch","ruleText": "Target friendly model within 0\" receives a 6/0 heal test."}]}]}
  ];
  private nextModelIdDB: number = 12;


  // These constant arrays are used to calculate the total cost of a model, and can be displayed in dropdowns
  public BASE_COST = 10;
  public SPD_COST: StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:6} ];
  public EV_COST:  StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:5} ];
  public ARM_COST: StatCost[] = [ {stat:0, cost:0 }, {stat:1, cost:1 }, {stat:2,  cost:2}, {stat:3, cost:4}, {stat:4, cost:6} ];
  public HP_COST:  StatCost[] = [ {stat:5, cost:0 }, {stat:8, cost:3 }, {stat:10, cost:5} ];
  public HIT_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public DMG_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public MELEE_RNG_COST:  StatCost[] = [ {stat:0, cost:-1 }, {stat:1, cost:0 }, {stat:2, cost:2} ];
  public RANGED_RNG_COST: StatCost[] = [ {stat:8, cost:2 }, {stat:12, cost:3 }, {stat:24, cost:5}, {stat:60, cost:7} ];

  // default values for new models & actions
  public NEW_MODEL: ModelData = {_id:"NEW",name:"New Model",traits:null,picture:"basic.jpg",cost:0,SPD:5,EV:5,ARM:0,HP:5,specialRules:[],actions:[]};
  public NEW_MELEE_ACTION: ModelActionData = { type: "MELEE", name: "NEW MELEE", AP:1, RNG:1, HIT:6, DMG:6, specialRules:[] };
  public NEW_RANGED_ACTION: ModelActionData = { type: "RANGED", name: "NEW RANGED", AP:1, RNG:12, HIT:6, DMG:6, specialRules:[] };

  constructor() { }

  async getAllModels(): Promise<ModelData[]> {
    // make a deep copy of the model list and then return it
    let returnList: ModelData[] = [];
    for ( let modelDB of this.modelDB ) {
      let modelData: ModelData = JSON.parse(JSON.stringify( modelDB ));
      returnList.push( modelData );
    }
    return returnList;
  }

  async getModelById(id: string): Promise<ModelData> {
    // find the model in the arrach (using the "find" function), and then return a deep copy of that model
    let findModel: ModelData = this.modelDB.find( element => { return element._id == id;} );
    let returnModel: ModelData = JSON.parse(JSON.stringify( findModel ));
    return returnModel;
  }

  async getModelListById ( idList: string[] ): Promise<ModelData[]> {
    
    // get the list of models, and return a deep copy
    let returnList: ModelData[] = [];
    for ( let id of idList ) {
      let returnModel: ModelData = JSON.parse(JSON.stringify( await this.getModelById(id) ));
      returnList.push( returnModel );
    }
    return returnList;
  }

  async addNewModel(): Promise<ModelData> {
    
    // create a new model with a single melee action
    let newModel: ModelData = JSON.parse(JSON.stringify( this.NEW_MODEL ));
    newModel.actions.push( JSON.parse(JSON.stringify( this.NEW_MELEE_ACTION )));
    this.updateCost(newModel);

    // generate a new ID for the new force
    newModel._id = "M" + this.nextModelIdDB.toString().padStart(4,"0");
    this.nextModelIdDB++;

    // add this new model to the fake database
    this.modelDB.push(newModel);

    // return a deep copy
    return JSON.parse(JSON.stringify( newModel ));
  }

  async updateModel( updateModel: ModelData ): Promise<ModelData> {

    // make sure that the cost of the updated model is correct
    this.updateCost(updateModel);

    // find the model in the fake DB, and then update it
    let findModelIndex: number = this.modelDB.findIndex( element => { return element._id == updateModel._id;} );
    this.modelDB[findModelIndex] = updateModel;

    // return a deep copy of the model from the DB
    let returnModel: ModelData = JSON.parse(JSON.stringify( this.modelDB[findModelIndex] ));
    return returnModel;
  }

  private updateCost( model: ModelData ): void {
    model.cost = this.BASE_COST;

    // add the cost of model stats
    model.cost += this.SPD_COST.find( (element) => { return element.stat == model.SPD; } ).cost;
    model.cost += this.EV_COST.find( (element) => { return element.stat == model.EV; } ).cost;
    model.cost += this.ARM_COST.find( (element) => { return element.stat == model.ARM; } ).cost;
    model.cost += this.HP_COST.find( (element) => { return element.stat == model.HP; } ).cost;

    // add the special rule costs
    for ( let specialRule of model.specialRules ) {
      model.cost += specialRule.ruleCost;
    }
    
    // add the action costs, based on the type of action
    for ( let action of model.actions ) {

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
        model.cost += actionCost;
      }
    }
  }
}
