import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { RuleData, RuleDataService } from './rule-data.service';
import { UserService } from './user.service';

/**
 * List of possible attack types
 */
export const enum AttackType {
  Melee = 'MELEE',
  Ranged = 'RANGED'
}

/**
 * Structure of attack data
 */
export interface AttackData {
  _id: string;
  type: AttackType;
  traits: string;
  RNG: number;
  DICE: number;
  HIT: number;
  AP: number;
  DMG: number;
  rules: RuleData[];
}

/**
* Structure of attack data, as stored in the database
*/
interface AttackDBData {
  _id: string;
  type: AttackType;
  traits: string;
  RNG: number;
  DICE: number;
  HIT: number;
  AP: number;
  DMG: number;
  ruleIds: string[];
}

@Injectable()
export class AttackDataService {

  private attackCache: AttackData[] = [];

  constructor(
    private dbConnectService: DataAccessService,
    private ruleDataService: RuleDataService,
    private userService: UserService
  ) {

    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  async getAttackById( attackId: string ): Promise<AttackData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.attackCache.length === 0 ) {
      await this.loadCache();
    }

    // return the model with the matching ID
    const attack = this.attackCache.find( element => element._id === attackId );
    if ( typeof attack === 'undefined' ) {
      throw Error('attackId:' + attackId + ' does not exist');
    }
    return attack;

  }

  private async loadCache() {

    // clear out the rule cache
    const prepareCache: AttackData[] = [];

    // load the rule objects form the DB
    const attackDBList: AttackDBData[] = await this.dbConnectService.getAttacks();

    // convert everything to the application objects and add it to the cache
    for ( const attackDB of attackDBList ) {
      prepareCache.push( await this.convertDBToAppData(attackDB) );
    }

    // store the prepared cache
    this.attackCache = prepareCache;
  }

  private async convertDBToAppData( dbData: AttackDBData ): Promise<AttackData> {

    // create an application data object
    const appData: AttackData = {
      _id: dbData._id,
      type: dbData.type,
      traits: dbData.traits,
      RNG: dbData.RNG,
      DICE: dbData.DICE,
      HIT: dbData.HIT,
      AP: dbData.AP,
      DMG: dbData.DMG,
      rules: []
    };

    // copy over the special rules
    for ( const ruleId of dbData.ruleIds ) {
      const ruleData: RuleData = await this.ruleDataService.getSpecialRuleById(ruleId);
      appData.rules.push( ruleData );
    }

    return appData;
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.attackCache = [];
  }
}
