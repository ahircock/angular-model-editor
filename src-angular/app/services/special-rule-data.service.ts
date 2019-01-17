import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
// tslint:disable-next-line: semicolon
import { UserService } from './user.service'

export interface SpecialRuleData {
  _id: string;
  ruleName: string;
  ruleText: string;
}

/**
* Structure of Rule data, as stored in the database
*/
interface RuleDBData {
  _id: string;
  name: string;
  text: string;
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
   * Returns the special rule with the given ID
   * @param ruleId _id of the rule that you want to return
   */
  async getSpecialRuleById( ruleId: string ): Promise<SpecialRuleData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.ruleCache.length === 0 ) {
      await this.loadCache();
    }

    // find the rule in the cache and return it
    const rule = this.ruleCache.find( element => element._id === ruleId );
    if ( typeof rule === 'undefined' ) {
      throw Error('ruleId:' + ruleId + ' does not exist');
    }
    return rule;
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
      ruleName: ruleDBData.name.toUpperCase(),
      ruleText: ruleDBData.text
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
