import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { UserService } from './user.service';
import { ModelData } from './model-data.service';

export interface FactionData {
  _id: string;
  name: string;
  models: FactionModelData[];
}
export interface FactionModelData extends ModelData {
  max: number;
}

/**
* Structure of Faction data, as stored in the database
*/
interface FactionDBData {
  _id: string;
  name: string;
  models: FactionModelDBData[];
}
interface FactionModelDBData {
  modelId: string;
  max: number;
}

@Injectable()
export class FactionDataService {

  private factionCache: FactionData[] = [];

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
  async getFactionById( factionId: string ): Promise<FactionData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.factionCache.length === 0 ) {
      await this.loadCache();
    }

    // find the rule in the cache and return it
    const rule = this.factionCache.find( element => element._id === factionId );
    if ( typeof rule === 'undefined' ) {
      throw Error('factionId:' + factionId + ' does not exist');
    }
    return rule;
  }

  /**
   * Returns the list of all factions in the database
   */
  async getAllFactions(): Promise<FactionData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.factionCache.length === 0 ) {
      await this.loadCache();
    }

    // sort the list of models in the cache
    this.factionCache.sort(this.sortFactionData);

    // return all models in the cache
    return this.factionCache;
  }

  /**
   * Converts a DB record into the externally-exposed FactionData entity.
   * Returns the converted record
   * @param ruleDBData the DB data to be converted
   */
  private convertDBToFactionData( factionDBData: FactionDBData ): FactionData {

    // initialize the return data
    const factionData: FactionData = {
      _id: factionDBData._id,
      name: factionDBData.name,
      models: []
    };

    return factionData;
  }

  /**
   * The method used by Javascript array.sort to sort the array of rules
   * @param a first rule
   * @param b second rule
   */
  private sortFactionData( a: FactionData, b: FactionData ): number {

    // always return the basic model first
    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  }

  private async loadCache() {
    // clear out the rule cache
    this.factionCache = [];

    // load the rule objects form the DB
    const factionDBList: FactionDBData[] = await this.dbConnectService.getFactions();

    // convert everything to a FactionData and add it to the cache
    for ( const ruleDB of factionDBList ) {
      this.factionCache.push( this.convertDBToFactionData(ruleDB));
    }
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.factionCache = [];
  }
}
