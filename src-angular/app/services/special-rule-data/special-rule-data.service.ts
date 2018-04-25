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
    {"_id":"S0001","ruleType":"special","ruleCost":2,"ruleAP":1,"ruleName":"Armor Stance","ruleText":"This model gains the following condition for one round: \u003ci\u003eArmor Stance\u003c/i\u003e - This model gets +2 ARM\n"},
    {"_id":"S0002","ruleType":"attack","ruleCost":2,"ruleName":"Stun","ruleText":"Target model gets the following condition for one round (\u003ci\u003eStunned\u003c/i\u003e: This model gets -1 action point during its activation)"},
    {"_id":"S0003","ruleType":"attack","ruleCost":2,"ruleName":"Weaken","ruleText":"Target model gets the following condition for one round (\u003ci\u003eWeakened\u003c/i\u003e: This model gets -2 DMG on all attacks)"},
    {"_id":"S0004","ruleType":"model","ruleCost":3,"ruleName":"Soul Collector","ruleText":"This model can gain \u003ci\u003esoul tokens\u003c/i\u003e. When this model destroys a living enemy model with an attack, this model gains a soul token. This model can have up to three soul tokens at any time.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to perform any \u003ci\u003esoul-powered\u003c/i\u003e action with AP 1 for free.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to focus or boost any \u003ci\u003esoul-powered\u003c/i\u003e attack for free."},
    {"_id":"S0005","ruleType":"attack","ruleCost":3,"ruleName":"Lucky Hit","ruleText":"This attack may reroll failed HIT tests."},
    {"_id":"S0012","ruleType":"special","ruleCost":3,"ruleAP":1,"ruleName":"Healing Touch","ruleText":"Target friendly model within 0\" receives a 6/0 heal test."},
    {"_id":"S0013","ruleType":"model","ruleCost":1,"ruleName":"Reckless Rage","ruleText":"While damaged this model gets the following condition: (\u003ci\u003eReckless Rage\u003c/i\u003e: -2 EV and +2 DMG to melee attacks)"},
    {"_id":"S0014","ruleType":"model","ruleCost":2,"ruleName":"Berserk","ruleText":"If this model destroys an enemy model with an attack, it must make a second melee attack with an AP cost of 1 against another model, friendly or enemy, within melee range. This additional attack costs no AP."},
    {"_id":"S0015","ruleType":"model","ruleCost":4,"ruleName":"Fly","ruleText":"This model can move through other models and impassable terrain, and does not suffer the slowing effects of difficult terrain. Only models that were engaging this model at the beginning of its movement may perform disengage attacks"},
    {"_id":"S0016","ruleType":"attack","ruleCost":2,"ruleName":"Armor Piercing","ruleText":"Target model gets -2 ARM against this attack"},
    {"_id":"S0017","ruleType":"attack","ruleCost":4,"ruleName":"Incorporeal","ruleText":"Target model’s ARM is 0 against this attack"},
    {"_id":"S0018","ruleType":"special","ruleCost":2,"ruleName":"Rapid Strike","ruleText":"This model may make up to 3 melee attacks with AP 1 against a single target","ruleAP":2},
    {"_id":"S0019","ruleType":"special","ruleCost":2,"ruleName":"Rapid Fire","ruleText":"This model may make up to 3 ranged attacks with AP 1 against a single target","ruleAP":2},
    {"_id":"S0020","ruleType":"move","ruleCost":3,"ruleAP":1,"ruleName":"Leap","ruleText":"This model moves up to its SPD stat, moving through intervening models and terrain without penalty. Only models that were engaging this model at the beginning of its movement may perform disengage attacks"},
    {"_id":"S0021","ruleType":"command","ruleCost":2,"ruleName":"Guard Him!","ruleText":"Target friendly model within 12” gets the guarded condition (Guarded: If this model is damaged by an attack action, you may assign some all of the damage it suffers to another model within base to base contact, then this condition ends)","ruleAP":1},
    {"_id":"S0022","ruleType":"command","ruleCost":2,"ruleName":"You Must Protect!","ruleText":"Target friendly model within 12” gets the bodyguard condition (Bodyguard: If a model in contact with this model is damaged by an attack action, you may assign some or all of the damage it suffers to this model, then this condition ends)","ruleAP":1},
    {"_id":"S0023","ruleType":"command","ruleCost":2,"ruleName":"Maneuver Drill!","ruleText":"This model receives the maneuvers aura condition for one round (maneuvers aura: All friendly models within 12” of this model may move through other friendly models)","ruleAP":1},
    {"_id":"S0024","ruleType":"command","ruleCost":2,"ruleName":"Defensive Positions!","ruleText":"This model receives the following condition for one round (\u003ci\u003eDefense Aura\u003c/i\u003e: If a friendly model within 12” of this model is in contact with another friendly model, it cannot be flanked)","ruleAP":1},
    {"_id":"S0025","ruleType":"command","ruleCost":2,"ruleName":"Reform!","ruleText":"All friendly models within 6” may immediately perform a Reposition action in whatever order you choose","ruleAP":1},
    {"_id":"S0026","ruleType":"command","ruleCost":2,"ruleName":"Strike!","ruleText":"Target friendly model within 12” may immediately perform an attack action","ruleAP":1},
    {"_id":"S0027","ruleType":"attack","ruleCost":3,"ruleName":"Lucky Damage","ruleText":"This attack may reroll failed DMG tests."},
    {"_id":"S0028","ruleType":"model","ruleCost":4,"ruleName":"Melee Expert","ruleText":"This model gains 1 additional AP which may only be used to make melee attacks"}
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
