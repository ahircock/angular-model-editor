import { Injectable, EventEmitter } from '@angular/core';
import { DbConnectService, RuleDBData } from '../db-connector/db-connector.interface';
import { UserService } from '../user/user.service'

export interface SpecialRuleData {
  _id: string;
  ruleType: string;
  ruleName: string;
  ruleText: string;
  ruleCost: number;
  ruleAP: number;
  editable: boolean;
}

@Injectable()
export class SpecialRuleDataService {

  private ruleCache: SpecialRuleData[] = [];

  private loggedInUserId: string = "";

  // these are events that other services can subscribe to
  public ruleUpdated: EventEmitter<SpecialRuleData> = new EventEmitter();
  public ruleDeleted: EventEmitter<SpecialRuleData> = new EventEmitter();

  constructor(
    private dbConnectService: DbConnectService,
    private userService: UserService
  ) { 

    // subscribe to events from the other services
    this.userService.loginEvent.subscribe( (email:any) => this.login(email) );
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

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
    if ( this.ruleCache.length == 0 ) {
      await this.loadCache();
    }

    // filter down the array to only include those with the correct type
    let returnList: SpecialRuleData[] = [];
    for ( let rule of this.ruleCache ) {
      if ( rule.ruleType == type ) {
        returnList.push( rule );
      }
    }

    // sor the data and then return it
    returnList.sort(this.sortRuleData);
    return returnList;
  }

  /**
   * Returns the special rule with the given ID
   * @param ruleId _id of the rule that you want to return
   */
  async getSpecialRuleById( ruleId: string ): Promise<SpecialRuleData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.ruleCache.length == 0 ) {
      await this.loadCache();
    }

    // find the rule in the cache and return it
    return this.ruleCache.find( element => element._id == ruleId );    
  }

  /**
   * Create a new rule with default settings. Returns the new rule
   * @param ruleType the type of the new rule. Must be "attack", "model", or "special"
   */
  async createNewRule( ruleType: string ): Promise<SpecialRuleData> {
    
    // generate a new ID for the rule
    let newRuleId = await this.dbConnectService.getNextId("S");

    // prepare a new rule object
    let newRuleDB: RuleDBData = { _id: newRuleId, userId: this.loggedInUserId, type: ruleType, name:"NEW RULE", text: "Enter text for new rule", cost: 1, AP: 1 };

    // add the new rule to the DB
    newRuleDB = await this.dbConnectService.createRule( newRuleDB );

    // add the new rule to the cache
    let newRule: SpecialRuleData = this.convertDBToRuleData( newRuleDB );
    this.ruleCache.push(newRule);

    // return the new force
    return newRule;
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
    let newUpdateRule = this.convertDBToRuleData(updateDBRule);
    
    // find the entry in the fake DB, and then update it
    let findRuleIndex: number = this.ruleCache.findIndex( element => element._id == newUpdateRule._id );
    this.ruleCache[findRuleIndex] = newUpdateRule;

    // notify all subscribers that the event has changed
    this.ruleUpdated.emit(newUpdateRule);

    // return a deep copy of the updated record
    return newUpdateRule;
  }

  /**
   * Delete an existing rule. Returns nothing
   * @param deleteRule the rule that will be deleted
   */
  async deleteRule( deleteRule: SpecialRuleData ): Promise<void> {

    // remove the entry from the DB
    await this.dbConnectService.deleteRule( this.convertRuleDataToDB(deleteRule));

    // find the model in the fake DB, and then remove it
    let findRuleIndex: number = this.ruleCache.findIndex( element => element._id == deleteRule._id );
    this.ruleCache.splice(findRuleIndex, 1 );

    // notify all subscribers that the event has changed
    this.ruleDeleted.emit(deleteRule);
  }

  /**
   * Clone an existing rule. 
   */
  async cloneRule( cloneRule: SpecialRuleData ): Promise<SpecialRuleData> {
    
    // generate a new ID for the cloned rule
    let newRuleId = await this.dbConnectService.getNextId("S");

    // prepare a new rule object
    let newRuleDB: RuleDBData = { 
      _id: newRuleId, 
      userId: this.loggedInUserId, 
      type: cloneRule.ruleType, 
      name: cloneRule.ruleName + " (COPY)", 
      text: cloneRule.ruleText, 
      cost: cloneRule.ruleCost, 
      AP: cloneRule.ruleAP 
    };

    // add the new rule to the DB
    newRuleDB = await this.dbConnectService.createRule( newRuleDB );

    // add the new rule to the cache
    let newRule: SpecialRuleData = this.convertDBToRuleData( newRuleDB );
    this.ruleCache.push(newRule);

    // return the new force
    return newRule;
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
      ruleCost: ruleDBData.cost,
      ruleAP: ruleDBData.AP,
      editable: ruleDBData.userId == this.loggedInUserId ? true : false
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
      userId: this.loggedInUserId,
      type: ruleData.ruleType,
      name: ruleData.ruleName,
      text: ruleData.ruleText,
      cost: ruleData.ruleCost,
      AP: ruleData.ruleAP
    };


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

  private async loadCache() {
    // clear out the rule cache
    this.ruleCache = [];

    // load the rule objects form the DB
    let ruleDBList: RuleDBData[] = await this.dbConnectService.getRules();
    
    // convert everything to a SpecialRuleData and add it to the cache
    for ( let ruleDB of ruleDBList ) {
      this.ruleCache.push( this.convertDBToRuleData(ruleDB));
    }
  }
    
  /**
   * This method should be called after logout
   */
  public logout() {
    this.ruleCache = [];
    this.loggedInUserId = "";
  }

  /**
   * This method should be called after login
   */
  public login(userId: string) {
    this.loggedInUserId = userId;
  }  
}
