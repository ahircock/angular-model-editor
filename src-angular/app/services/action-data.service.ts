import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService, ActionDBData, ActionType, RuleType } from './data-access.service';
import { SpecialRuleData, SpecialRuleDataService } from './special-rule-data.service';
import { UserService } from './user.service';

export interface ActionData {
  _id: string;
  userId: string;
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
  editable: boolean;
}

export {ActionType};

@Injectable()
export class ActionDataService {

  private actionCache: ActionData[] = [];
  private loggedInUserId: string;

  // these are events that other services can subscribe to
  public actionUpdated: EventEmitter<ActionData> = new EventEmitter();
  public actionDeleted: EventEmitter<ActionData> = new EventEmitter();

  constructor(
    private dbConnectService: DataAccessService,
    private specialRuleDataService: SpecialRuleDataService,
    private userService: UserService
  ) {

    // initialize the user id
    this.loggedInUserId = this.userService.userName;

    // subscribe to events from the other services
    this.userService.loginEvent.subscribe( (email: any) => this.login(email) );
    this.userService.logoutEvent.subscribe( () => this.logout() );
    this.specialRuleDataService.ruleUpdated.subscribe( (updatedRule: any) => this.ruleUpdated(updatedRule) );
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

  async createNewAction( actionType: ActionType ): Promise<ActionData> {

    // generate a new ID
    const newActionId = await this.dbConnectService.getNextId('A');

    // prepare a new rule object
    let newActionDb: ActionDBData = {
      _id: newActionId,
      userId: this.loggedInUserId.toLowerCase(),
      type: actionType,
      name: 'NEW ' + actionType.toUpperCase() + ' ACTION',
      traits: '',
      AP: 1,
      RNG: actionType === ActionType.Ranged ? 12 : 1,
      HIT: 6,
      DMG: 6,
      strengthBased: actionType === ActionType.Ranged ? false : true,
      ONCE: false,
      cost: 1,
      specialRuleIds: []
    };

    // add the new rule to the DB
    newActionDb = await this.dbConnectService.createAction( newActionDb );

    // add the new rule to the cache
    const newAction: ActionData = await this.convertDBToAppData( newActionDb );
    this.actionCache.push(newAction);

    // return the new force
    return newAction;
  }

  async deleteAction( deleteAction: ActionData ) {

    // delete the model from the database
    await this.dbConnectService.deleteAction( this.convertAppToDBData(deleteAction));

    // remove the model from the cache
    const index: number = this.actionCache.findIndex( element => element._id === deleteAction._id );
    this.actionCache.splice( index, 1 );

    this.actionDeleted.emit(deleteAction);
  }

  async cloneAction( cloneAction: ActionData ) {

    // prepare the action data for cloning
    cloneAction = this.prepareDataForUpdate( cloneAction );

    // create a new copy of the model
    let newAction: ActionData = JSON.parse( JSON.stringify(cloneAction) );
    newAction.name = newAction.name + ' (C)';

    // generate a new ID for the model
    newAction._id = await this.dbConnectService.getNextId('A');

    // add the new model to the database
    const newDBAction = await this.dbConnectService.createAction(this.convertAppToDBData(newAction));

    // add the new model to the cache
    newAction = await this.convertDBToAppData(newDBAction);
    this.actionCache.push(newAction);

    // return the new model
    return newAction;
  }

  async updateAction( updateAction: ActionData ) {

    // prepare the action data for saving
    updateAction = this.prepareDataForUpdate( updateAction );

    // update the database with the new model
    const updateDBAction = await this.dbConnectService.updateAction( this.convertAppToDBData(updateAction) );

    // update the record in the cache
    const newUpdatedAction = await this.convertDBToAppData(updateDBAction);
    const findModelIndex: number = this.actionCache.findIndex( element => element._id === newUpdatedAction._id );
    this.actionCache[findModelIndex] = newUpdatedAction;

    this.actionUpdated.emit(newUpdatedAction);

    // return the updated model
    return newUpdatedAction;
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
      userId: dbData.userId,
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
      specialRules: [],
      editable: dbData.userId.toLowerCase() === this.loggedInUserId.toLowerCase() ? true : false
    };

    // copy over the special rules
    for ( const ruleId of dbData.specialRuleIds ) {
      const specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
      appData.specialRules.push( specialRuleData );
    }

    return appData;
  }

  private convertAppToDBData( appData: ActionData ): ActionDBData {

    const dbData: ActionDBData = {
      _id: appData._id,
      userId: appData.userId,
      type: appData.type,
      name: appData.name,
      traits: appData.traits,
      AP: appData.AP,
      RNG: appData.RNG,
      HIT: appData.HIT,
      DMG: appData.DMG,
      strengthBased: appData.strengthBased,
      ONCE: appData.ONCE,
      cost: appData.cost,
      specialRuleIds: []
    };

    // copy over the special rules
    for ( const rule of appData.specialRules ) {
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

  private prepareDataForUpdate( appData: ActionData ) {
    appData.name = appData.name.toUpperCase();
    return appData;
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.actionCache = [];
    this.loggedInUserId = '';
  }

  /**
   * This method should be called after login
   */
  private login(userId: string) {
    this.loggedInUserId = userId;
  }

  private ruleUpdated(updatedRule: SpecialRuleData ) {

    // we don't need to do an update if this is a model rule
    if ( updatedRule.ruleType === RuleType.Model ) {
      return;
    }

    // loop through all actions
    for ( const action of this.actionCache ) {

      // if this rule is used on this model, then update it
      const ruleIndex = action.specialRules.findIndex( element => element._id === updatedRule._id );
      if ( ruleIndex >= 0 ) {
        action.specialRules[ruleIndex] = updatedRule;
      }

      // recalculate the details of the model and inform people that it has changed
      this.actionUpdated.emit(action);
    }

  }
}
