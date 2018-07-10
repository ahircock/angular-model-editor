import { Injectable } from '@angular/core';
import { DbConnectService, ActionDBData } from '../db-connector/db-connector.interface';
import { SpecialRuleData, SpecialRuleDataService } from '../special-rule-data/special-rule-data.service'
import { Action } from 'rxjs/scheduler/Action';

export interface ActionData {
  _id: string;
  userId: string;
  type: string;
  name: string;
  traits: string;
  AP: number;
  RNG: number;
  HIT: number;
  DMG: number;
  ONCE: boolean;
  specialRules: SpecialRuleData[];
}

@Injectable()
export class ActionDataService {

  private actionCache: ActionData[] = [];
  private loggedInUserId: string = "";

  constructor(
    private dbConnectService: DbConnectService,
    private specialRuleDataService: SpecialRuleDataService
  ) { }

  async getMeleeActions(): Promise<ActionData[]> {
    return this.getActionsByType( "MELEE" );
  }

  async getRangedActions(): Promise<ActionData[]> {
    return this.getActionsByType( "RANGED" );
  }

  async getSpecialActions(): Promise<ActionData[]> {
    return this.getActionsByType( "SPECIAL" );
  }

  private async getActionsByType( type: string ): Promise<ActionData[]> {
    
    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.actionCache.length == 0 ) {
      await this.loadCache();
    }

    // filter down the array to only include those with the correct type
    let returnList: ActionData[] = [];
    for ( let action of this.actionCache ) {
      if ( action.type == type ) {
        returnList.push( action );
      }
    }

    // return the array of actions
    return returnList;
  }

  async createNewAction( actionType: string ): Promise<ActionData> {

    // generate a new ID
    let newActionId = await this.dbConnectService.getNextId("S");

    // prepare a new rule object
    let newActionDb: ActionDBData = { 
      _id: newActionId, 
      userId: this.loggedInUserId.toLowerCase(), 
      type: actionType, 
      name:"NEW " + actionType.toUpperCase() + " ACTION", 
      traits: "",
      AP: 1,
      RNG: 1,
      HIT: 1,
      DMG: 1,
      ONCE: false,
      specialRuleIds: []
    };

    // add the new rule to the DB
    newActionDb = await this.dbConnectService.createAction( newActionDb );

    // add the new rule to the cache
    let newAction: ActionData = await this.convertDBToAppData( newActionDb );
    this.actionCache.push(newAction);

    // return the new force
    return newAction;

  }

  private async loadCache() {
    
    // clear out the rule cache
    this.actionCache = [];

    // load the rule objects form the DB
    let actionDBList: ActionDBData[] = await this.dbConnectService.getActions();
    
    // convert everything to the application objects and add it to the cache
    for ( let actionDB of actionDBList ) {
      this.actionCache.push( await this.convertDBToAppData(actionDB) );
    }

    // sort the cache
    this.actionCache.sort(this.sortActionData);
  }

  private async convertDBToAppData( dbData: ActionDBData ): Promise<ActionData> {
    
    let appData: ActionData = {
      _id: dbData._id,
      userId: dbData.userId,
      type: dbData.type,
      name: dbData.name,
      traits: dbData.traits,
      AP: dbData.AP,
      RNG: dbData.RNG,
      HIT: dbData.HIT,
      DMG: dbData.DMG,
      ONCE: dbData.ONCE,
      specialRules: []
    };

    // copy over the special rules
    for ( let ruleId of dbData.specialRuleIds ) {
      let specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
      appData.specialRules.push( specialRuleData );
    }

    return appData;
  }

  private convertAppToDBData( appData: ActionData ): ActionDBData {
    
    let dbData: ActionDBData = {
      _id: appData._id,
      userId: appData.userId,
      type: appData.type,
      name: appData.name,
      traits: appData.traits,
      AP: appData.AP,
      RNG: appData.RNG,
      HIT: appData.HIT,
      DMG: appData.DMG,
      ONCE: appData.ONCE,
      specialRuleIds: []
    };

    // copy over the special rules
    for ( let rule of appData.specialRules ) {
      dbData.specialRuleIds.push( rule._id );
    }

    return dbData;
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


}
