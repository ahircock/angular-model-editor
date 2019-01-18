import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { UserService } from './user.service';
import { ModelData, ModelDataService } from './model-data.service';

export interface FactionData {
  _id: string;
  name: string;
  models: FactionModelData[];
}
export interface FactionModelData {
  modelData: ModelData;
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
    private modelDataService: ModelDataService,
    private userService: UserService
  ) {
    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  /**
   * Returns the special faction with the given ID
   * @param factionId _id of the faction that you want to return
   */
  async getFactionById( factionId: string ): Promise<FactionData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.factionCache.length === 0 ) {
      await this.loadCache();
    }

    // find the faction in the cache and return it
    const faction = this.factionCache.find( element => element._id === factionId );
    if ( typeof faction === 'undefined' ) {
      throw Error('factionId:' + factionId + ' does not exist');
    }
    return faction;
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
   * @param factionDBData the DB data to be converted
   */
  private async convertDBToFactionData( factionDBData: FactionDBData ) {

    // initialize the return data
    const factionData: FactionData = {
      _id: factionDBData._id,
      name: factionDBData.name,
      models: []
    };


    // retrieve the model information from its service
    const modelIdList: string[] = [];
    for ( const factionModel of factionDBData.models ) {
      modelIdList.push( factionModel.modelId );
    }
    const modelDataList: ModelData[] = await this.modelDataService.getModelListById( modelIdList );

    // copy the faction models to the object
    for ( let i = 0; i < factionDBData.models.length; i++  ) {
      const factionModelData: FactionModelData = {
        modelData: modelDataList[i],
        max: factionDBData.models[i].max
      };
      factionData.models.push(factionModelData);
    }

    return factionData;
  }

  /**
   * The method used by Javascript array.sort to sort the array of factions
   * @param a first faction
   * @param b second faction
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
    // clear out the faction cache
    this.factionCache = [];

    // load the faction objects form the DB
    const factionDBList: FactionDBData[] = await this.dbConnectService.getFactions();

    // convert everything to a FactionData and add it to the cache
    for ( const factionDB of factionDBList ) {
      this.factionCache.push( await this.convertDBToFactionData(factionDB) );
    }

    console.log(this.factionCache);
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.factionCache = [];
  }
}
