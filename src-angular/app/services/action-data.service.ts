import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { UserService } from './user.service';

/**
 * Structure of action data
 */
export interface ActionData {
  _id: string;
  name: string;
  duration: string;
  power: number;
  text: string;
}

/**
* Structure of action data, as stored in the database
*/
interface ActionDBData {
  _id: string;
  name: string;
  duration: string;
  power: number;
  text: string;
}

@Injectable()
export class ActionDataService {

  private actionCache: ActionData[] = [];

  constructor(
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {

    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  async getActionById( actionId: string ): Promise<ActionData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.actionCache.length === 0 ) {
      await this.loadCache();
    }

    // return the action with the matching ID
    const action = this.actionCache.find( element => element._id === actionId );
    if ( typeof action === 'undefined' ) {
      throw Error('actionId:' + actionId + ' does not exist');
    }
    return action;

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

    // store the prepared cache
    this.actionCache = prepareCache;
  }

  private async convertDBToAppData( dbData: ActionDBData ): Promise<ActionData> {

    // create an application data object
    const appData: ActionData = {
      _id: dbData._id,
      name: dbData.name,
      text: dbData.text,
      power: dbData.power ? dbData.power : 0,
      duration: dbData.duration
    };

    return appData;
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.actionCache = [];
  }
}
