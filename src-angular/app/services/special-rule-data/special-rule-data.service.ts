import { Injectable } from '@angular/core';

export interface SpecialRuleData {
  _id: string;
  ruleType: string;
  ruleName: string;
  ruleText: string;
  ruleCost: number;
  ruleAP?: number;
}

/**
 * private interface used to define the database structure of rules
 */
interface RuleDBData {
  _id: string;
  type: string;
  name: string;
  text: string;
  cost: number;
  AP?: number;
}

@Injectable()
export class SpecialRuleDataService {

  // this array will simulate the data that comes back from a database
  private specialRuleDB: RuleDBData[] = [
    {_id:"S0001",type:"special",cost:2,AP:1,name:"Armor Stance",text:"This model gains the following condition for one round: \u003ci\u003eArmor Stance\u003c/i\u003e - This model gets +2 ARM\n"},
    {_id:"S0002",type:"attack",cost:2,name:"Stun",text:"Target model gets the following condition for one round (\u003ci\u003eStunned\u003c/i\u003e: This model gets -1 action point during its activation)"},
    {_id:"S0003",type:"attack",cost:2,name:"Weaken",text:"Target model gets the following condition for one round (\u003ci\u003eWeakened\u003c/i\u003e: This model gets -2 DMG on all attacks)"},
    {_id:"S0004",type:"model",cost:3,name:"Soul Collector",text:"This model can gain \u003ci\u003esoul tokens\u003c/i\u003e. When this model destroys a living enemy model with an attack, this model gains a soul token. This model can have up to three soul tokens at any time.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to perform any \u003ci\u003esoul-powered\u003c/i\u003e action with AP 1 for free.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to focus or boost any \u003ci\u003esoul-powered\u003c/i\u003e attack for free."},
    {_id:"S0005",type:"attack",cost:3,name:"Lucky Hit",text:"This attack may reroll failed HIT tests."},
    {_id:"S0012",type:"special",cost:3,AP:1,name:"Healing Touch",text:"Target friendly model within 0\" receives a 6/0 heal test."},
    {_id:"S0013",type:"model",cost:1,name:"Reckless Rage",text:"While damaged this model gets the following condition: (\u003ci\u003eReckless Rage\u003c/i\u003e: -2 EV and +2 DMG to melee attacks)"},
    {_id:"S0014",type:"model",cost:2,name:"Berserk",text:"If this model destroys an enemy model with an attack, it must make a second melee attack with an AP cost of 1 against another model, friendly or enemy, within melee range. This additional attack costs no AP."},
    {_id:"S0015",type:"model",cost:4,name:"Fly",text:"This model can move through other models and impassable terrain, and does not suffer the slowing effects of difficult terrain. Only models that were engaging this model at the beginning of its movement may perform disengage attacks"},
    {_id:"S0016",type:"attack",cost:2,name:"Armor Piercing",text:"Target model gets -2 ARM against this attack"},
    {_id:"S0017",type:"attack",cost:4,name:"Incorporeal",text:"Target model’s ARM is 0 against this attack"},
    {_id:"S0018",type:"special",cost:2,name:"Rapid Strike",text:"This model may make up to 3 melee attacks with AP 1 against a single target",AP:2},
    {_id:"S0019",type:"special",cost:2,name:"Rapid Fire",text:"This model may make up to 3 ranged attacks with AP 1 against a single target",AP:2},
    {_id:"S0020",type:"move",cost:3,AP:1,name:"Leap",text:"This model moves up to its SPD stat, moving through intervening models and terrain without penalty. Only models that were engaging this model at the beginning of its movement may perform disengage attacks"},
    {_id:"S0021",type:"command",cost:2,name:"Guard Him!",text:"Target friendly model within 12” gets the guarded condition (Guarded: If this model is damaged by an attack action, you may assign some all of the damage it suffers to another model within base to base contact, then this condition ends)",AP:1},
    {_id:"S0022",type:"command",cost:2,name:"You Must Protect!",text:"Target friendly model within 12” gets the bodyguard condition (Bodyguard: If a model in contact with this model is damaged by an attack action, you may assign some or all of the damage it suffers to this model, then this condition ends)",AP:1},
    {_id:"S0023",type:"command",cost:2,name:"Maneuver Drill!",text:"This model receives the maneuvers aura condition for one round (maneuvers aura: All friendly models within 12” of this model may move through other friendly models)",AP:1},
    {_id:"S0024",type:"command",cost:2,name:"Defensive Positions!",text:"This model receives the following condition for one round (\u003ci\u003eDefense Aura\u003c/i\u003e: If a friendly model within 12” of this model is in contact with another friendly model, it cannot be flanked)",AP:1},
    {_id:"S0025",type:"command",cost:2,name:"Reform!",text:"All friendly models within 6” may immediately perform a Reposition action in whatever order you choose",AP:1},
    {_id:"S0026",type:"command",cost:2,name:"Strike!",text:"Target friendly model within 12” may immediately perform an attack action",AP:1},
    {_id:"S0027",type:"attack",cost:3,name:"Lucky Damage",text:"This attack may reroll failed DMG tests."},
    {_id:"S0028",type:"model",cost:4,name:"Melee Expert",text:"This model gains 1 additional AP which may only be used to make melee attacks"}
  ];

  constructor() { }

  /**
   * Retrieve all model special rules from the database. Returns a promise to provide an array of rules
   */
  async getModelSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType("model");
  }

  /**
   * Retrieve all action special rules from the database. Returns a promise to provide an array of rules
   */
  async getActionSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType("special");
  }

  /**
   * Retrieve all attack special rules from the database. Returns a promise to provide an array of rules
   */
  async getAttackSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType("attack");
  }

  /**
   * Internal method that will return an arracy of special rules based on the type (model, special or attack)
   * @param type must be one of the official rule types: "model", "special", or "action" 
   */
  private async getSpecialRuleByType( type:string ): Promise<SpecialRuleData[]> {
    let returnList: SpecialRuleData[] = [];
    for ( let specialRule of this.specialRuleDB ) {
      if ( specialRule.type == type ) {
        returnList.push( this.convertDBToRuleData(specialRule) );
      }
    }
    return returnList;
  }

  /**
   * Converts a DB record into the externally-exposed SpecialRuleData entity. 
   * Returns the converted record
   * @param ruleDBData the DB data to be converted
   */
  private convertDBToRuleData( ruleDBData: RuleDBData ): SpecialRuleData {
    
    // initialize the return data
    let ruleData: SpecialRuleData = {
      _id: ruleDBData._id,
      ruleType: ruleDBData.type,
      ruleName: ruleDBData.name,
      ruleText: ruleDBData.text,
      ruleCost: ruleDBData.cost
    }

    // copy optional parameters
    if ( typeof ruleDBData.AP !== "undefined" ) {
      ruleData.ruleAP = ruleDBData.AP;
    }

    return ruleData;
  }

  /**
   * Converts an externally-exposed SpecialRuleData entity into a record for DB storage.
   * Returns the converted record
   * @param ruleData the data to be converted
   */
  private convertRuleDataToDB( ruleData: SpecialRuleData ): RuleDBData {
    
    // initialize the return data
    let ruleDBData: RuleDBData = {
      _id: ruleData._id,
      type: ruleData.ruleType,
      name: ruleData.ruleName,
      text: ruleData.ruleText,
      cost: ruleData.ruleCost
    };

    // copy optional parameters
    if ( typeof ruleData.ruleAP !== "undefined" ) {
      ruleDBData.AP = ruleData.ruleAP;
    }

    return ruleDBData;    
  }

}
