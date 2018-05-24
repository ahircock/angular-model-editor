import { Injectable } from '@angular/core';
import { DbConnectService, RuleDBData } from '../db-connect/db-connect.service';

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

  private ruleDBCache: RuleDBData[] = [];

  constructor(
    private dbConnectService: DbConnectService
  ) { }

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
    
    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.ruleDBCache.length == 0 ) {
      this.ruleDBCache = await this.dbConnectService.getRules();
    }

    let returnList: SpecialRuleData[] = [];
    for ( let specialRule of this.ruleDBCache ) {
      if ( specialRule.type == type ) {
        returnList.push( this.convertDBToRuleData(specialRule) );
      }
    }
    returnList.sort(this.sortRuleData);
    return returnList;
  }

  /**
   * Create a new rule with default settings. Returns the new rule
   * @param ruleType the type of the new rule. Must be "attack", "model", or "special"
   */
  async createNewRule( ruleType: string ): Promise<SpecialRuleData> {
    
    // generate a new ID for the rule
    let newRuleId = await this.dbConnectService.getNextId("S");

    // prepare a new rule object
    let newRule: RuleDBData = { _id: newRuleId, type: ruleType, name:"NEW RULE", text: "Enter text for new rule", cost: 1 };
    if ( ruleType == "special" ) {
      newRule.AP = 1;
    }

    // add the new rule to the DB
    newRule = await this.dbConnectService.createRule( newRule );
    this.ruleDBCache.push(newRule);

    // return the new force
    return this.convertDBToRuleData( newRule );    
  }

  /**
   * Update an existing rule with new details. Returns the updated rule
   * @param specialRuleData the rule that is being updated
   */
  async updateRule( updateRule: SpecialRuleData ): Promise<SpecialRuleData> {

    // make sure that the rule name is uppercase (for sorting)
    updateRule.ruleName = updateRule.ruleName.toUpperCase();
    
    // update the database
    let updateDBRule = await this.dbConnectService.updateRule(this.convertRuleDataToDB(updateRule));
    
    // find the entry in the fake DB, and then update it
    let findRuleIndex: number = this.ruleDBCache.findIndex( element => element._id == updateRule._id );
    this.ruleDBCache[findRuleIndex] = updateDBRule;

    // return a deep copy of the updated record
    let returnRule = this.convertDBToRuleData( updateDBRule );
    return returnRule;
  }

  /**
   * Delete an existing rule. Returns nothing
   * @param deleteRule the rule that will be deleted
   */
  async deleteRule( deleteRule: SpecialRuleData ): Promise<void> {

    // remove the entry from the DB
    await this.dbConnectService.deleteRule( this.convertRuleDataToDB(deleteRule));

    // find the model in the fake DB, and then remove it
    let findRuleIndex: number = this.ruleDBCache.findIndex( element => element._id == deleteRule._id );
    this.ruleDBCache.splice(findRuleIndex, 1 );
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

  /**
   * The method used by Javascript array.sort to sort the array of rules
   * @param a first rule
   * @param b second rule
   */
  private sortRuleData( a: SpecialRuleData, b: SpecialRuleData ): number {
    
    // always return the basic model first
    if ( a.ruleName < b.ruleName ) {
      return -1;
    } else if ( a.ruleName > b.ruleName ) {
      return 1;
    } else {
      return 0;
    }
  }
    
}
