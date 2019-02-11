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
  name: string;
  type: AttackType;
  traits: string;
  RNG: number;
  DICE: number;
  HIT: number;
  AP: number;
  DMG: number;
  rules: RuleData[];
  seeBelow: boolean;
  multiProfileAttackData: AttackData[];
}

/**
* Structure of attack data, as stored in the database
*/
interface AttackDBData {
  _id: string;
  name: string;
  type: AttackType;
  traits: string;
  RNG: number;
  DICE: number;
  HIT: number;
  AP: number;
  DMG: number;
  ruleIds: string[];
  seeBelow: boolean;
  multiProfileAttackIds: string[];
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

    // prepare any attacks with multiple profiles
    this.prepareMultiProfile( attackDBList );
  }

  /**
   * After all of the attacks have been loaded into the cache, we need to load
   * up the sub-attacks that are stored in the multi-profile attribute
   * @param attackDBDataList The source DB data for all attacks
   */
  private async prepareMultiProfile( attackDBDataList: AttackDBData[] ) {
    for ( const attackDB of attackDBDataList ) {
      if ( attackDB.multiProfileAttackIds && attackDB.multiProfileAttackIds.length > 0 ) {
        const attackData: AttackData = await this.getAttackById(attackDB._id);
        for ( const subAttackId of attackDB.multiProfileAttackIds ) {
          const subAttackData: AttackData = await this.getAttackById(subAttackId);
          attackData.multiProfileAttackData.push( subAttackData );
        }
      }
    }
  }

  private async convertDBToAppData( dbData: AttackDBData ): Promise<AttackData> {

    // create an application data object
    const appData: AttackData = {
      _id: dbData._id,
      name: dbData.name,
      type: dbData.type,
      traits: dbData.traits ? dbData.traits : '',
      RNG: dbData.RNG ? dbData.RNG : 0,
      DICE: dbData.DICE ? dbData.DICE : 0,
      HIT: dbData.HIT ? dbData.HIT : 0,
      AP: dbData.AP ? dbData.AP : 0,
      DMG: dbData.DMG ? dbData.DMG : 0,
      seeBelow: dbData.seeBelow ? dbData.seeBelow : false,
      rules: [],
      multiProfileAttackData: []
    };

    // copy over the special rules
    if ( dbData.ruleIds ) {
      for ( const ruleId of dbData.ruleIds ) {
        const ruleData: RuleData = await this.ruleDataService.getRuleById(ruleId);
        appData.rules.push( ruleData );
      }
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
