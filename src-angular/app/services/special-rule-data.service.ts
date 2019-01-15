import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
// tslint:disable-next-line: semicolon
import { UserService } from './user.service'

export interface SpecialRuleData {
  _id: string;
  ruleType: RuleType;
  ruleName: string;
  ruleText: string;
  printVisible: boolean;
  ruleCost?: number;
  modSPD?: number;
  modEV?: number;
  modARM?: number;
  modHP?: number;
  modStrDMG?: number;
  modMHIT?: number;
  modRHIT?: number;
}

/**
 * List of possible rule types
 */
export const enum RuleType {
  Special = 'special',
  Attack = 'attack',
  Model = 'model'
}

/**
* Structure of Rule data, as stored in the database
*/
interface RuleDBData {
  _id: string;
  type: RuleType;
  name: string;
  text: string;
  printVisible: boolean;
  cost?: number;
  modSPD?: number;
  modEV?: number;
  modARM?: number;
  modHP?: number;
  modStrDMG?: number;
  modMHIT?: number;
  modRHIT?: number;
}

@Injectable()
export class SpecialRuleDataService {

  private ruleCache: SpecialRuleData[] = [];

  // these are events that other services can subscribe to
  public ruleUpdated: EventEmitter<SpecialRuleData> = new EventEmitter();
  public ruleDeleted: EventEmitter<SpecialRuleData> = new EventEmitter();

  constructor(
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {

    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  /**
   * Retrieve all model special rules from the database. Returns a promise to provide an array of rules
   */
  async getModelSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType(RuleType.Model);
  }

  /**
   * Retrieve all action special rules from the database. Returns a promise to provide an array of rules
   */
  async getActionSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType(RuleType.Special);
  }

  /**
   * Retrieve all attack special rules from the database. Returns a promise to provide an array of rules
   */
  async getAttackSpecialRules(): Promise<SpecialRuleData[]> {
    return await this.getSpecialRuleByType(RuleType.Attack);
  }

  /**
   * Internal method that will return an arracy of special rules based on the type (model, special or attack)
   * @param type must be one of the official rule types: "model", "special", or "action"
   */
  private async getSpecialRuleByType( type: RuleType ): Promise<SpecialRuleData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.ruleCache.length === 0 ) {
      await this.loadCache();
    }

    // filter down the array to only include those with the correct type
    const returnList: SpecialRuleData[] = [];
    for ( const rule of this.ruleCache ) {
      if ( rule.ruleType === type ) {
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
    if ( this.ruleCache.length === 0 ) {
      await this.loadCache();
    }

    // find the rule in the cache and return it
    return this.ruleCache.find( element => element._id === ruleId );
  }

  /**
   * Converts a DB record into the externally-exposed SpecialRuleData entity.
   * Returns the converted record
   * @param ruleDBData the DB data to be converted
   */
  private convertDBToRuleData( ruleDBData: RuleDBData ): SpecialRuleData {

    // initialize the return data
    const ruleData: SpecialRuleData = {
      _id: ruleDBData._id,
      ruleType: ruleDBData.type,
      ruleName: ruleDBData.name.toUpperCase(),
      ruleText: ruleDBData.text,
      ruleCost: ruleDBData.cost,
      printVisible: typeof ruleDBData.printVisible === 'undefined' ? true : ruleDBData.printVisible,
      modSPD: ruleDBData.modSPD ? ruleDBData.modSPD : 0,
      modEV: ruleDBData.modEV ? ruleDBData.modEV : 0,
      modARM: ruleDBData.modARM ? ruleDBData.modARM : 0,
      modHP: ruleDBData.modHP ? ruleDBData.modHP : 0,
      modStrDMG: ruleDBData.modStrDMG ? ruleDBData.modStrDMG : 0,
      modMHIT: ruleDBData.modMHIT ? ruleDBData.modMHIT : 0,
      modRHIT: ruleDBData.modRHIT ? ruleDBData.modRHIT : 0
    };

    return ruleData;
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
    const ruleDBList: RuleDBData[] = await this.dbConnectService.getRules();

    // convert everything to a SpecialRuleData and add it to the cache
    for ( const ruleDB of ruleDBList ) {
      this.ruleCache.push( this.convertDBToRuleData(ruleDB));
    }
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.ruleCache = [];
  }
}
