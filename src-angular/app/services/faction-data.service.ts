import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { UserService } from './user.service';
import { ModelData, ModelDataService, ModelOptionData, ModelOptionDBData,
  ModelAbilityDBData, ModelAbilityData, ModelAttackData, ModelAttackDBData } from './model-data.service';
import { AbilityDataService } from './ability-data.service';
import { AttackDataService } from './attack-data.service';

export interface FactionData {
  _id: string;
  name: string;
  models: FactionModelData[];
  modelOptions: ModelOptionData[];
  factionAbilities: ModelAbilityData[];
  factionAttacks: ModelAttackData[];
}
export interface FactionModelData {
  modelData: ModelData;
  max: number;
  options: ModelOptionData[];
}

/**
* Structure of Faction data, as stored in the database
*/
interface FactionDBData {
  _id: string;
  name: string;
  models: FactionModelDBData[];
  modelOptions: ModelOptionDBData[];
  factionAbilities: ModelAbilityDBData[];
  factionAttacks: ModelAttackDBData[];
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
    private abilityDataService: AbilityDataService,
    private attackDataService: AttackDataService,
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
      modelOptions: [],
      models: [],
      factionAbilities: [],
      factionAttacks: []
    };

    // copy the options from the DB, modelOptions is an optional field
    if ( factionDBData.modelOptions ) {
      factionData.modelOptions = await this.modelDataService.convertDBToModelOptionDataList( factionDBData.modelOptions );
    }

    // copy the models to the faction
    if ( factionDBData.models ) {
      for ( const factionModelDB of factionDBData.models  ) {

        const model = await this.modelDataService.getModelById( factionModelDB.modelId );
        const factionModelData: FactionModelData = {
          modelData: model,
          max: factionModelDB.max ? factionModelDB.max : 9999,
          options: []
        };

        // combine the options from both the Model and the Faction onto this FactionModel
        factionModelData.options = model.options.concat(factionData.modelOptions);

        // add the faction model to the faction data
        factionData.models.push(factionModelData);
      }
    }

    // copy the faction abilities
    if ( factionDBData.factionAbilities ) {
      for ( const factionAbilityDB of factionDBData.factionAbilities ) {
        const ability = await this.abilityDataService.getAbilityById( factionAbilityDB.abilityId );
        const factionAbilityData: ModelAbilityData = {
          abilityData: ability,
          modelAbilityName: factionAbilityDB.modelAbilityName ? factionAbilityDB.modelAbilityName : ability.name
        };
        factionData.factionAbilities.push(factionAbilityData);
      }
    }

    // copy the faction attacks
    if ( factionDBData.factionAttacks ) {
      for ( const factionAttackDB of factionDBData.factionAttacks ) {
        const attack = await this.attackDataService.getAttackById( factionAttackDB.attackId );
        const factionAttackData: ModelAttackData = {
          attackData: attack,
          modelAttackName: factionAttackDB.modelAttackName ? factionAttackDB.modelAttackName : attack.name
        };
        factionData.factionAttacks.push(factionAttackData);
      }
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
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.factionCache = [];
  }
}
