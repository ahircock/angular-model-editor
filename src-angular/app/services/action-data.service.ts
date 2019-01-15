import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { SpecialRuleData, SpecialRuleDataService } from './special-rule-data.service';
import { UserService } from './user.service';

/**
 * List of possible action types
 */
export const enum ActionType {
  Special = 'SPECIAL',
  Melee = 'MELEE',
  Ranged = 'RANGED'
}

/**
 * Structure of action data
 */
export interface ActionData {
  _id: string;
  type: ActionType;
  name: string;
  traits: string;
  AP: number;
  RNG: number;
  HIT: number;
  DMG: number;
  strengthBased: boolean;
  ONCE: boolean;
  cost: number;
  specialRules: SpecialRuleData[];
}

/**
* Structure of Action data, as stored in the database
*/
interface ActionDBData {
  _id: string;
  type: ActionType;
  name: string;
  traits: string;
  AP: number;
  RNG: number;
  HIT: number;
  DMG: number;
  strengthBased: boolean;
  ONCE: boolean;
  cost: number;
  specialRuleIds: string[];
}

@Injectable()
export class ActionDataService {

  private actionCache: ActionData[] = [];

  constructor(
    private dbConnectService: DataAccessService,
    private specialRuleDataService: SpecialRuleDataService,
    private userService: UserService
  ) {

    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  async getMeleeActions(): Promise<ActionData[]> {
    return this.getActionsByType( 'MELEE' );
  }

  async getRangedActions(): Promise<ActionData[]> {
    return this.getActionsByType( 'RANGED' );
  }

  async getSpecialActions(): Promise<ActionData[]> {
    return this.getActionsByType( 'SPECIAL' );
  }

  async getActionById( actionId: string ): Promise<ActionData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.actionCache.length === 0 ) {
      await this.loadCache();
    }

    // return the model with the matching ID
    return this.actionCache.find( element => element._id === actionId );

  }

  private async getActionsByType( type: string ): Promise<ActionData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.actionCache.length === 0 ) {
      await this.loadCache();
    }

    // filter down the array to only include those with the correct type
    const returnList: ActionData[] = [];
    for ( const action of this.actionCache ) {
      if ( action.type === type ) {
        returnList.push( action );
      }
    }

    // sort the list
    returnList.sort(this.sortActionData);

    // return the array of actions
    return returnList;
  }

  private async loadCache() {

    // clear out the rule cache
    const prepareCache: ActionData[] = [];

    // load the rule objects form the DB
    const actionDBList: ActionDBData[] = await this.dbConnectService.getActions();

    // convert everything to the application objects and add it to the cache
    for ( const actionDB of actionDBList ) {
      prepareCache.push( await this.convertDBToAppData(actionDB) );
    }

    // sort the cache
    prepareCache.sort(this.sortActionData);

    // store the prepared cache
    this.actionCache = prepareCache;
  }

  private async convertDBToAppData( dbData: ActionDBData ): Promise<ActionData> {

    // get the default strength-based
    let strengthBased = true;
    if ( typeof dbData.strengthBased === 'undefined' ) {
      if ( dbData.type === ActionType.Ranged ) { strengthBased = false; } // by default ranged attacks are not strength based
    } else {
      strengthBased = dbData.strengthBased;
    }

    const appData: ActionData = {
      _id: dbData._id,
      type: dbData.type,
      name: dbData.name,
      traits: dbData.traits,
      AP: dbData.AP,
      ONCE: dbData.ONCE,
      RNG: dbData.RNG,
      HIT: dbData.HIT,
      DMG: dbData.DMG,
      strengthBased: strengthBased,
      cost: typeof dbData.cost === 'undefined' ? 1 : dbData.cost, // default to 1 if it doesn't exist
      specialRules: []
    };

    // copy over the special rules
    for ( const ruleId of dbData.specialRuleIds ) {
      const specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
      appData.specialRules.push( specialRuleData );
    }

    return appData;
  }

  /**
   * The method used by Javascript to sort data
   * @param a first action
   * @param b second action
   */
  private sortActionData( a: ActionData, b: ActionData ): number {
    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  }

  private prepareDataForUpdate( appData: ActionData ) {
    appData.name = appData.name.toUpperCase();
    return appData;
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.actionCache = [];
  }
}
