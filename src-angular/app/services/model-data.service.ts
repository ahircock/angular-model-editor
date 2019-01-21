import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { AttackData, AttackDataService } from './attack-data.service';
import { UserService } from './user.service';
import { AbilityData, AbilityDataService } from './ability-data.service';

export interface ModelData {
  _id: string;
  name: string;
  picture: string;
  traits: string;
  cost: number;
  PW: number;
  SP: number;
  AR: number;
  WN: number;
  NE: number;
  attacks: ModelAttackData[];
  abilities: ModelAbilityData[];
  options: ModelOptionData[];
}

export interface ModelAttackData {
  attackData: AttackData;
  modelAttackName: string;
}

export interface ModelAbilityData {
  abilityData: AbilityData;
  modelAbilityName: string;
}

export interface ModelOptionData {
  id: string;
  description: string;
  optional: boolean;
  multiSelect: boolean;
  choices: ModelOptionChoiceData[];
}

export interface ModelOptionChoiceData {
  cost: number;
  attacks: ModelAttackData[];
  abilities: ModelAbilityData[];
}

/**
 * Structure of Model data, as stored in the database
 */
interface ModelDBData {
  _id: string;
  name: string;
  traits: string;
  picture: string;
  cost: number;
  PW: number;
  SP: number;
  AR: number;
  WN: number;
  NE: number;
  attacks: ModelAttackDBData[];
  abilities: ModelAbilityDBData[];
  options: ModelOptionDBData[];
}
interface ModelAttackDBData {
  modelAttackName: string;
  attackId: string;
}
interface ModelAbilityDBData {
  abilityName: string;
  abilityId: string;
}
interface ModelOptionDBData {
  id: string;
  description: string;
  optional: boolean;
  multiSelect: boolean;
  choices: ModelOptionChoiceDBData[];
}
interface ModelOptionChoiceDBData {
  cost: number;
  attacks: ModelAttackDBData[];
  abilities: ModelAbilityDBData[];
}

@Injectable()
export class ModelDataService {

  private modelCache: ModelData[] = [];

  constructor(
    private attackDataService: AttackDataService,
    private abilityDataService: AbilityDataService,
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {
    // subscribe to events from the other services
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  /**
   * Returns the list of all models in the database, templates and otherwise
   */
  async getAllModels(): Promise<ModelData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.modelCache.length === 0 ) {
      await this.loadCache();
    }

    // sort the list of models in the cache
    this.modelCache.sort(this.sortModelData);

    // return all models in the cache
    return this.modelCache;
  }

  /**
   * Returns a single model as identified by the given _id
   * @param id the _id of the model to return
   */
  async getModelById(id: string): Promise<ModelData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.modelCache.length === 0 ) {
      await this.loadCache();
    }

    // return the model with the matching ID
    const model = this.modelCache.find( element => element._id === id );
    if ( typeof model === 'undefined' ) {
      throw Error('modelId:' + id + ' does not exist');
    }
    return model;
  }

  /**
   * Returns an array of models, based on the given array of _id values. The return array will
   * be in the same order as the provided idList array
   * @param idList array of _id values to return
   */
  async getModelListById ( idList: string[] ): Promise<ModelData[]> {

    // get the list of models, and return a deep copy
    const modelList: ModelData[] = [];
    for ( const id of idList ) {
      modelList.push( await this.getModelById(id) );
    }
    return modelList;
  }

  /**
   * The method used by Javascript array.sort to sort force datas
   * @param a first force
   * @param b second force
   */
  private sortModelData( a: ModelData, b: ModelData ): number {

    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Converts the database ModelDBData structure into a ModelData structure used by the application
   * @param modelDBData the database structure to convert
   */
  private async convertDBToModelData( modelDBData: ModelDBData ): Promise<ModelData> {

    const modelData: ModelData = {
      _id: modelDBData._id,
      name: modelDBData.name,
      traits: modelDBData.traits,
      picture: modelDBData.picture,
      cost: modelDBData.cost ? modelDBData.cost : 0,
      PW: modelDBData.PW ? modelDBData.PW : 0,
      SP: modelDBData.SP ? modelDBData.SP : 5,
      AR: modelDBData.AR ? modelDBData.AR : 5,
      WN: modelDBData.WN ? modelDBData.WN : 2,
      NE: modelDBData.NE ? modelDBData.NE : 4,
      abilities: [],
      attacks: [],
      options: []
    };

    // copy the special rules onto the model
    for ( const modelAbilityDB of modelDBData.abilities ) {
      const ability: AbilityData = await this.abilityDataService.getAbilityById(modelAbilityDB.abilityId);
      const modelAbility: ModelAbilityData = {
        abilityData: ability,
        modelAbilityName: modelAbilityDB.abilityName ? modelAbilityDB.abilityName : ability.name
      }
      modelData.abilities.push( modelAbility );
    }

    // copy the attacks onto the model
    for ( const modelAttackDB of modelDBData.attacks ) {
      const attack: AttackData = await this.attackDataService.getAttackById( modelAttackDB.attackId );
      const modelAttack: ModelAttackData = {
        attackData: attack,
        modelAttackName: modelAttackDB.modelAttackName ? modelAttackDB.modelAttackName : attack.name
      };
      modelData.attacks.push( modelAttack );
    }

    // copy the options onto the model
    for ( const optionDB of modelDBData.options ) {

      const modelOption: ModelOptionData = {
        id: optionDB.id,
        description: optionDB.description,
        optional: optionDB.optional ? optionDB.optional : false,
        multiSelect : optionDB.multiSelect ? optionDB.multiSelect : false,
        choices: []
      };

      // copy the choices into the option
      for ( const choiceDB of optionDB.choices ) {

        const choice: ModelOptionChoiceData = {
          cost: choiceDB.cost,
          attacks: [],
          abilities: []
        };

        // copy the attacks into the choice
        for ( const choiceAttackDB of choiceDB.attacks ) {
          const attack: AttackData = await this.attackDataService.getAttackById( choiceAttackDB.attackId );
          const modelAttack: ModelAttackData = {
            attackData: attack,
            modelAttackName: choiceAttackDB.modelAttackName ? choiceAttackDB.modelAttackName : attack.name
          };
          choice.attacks.push( modelAttack );
        }

        // copy the abilities onto the model
        for ( const choiceAbilityDB of choiceDB.abilities ) {
          const ability: AbilityData = await this.abilityDataService.getAbilityById(choiceAbilityDB.abilityId);
          const modelAbility: ModelAbilityData = {
            abilityData: ability,
            modelAbilityName: choiceAbilityDB.abilityName ? choiceAbilityDB.abilityName : ability.name
          }
          choice.abilities.push( modelAbility );
        }

        modelOption.choices.push(choice);
      }

      modelData.options.push(modelOption);
    }

    // return the prepared object
    return modelData;
  }

  /**
   * method that loads all records from the database and stores them in the local cache
   */
  private async loadCache() {

    // clear out the rule cache
    this.modelCache = [];

    // load the rule objects form the DB
    const modelDBList: ModelDBData[] = await this.dbConnectService.getModels();

    // convert everything to a RuleData and add it to the cache
    for ( const modelDB of modelDBList ) {
      this.modelCache.push( await this.convertDBToModelData(modelDB) );
    }
  }

  /**
   * This method should be called after logout
   */
  private logout() {
    this.modelCache = [];
  }
}

