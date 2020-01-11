import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { AttackData, AttackDataService } from './attack-data.service';
import { UserService } from './user.service';
import { AbilityData, AbilityDataService } from './ability-data.service';
import { ActionData, ActionDataService } from './action-data.service';

export interface ModelData {
  _id: string;
  name: string;
  picture: string;
  traits: string;
  cost: number;
  SPD: number;
  DEF: number;
  ARM: number;
  HP: number;
  attacks: ModelAttackData[];
  actions: ModelActionData[];
  abilities: ModelAbilityData[];
  options: ModelOptionData[];
}

export interface ModelAttackData {
  attackData: AttackData;
  modelAttackName: string;
}

export interface ModelActionData {
  actionData: ActionData;
  modelActionName: string;
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
  actions: ModelActionData[];
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
  SPD: number;
  DEF: number;
  ARM: number;
  HP: number;
  attacks: ModelAttackDBData[];
  abilities: ModelAbilityDBData[];
  actions: ModelActionDBData[];
  options: ModelOptionDBData[];
}
export interface ModelAttackDBData {
  modelAttackName: string;
  attackId: string;
}
export interface ModelActionDBData {
  modelActionName: string;
  actionId: string;
}
export interface ModelAbilityDBData {
  modelAbilityName: string;
  abilityId: string;
}
export interface ModelOptionDBData {
  id: string;
  description: string;
  optional: boolean;
  multiSelect: boolean;
  choices: ModelOptionChoiceDBData[];
}
interface ModelOptionChoiceDBData {
  cost: number;
  attacks: ModelAttackDBData[];
  actions: ModelActionDBData[];
  abilities: ModelAbilityDBData[];
}

@Injectable()
export class ModelDataService {

  private modelCache: ModelData[] = [];

  constructor(
    private attackDataService: AttackDataService,
    private abilityDataService: AbilityDataService,
    private actionDataService: ActionDataService,
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
      traits: modelDBData.traits ? modelDBData.traits : '',
      picture: modelDBData.picture,
      cost: modelDBData.cost ? modelDBData.cost : 0,
      SPD: modelDBData.SPD ? modelDBData.SPD : 5,
      DEF: modelDBData.DEF ? modelDBData.DEF : 4,
      ARM: modelDBData.ARM ? modelDBData.ARM : 1,
      HP: modelDBData.HP ? modelDBData.HP : 5,
      abilities: [],
      actions: [],
      attacks: [],
      options: []
    };

    // copy the abilities onto the model
    if ( modelDBData.abilities ) {
      for ( const modelAbilityDB of modelDBData.abilities ) {
        const ability: AbilityData = await this.abilityDataService.getAbilityById(modelAbilityDB.abilityId);
        const modelAbility: ModelAbilityData = {
          abilityData: ability,
          modelAbilityName: modelAbilityDB.modelAbilityName ? modelAbilityDB.modelAbilityName : ability.name
        };
        modelData.abilities.push( modelAbility );
      }
    }

    // copy the attacks onto the model
    if ( modelDBData.attacks ) {
      for ( const modelAttackDB of modelDBData.attacks ) {
        const attack: AttackData = await this.attackDataService.getAttackById( modelAttackDB.attackId );
        const modelAttack: ModelAttackData = {
          attackData: attack,
          modelAttackName: modelAttackDB.modelAttackName ? modelAttackDB.modelAttackName : attack.name
        };
        modelData.attacks.push( modelAttack );
      }
    }

    // copy the actions onto the model
    if ( modelDBData.actions ) {
      for ( const modelActionDB of modelDBData.actions ) {
        const action: ActionData = await this.actionDataService.getActionById( modelActionDB.actionId );
        const modelAction: ModelActionData = {
          actionData: action,
          modelActionName: modelActionDB.modelActionName ? modelActionDB.modelActionName : action.name
        };
        modelData.actions.push( modelAction );
      }
    }

    // copy the options from the model-data to the model
    if ( modelDBData.options ) {
      modelData.options = await this.convertDBToModelOptionDataList( modelDBData.options );
    }

    // return the prepared object
    return modelData;
  }

  /**
   * This method converts an array of modelOptionDB records into ModelOption records
   */
  public async convertDBToModelOptionDataList( optionListDB: ModelOptionDBData[] ): Promise<ModelOptionData[]> {

    const modelOptionList: ModelOptionData[] = [];

    for ( const optionDB of optionListDB ) {

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
          actions: [],
          abilities: []
        };

        // copy the attacks into the choice
        if ( choiceDB.attacks ) {
          for ( const choiceAttackDB of choiceDB.attacks ) {
            const attack: AttackData = await this.attackDataService.getAttackById( choiceAttackDB.attackId );
            const modelAttack: ModelAttackData = {
              attackData: attack,
              modelAttackName: choiceAttackDB.modelAttackName ? choiceAttackDB.modelAttackName : attack.name
            };
            choice.attacks.push( modelAttack );
          }
        }

        // copy the actions into the choice
        if ( choiceDB.actions ) {
          for ( const choiceActionDB of choiceDB.actions ) {
            const action: ActionData = await this.actionDataService.getActionById( choiceActionDB.actionId );
            const modelAction: ModelActionData = {
              actionData: action,
              modelActionName: choiceActionDB.modelActionName ? choiceActionDB.modelActionName : action.name
            };
            choice.actions.push( modelAction );
          }
        }

        // copy the abilities onto the model
        if ( choiceDB.abilities ) {
          for ( const choiceAbilityDB of choiceDB.abilities ) {
            const ability: AbilityData = await this.abilityDataService.getAbilityById(choiceAbilityDB.abilityId);
            const modelAbility: ModelAbilityData = {
              abilityData: ability,
              modelAbilityName: choiceAbilityDB.modelAbilityName ? choiceAbilityDB.modelAbilityName : ability.name
            };
            choice.abilities.push( modelAbility );
          }
        }

        modelOption.choices.push(choice);
      }

      modelOptionList.push(modelOption);
    }

    // return the list of generated options
    return modelOptionList;
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

