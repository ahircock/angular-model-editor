import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { UserService } from './user.service';

export interface RuleData {
  _id: string;
  ruleName: string;
  ruleText: string;
  power: number;
}

/**
* Structure of Rule data, as stored in the database
*/
interface RuleDBData {
  _id: string;
  name: string;
  text: string;
  power: number;
}

@Injectable()
export class RuleDataService {

  private ruleCache: RuleData[] = [];

  // these are events that other services can subscribe to
  public ruleUpdated: EventEmitter<RuleData> = new EventEmitter();
  public ruleDeleted: EventEmitter<RuleData> = new EventEmitter();

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
  async getRuleById( ruleId: string ): Promise<RuleData> {

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
   * Converts a DB record into the externally-exposed RuleData entity.
   * Returns the converted record
   * @param ruleDBData the DB data to be converted
   */
  private convertDBToRuleData( ruleDBData: RuleDBData ): RuleData {

    // initialize the return data
    const ruleData: RuleData = {
      _id: ruleDBData._id,
      ruleName: ruleDBData.name.toUpperCase(),
      ruleText: ruleDBData.text,
      power: ruleDBData.power ? ruleDBData.power : 0
    };

    return ruleData;
  }

  /**
   * The method used by Javascript array.sort to sort the array of rules
   * @param a first rule
   * @param b second rule
   */
  private sortRuleData( a: RuleData, b: RuleData ): number {

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

    // convert everything to a RuleData and add it to the cache
    for ( const ruleDB of ruleDBList ) {
      this.ruleCache.push( this.convertDBToRuleData(ruleDB));
    }

    // replace any special tokens in the rule text
    await this.replaceRuleTokens();
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.ruleCache = [];
  }

  async replaceRuleTokens() {

    // loop through every rule in the cache
    for ( const rule of this.ruleCache ) {

      // are there any @rule{} tokens
      let startPos = rule.ruleText.search('rule={');
      while ( startPos > 0 ) {
        const ruleNameLen = rule.ruleText.substr(startPos).search('}') - 6;
        const ruleId = rule.ruleText.substr(startPos + 6, ruleNameLen);

        // get the embedded rule
        const embeddedRule = await this.getRuleById(ruleId);

        // generate the new rule text
        const newRuleText =
            rule.ruleText.substr(0, startPos) +
            '<i>' + embeddedRule.ruleName + '</i>: ' +
            embeddedRule.ruleText +
            rule.ruleText.substr(startPos + ruleNameLen + 7);
        rule.ruleText = newRuleText;

        startPos = rule.ruleText.search('rule={');
      }


    }
    return;
  }
}
