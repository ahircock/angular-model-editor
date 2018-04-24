import { Injectable } from '@angular/core';

export interface SpecialRuleData {
  _id: string;
  ruleType: string;
  ruleName: string;
  ruleText: string;
  ruleCost: number;
  ruleAP?: number;
}

@Injectable()
export class SpecialRuleDataService {

  // this array will simulate the data that comes back from a database
  private specialRuleDB: SpecialRuleData[] = [
    { "_id": "S0001", "ruleType": "special", "ruleCost": 2, "ruleAP": 1, "ruleName": "Armor Stance", "ruleText": "This model gains the following condition for one round: <i>Armor Stance<\/i> - This model gets +2 ARM\n"},
    { "_id": "S0004", "ruleType": "model", "ruleCost": 3, "ruleName": "Soul Collector", "ruleText": "This model can gain <i>soul tokens<\/i>. When this model destroys a living enemy model with an attack, this model gains a soul token. This model can have up to three soul tokens at any time.<br><li> This model can spend a soul token to perform any <i>soul-powered<\/i> action with AP 1 for free.<br><li> This model can spend a soul token to focus or boost any <i>soul-powered<\/i> attack for free."},
    { "_id": "S0012", "ruleType": "special", "ruleCost": 3, "ruleAP": 1, "ruleName": "Healing Touch", "ruleText": "Target friendly model within 0\" receives a 6/0 heal test."},
    { "_id": "S0002", "ruleType": "attack", "ruleCost": 2, "ruleName": "Stun", "ruleText": "Target model gets the following condition for one round (<i>Stunned<\/i>: This model gets -1 action point during its activation)"},
    { "_id": "S0003", "ruleType": "attack", "ruleCost": 2, "ruleName": "Weaken", "ruleText": "Target model gets the following condition for one round (<i>Weakened<\/i>: This model gets -2 DMG on all attacks)"},
    { "_id": "S0005", "ruleType": "attack", "ruleCost": 3, "ruleName": "Lucky Hit", "ruleText": "This attack may reroll failed HIT tests."},
    { "_id": "S0017", "ruleType": "attack", "ruleCost": 4, "ruleName": "Incorporeal", "ruleText": "Target model\u2019s ARM is 0 against this attack"},
    { "_id": "S0027", "ruleType": "attack", "ruleCost": 3, "ruleName": "Lucky Damage", "ruleText": "This attack may reroll failed DMG tests."},
    { "_id": "S0016", "ruleType": "attack", "ruleCost": 2, "ruleName": "Armor Piercing", "ruleText": "Target model gets -2 ARM against this attack"},    
  ];

  constructor() { }

  async getModelSpecialRules() {
    return await this.getSpecialRuleByType("model");
  }

  async getActionSpecialRules() {
    return await this.getSpecialRuleByType("special");
  }

  async getAttackSpecialRules() {
    return await this.getSpecialRuleByType("attack");
  }

  private async getSpecialRuleByType( type:string ) {
    let returnList: SpecialRuleData[] = [];
    for ( let specialRule of this.specialRuleDB ) {
      if ( specialRule.ruleType == type ) {
        returnList.push(specialRule);
      }
    }
    return returnList;
  }
}
