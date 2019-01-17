import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { SpecialRuleData, SpecialRuleDataService } from './special-rule-data.service';
import { ActionData, ActionDataService } from './action-data.service';
import { UserService } from './user.service';

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
  specialRules: SpecialRuleData[];
  actions: ModelActionData[];
  options: ModelOptionData[];
}

export interface ModelActionData extends ActionData {
  modelActionName: string;
}

export interface ModelOptionData {
  id: string;
  description: string;
  choices: ModelOptionChoiceData[];
}

export interface ModelOptionChoiceData {
  description: string;
  cost: number;
  attacks: ModelActionData[];
  actions: ModelActionData[];
  abilities: SpecialRuleData[];
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
  actions: ModelActionDBData[];
  abilities: ModelAbilityDBData[];
  options: ModelOptionDBData[];
}
interface ModelActionDBData {
  modelActionName: string;
  actionId: string;
}
interface ModelAbilityDBData {
  specialRuleId: string;
}
interface ModelOptionDBData {
  id: string;
  description: string;
  choices: ModelOptionChoiceDBData[];
}
interface ModelOptionChoiceDBData {
  description: string;
  cost: number;
  attacks: ModelActionDBData[];
  actions: ModelActionDBData[];
  abilities: ModelAbilityDBData[];
}

@Injectable()
export class ModelDataService {

  private modelCache: ModelData[] = [];

  constructor(
    private specialRuleDataService: SpecialRuleDataService,
    private actionDataService: ActionDataService,
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {
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
    return this.modelCache.find( element => element._id === id );
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

    // always return the basic model first
    if ( a._id === 'M0000' ) { return -1; }
    if ( b._id === 'M0000' ) { return 1; }

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
      specialRules: [],
      actions: [],
      options: []
    };

    // copy the special rules onto the model
    for ( const ability of modelDBData.abilities ) {
      const specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ability.specialRuleId);
      modelData.specialRules.push( specialRuleData );
    }

    // copy the actions onto the model
    for ( const actionDB of modelDBData.actions ) {

      const action: ActionData = await this.actionDataService.getActionById( actionDB.actionId );

      const modelAction: ModelActionData = {
        modelActionName: actionDB.modelActionName,
        _id: action._id,
        type: action.type,
        traits: action.traits,
        RNG: action.RNG,
        DICE: action.DICE,
        HIT: action.HIT,
        AP: action.AP,
        DMG: action.DMG,
        specialRules: action.specialRules
      };
      modelData.actions.push( modelAction );
    }

    // copy the options onto the model
    for ( const optionDB of modelDBData.options ) {

      const modelOption: ModelOptionData = {
        id: optionDB.id,
        description: optionDB.description,
        choices: []
      };

      // copy the choices into the option
      for ( const choiceDB of optionDB.choices ) {

        const choice: ModelOptionChoiceData = {
          description: choiceDB.description,
          cost: choiceDB.cost,
          attacks: [],
          actions: [],
          abilities: []
        };

        // copy the attacks into the choice
        for ( const attackDB of choiceDB.attacks ) {
          const action: ActionData = await this.actionDataService.getActionById( attackDB.actionId );
          const attack: ModelActionData = {
            modelActionName: attackDB.modelActionName,
            _id: action._id,
            type: action.type,
            traits: action.traits,
            RNG: action.RNG,
            DICE: action.DICE,
            HIT: action.HIT,
            AP: action.AP,
            DMG: action.DMG,
            specialRules: action.specialRules
          };
          choice.attacks.push( attack );
        }

        // copy the actions into the choice
        for ( const actionDB of choiceDB.actions ) {
          const action: ActionData = await this.actionDataService.getActionById( actionDB.actionId );
          const actionModel: ModelActionData = {
            modelActionName: actionDB.modelActionName,
            _id: action._id,
            type: action.type,
            traits: action.traits,
            RNG: action.RNG,
            DICE: action.DICE,
            HIT: action.HIT,
            AP: action.AP,
            DMG: action.DMG,
            specialRules: action.specialRules
          };
          choice.actions.push( actionModel );
        }

        // copy the special rules onto the model
        for ( const ability of choiceDB.abilities ) {
          const specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ability.specialRuleId);
          choice.abilities.push( specialRuleData );
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

    // convert everything to a SpecialRuleData and add it to the cache
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

