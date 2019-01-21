import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { RuleData, RuleDataService } from './rule-data.service';
import { UserService } from './user.service';

/**
 * Structure of ability data
 */
export interface AbilityData {
  _id: string;
  name: string;
  text: string;
  power: number;
}

/**
* Structure of ability data, as stored in the database
*/
interface AbilityDBData {
  _id: string;
  name: string;
  text: string;
  power: number;
}

@Injectable()
export class AbilityDataService {

  private abilityCache: AbilityData[] = [];

  constructor(
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {

    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  async getAbilityById( abilityId: string ): Promise<AbilityData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.abilityCache.length === 0 ) {
      await this.loadCache();
    }

    // return the ability with the matching ID
    const ability = this.abilityCache.find( element => element._id === abilityId );
    if ( typeof ability === 'undefined' ) {
      throw Error('abilityId:' + abilityId + ' does not exist');
    }
    return ability;

  }

  private async loadCache() {

    // clear out the rule cache
    const prepareCache: AbilityData[] = [];

    // load the rule objects form the DB
    const abilityDBList: AbilityDBData[] = await this.dbConnectService.getAbilities();

    // convert everything to the application objects and add it to the cache
    for ( const abilityDB of abilityDBList ) {
      prepareCache.push( await this.convertDBToAppData(abilityDB) );
    }

    // store the prepared cache
    this.abilityCache = prepareCache;
  }

  private async convertDBToAppData( dbData: AbilityDBData ): Promise<AbilityData> {

    // create an application data object
    const appData: AbilityData = {
      _id: dbData._id,
      name: dbData.name,
      text: dbData.text,
      power: dbData.power ? dbData.power : 0
    };

    return appData;
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.abilityCache = [];
  }
}