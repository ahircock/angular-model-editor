import { Injectable } from '@angular/core';
import { DbConnectService, ModelDBData, ModelActionDBData } from '../db-connect/db-connect.service';
import { SpecialRuleData, SpecialRuleDataService } from '../special-rule-data/special-rule-data.service'

export interface ModelData {
  _id: string;
  template: boolean,
  name: string;
  traits: string;
  picture: string;
  cost: number;
  SPD: number;
  EV: number;
  ARM: number;
  HP: number;
  specialRules: SpecialRuleData[];
  actions: ModelActionData[];
}

export interface ModelActionData {
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

export interface StatCost {
  stat: number;
  cost: number;
}

@Injectable()
export class ModelDataService {

  private modelCache: ModelData[] = [];

  // These constant arrays are used to calculate the total cost of a model, and can be displayed in dropdowns
  public BASE_COST = 10;
  public SPD_COST: StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:6} ];
  public EV_COST:  StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:5} ];
  public ARM_COST: StatCost[] = [ {stat:0, cost:0 }, {stat:1, cost:1 }, {stat:2,  cost:2}, {stat:3, cost:4}, {stat:4, cost:6} ];
  public HP_COST:  StatCost[] = [ {stat:5, cost:0 }, {stat:8, cost:3 }, {stat:10, cost:5} ];
  public HIT_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public DMG_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3} ];
  public MELEE_RNG_COST:  StatCost[] = [ {stat:0, cost:-1 }, {stat:1, cost:0 }, {stat:2, cost:2} ];
  public RANGED_RNG_COST: StatCost[] = [ {stat:8, cost:2 }, {stat:12, cost:3 }, {stat:24, cost:5}, {stat:60, cost:7} ];

  constructor(
    private specialRuleDataService: SpecialRuleDataService,
    private dbConnectService: DbConnectService
  ) { }

  /**
   * Returns the list of all models in the database, templates and otherwise
   */
  async getAllModels(): Promise<ModelData[]> {
    
    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.modelCache.length == 0 ) {
      await this.loadCache();
    }
    
    // sort the list of models in the cache
    this.modelCache.sort(this.sortModelData);

    // return all models in the cache
    return this.modelCache;
  }
  
  /**
   * Returns the list of all models that are listed as templates
   */
  async getAllTemplates(): Promise<ModelData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.modelCache.length == 0 ) {
      await this.loadCache();
    }

    // make a deep copy of the model list and then return it
    let templateList: ModelData[] = [];
    for ( let model of this.modelCache ) {
      if ( model.template ) {
        templateList.push( model ); 
      }
    }

    // sort the list of models
    templateList.sort(this.sortModelData);

    return templateList;
  }
  
  /**
   * Returns a single model as identified by the given _id
   * @param id the _id of the model to return
   */
  async getModelById(id: string): Promise<ModelData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.modelCache.length == 0 ) {
      await this.loadCache();
    }

    // return the model with the matching ID
    return this.modelCache.find( element => element._id == id );    
  }

  /**
   * Returns an array of models, based on the given array of _id values. The return array will 
   * be in the same order as the provided idList array
   * @param idList array of _id values to return
   */
  async getModelListById ( idList: string[] ): Promise<ModelData[]> {
    
    // get the list of models, and return a deep copy
    let modelList: ModelData[] = [];
    for ( let id of idList ) {
      modelList.push( await this.getModelById(id) );
    }
    return modelList;
  }

  /**
   * Create a new "template" model. We will initialize the model with some basic stats
   */
  async createTemplate(): Promise<ModelData> {
    
    // clone the "basic" model
    let newModelDB: ModelDBData = { _id:"NEW", template:true, name:"New Model", traits:null, picture:"basic.jpg", SPD:5,EV:5,ARM:0,HP:5,specialRuleIds:[],actions:[]};
    let newAction: ModelActionData = { type: "MELEE", name: "NEW MELEE", traits: "", ONCE: false, AP:1, RNG:1, HIT:6, DMG:6, specialRules:[] };
    newModelDB.actions.push(newAction);
    this.updateCost(newModelDB);

    // generate a new ID for the model
    newModelDB._id = await this.dbConnectService.getNextId("M");    

    // create the model in the database
    newModelDB = await this.dbConnectService.createModel( this.convertModelDataToDB(newModelDB) );

    // add this new model to the cache
    let newModel = await this.convertDBToModelData( newModelDB );
    this.modelCache.push(newModel);

    // return the new model
    return newModel;
  }

  /**
   * Updates the details of a particular model. The _id of the given parm will be used to 
   * find the matching model
   * @param updateModel the data for the updated model
   */
  async updateModel( updateModel: ModelData ): Promise<ModelData> {

    // make sure that the cost of the updated model is correct
    this.updateCost(updateModel);

    // update the database with the new model
    let updateDBModel = await this.dbConnectService.updateModel( this.convertModelDataToDB(updateModel) );
    
    // update the record in the cache
    let newUpdateModel = await this.convertDBToModelData(updateDBModel);
    let findModelIndex: number = this.modelCache.findIndex( element => element._id == newUpdateModel._id );
    this.modelCache[findModelIndex] = newUpdateModel;

    // return the updated model
    return newUpdateModel;
  }

  /**
   * Clones/duplicates an existing model. This creates a new model, and then 
   * initializes it with all of the given model's values. A new _id will be 
   * generated for the cloned model. This can be used to clone both a 
   * force-model and a template
   * @param clonedModel the model that will be cloned
   * @param cloneFromTemplate true if you are trying to clone a normal model based on a template. Defaulted to false
   */
  async cloneModel( clonedModel: ModelData, cloneModelFromTemplate = false ): Promise<ModelData> {
    
    // create a new copy of the model
    let newModel: ModelData = JSON.parse( JSON.stringify(clonedModel) );
    this.updateCost(newModel);

    // if this is being cloned from a template, then the new model should not be a template
    if ( cloneModelFromTemplate ) {
      newModel.template = false;
    }

    // generate a new ID for the model
    newModel._id = await this.dbConnectService.getNextId("M");

    // give the new model a different name
    newModel.name = newModel.name + "-C"

    // add the new model to the database
    let newDBModel = await this.dbConnectService.createModel(this.convertModelDataToDB(newModel));

    // add the new model to the cache
    newModel = await this.convertDBToModelData(newDBModel);
    this.modelCache.push(newModel);

    // return the new model
    return newModel;
  }

  /**
   * Creates a new model based on a template. A new _id will be 
   * generated for the cloned model. 
   * @param template the template that you are using to clone the model
   */
  async cloneModelFromTemplate( template: ModelData ): Promise<ModelData> {
    return await this.cloneModel( template, true );
  }

  /**
   * Deletes the given model from the database
   * @param deleteModel the model that will be removed from the DB
   */
  async deleteModel( deleteModel: ModelData ): Promise<void> {
    
    // delete the model from the database
    await this.dbConnectService.deleteModel( this.convertModelDataToDB(deleteModel));

    // remove the model from the cache
    let modelIndex: number = this.modelCache.findIndex( element => element._id == deleteModel._id );
    this.modelCache.splice( modelIndex, 1 );
  }

  /**
   * Adds a new default special action to the model and updates the database
   * @param model the model to update
   * @param rule the new special rule action to add to the model
   */
  async addSpecialAction( model: ModelData, rule: SpecialRuleData ): Promise<ModelData> {
    
    // add a new special action to the model
    let newAction: ModelActionData = { 
      type: "SPECIAL",
      name: rule.ruleName,
      traits: "",
      AP: rule.ruleAP,
      RNG: 0,
      HIT: 0,
      DMG: 0,
      ONCE: false,
      specialRules: [rule]
    }
    model.actions.push(newAction);

    // update the database
    return await this.updateModel(model);
  }

  /**
   * Add a new default melee action to the model and update the database
   * @param model the model to update
   */
  async addMeleeAction( model: ModelData ): Promise<ModelData> {

    // add a new default melee action to the model
    let newAction: ModelActionData = { 
      type: "MELEE", 
      name: "NEW MELEE", 
      traits: "", 
      ONCE: false, 
      AP:1, 
      RNG:1,
      HIT:6, 
      DMG:6, 
      specialRules:[] 
    };
    model.actions.push(newAction);

    // update the database
    return await this.updateModel(model);
  }

  /**
   * Add a new default ranged action to the model and update the database
   * @param model the model to update
   */
  async addRangedAction( model: ModelData ): Promise<ModelData> {

    // add a new default melee action to the model
    let newAction: ModelActionData = { 
      type: "RANGED", 
      name: "NEW RANGED", 
      traits: "", 
      ONCE: false, 
      AP:1, 
      RNG:12, 
      HIT:6, 
      DMG:6, 
      specialRules:[]
    };
    model.actions.push(newAction);

    // update the database
    return await this.updateModel(model);
  }

  /**
   * Updates the ModelData.cost value of a given model based on all of the proper calculations
   * @param model the model whose cost will be updated
   */
  private updateCost( model: ModelData ): void {
    model.cost = this.BASE_COST;

    // add the cost of model stats
    model.cost += this.SPD_COST.find( (element) => { return element.stat == model.SPD; } ).cost;
    model.cost += this.EV_COST.find( (element) => { return element.stat == model.EV; } ).cost;
    model.cost += this.ARM_COST.find( (element) => { return element.stat == model.ARM; } ).cost;
    model.cost += this.HP_COST.find( (element) => { return element.stat == model.HP; } ).cost;

    // add the special rule costs
    for ( let specialRule of model.specialRules ) {
      model.cost += specialRule.ruleCost;
    }
    
    // add the action costs, based on the type of action
    for ( let action of model.actions ) {

      let actionCost = 0;

      switch ( action.type ) {

        case "MELEE":
          actionCost += this.MELEE_RNG_COST.find( (element) => { return element.stat == action.RNG; } ).cost;
          actionCost += this.HIT_COST.find( (element) => { return element.stat == action.HIT; } ).cost;
          actionCost += this.DMG_COST.find( (element) => { return element.stat == action.DMG; } ).cost;
          
          // add in the cost of all special rules
          for ( let specialRule of action.specialRules ) {
            actionCost += specialRule.ruleCost;
          }

          break;

        case "RANGED":
          actionCost += this.RANGED_RNG_COST.find( (element) => { return element.stat == action.RNG; } ).cost;
          actionCost += this.HIT_COST.find( (element) => { return element.stat == action.HIT; } ).cost;
          actionCost += this.DMG_COST.find( (element) => { return element.stat == action.DMG; } ).cost;

          // add in the cost of all special rules
          for ( let specialRule of action.specialRules ) {
            actionCost += specialRule.ruleCost;
          }

          break;

        case "SPECIAL":
          actionCost += action.specialRules[0].ruleCost;
      }

      // actions cannot have a negative cost
      if ( actionCost > 0 ) {
        model.cost += actionCost;
      }
    }
  }

  /**
   * The method used by Javascript array.sort to sort force datas
   * @param a first force
   * @param b second force
   */
  private sortModelData( a: ModelData, b: ModelData ): number {
    
    // always return the basic model first
    if ( a._id == "M0000" ) { return -1 };
    if ( b._id == "M0000" ) { return 1};

    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Converts the application ModelData structure into a ModelDBData used to store in the DB
   * @param modelData the app model data to convert
   */
  private convertModelDataToDB( modelData: ModelData ): ModelDBData {

    // initialize header
    let modelDBData: ModelDBData = {
      _id: modelData._id,
      template: modelData.template,
      name: modelData.name,
      traits: modelData.traits,
      picture: modelData.picture,
      SPD: modelData.SPD,
      EV: modelData.EV,
      ARM: modelData.ARM,
      HP: modelData.HP,
      specialRuleIds: [],
      actions: []
    };

    // initialize special rule IDs
    for ( let rule of modelData.specialRules ) {
      modelDBData.specialRuleIds.push( rule._id );
    }

    // initialize actions
    for ( let action of modelData.actions ) {
      let modelActionDBData: ModelActionDBData = {
        type: action.type,
        name: action.name,
        traits: action.traits,
        AP: action.AP,
        RNG: action.RNG,
        HIT: action.HIT,
        DMG: action.DMG,
        ONCE: action.ONCE,
        specialRuleIds: []
      }
      for ( let rule of action.specialRules ) {
        modelActionDBData.specialRuleIds.push( rule._id );
      }
      modelDBData.actions.push( modelActionDBData );
    }

    // return the new object
    return modelDBData;
  }
  
  /**
   * Converts the database ModelDBData structure into a ModelData structure used by the application
   * @param modelDBData the database structure to convert
   */
  private async convertDBToModelData( modelDBData: ModelDBData ): Promise<ModelData> {

    let modelData: ModelData = {
      _id: modelDBData._id,
      template: modelDBData.template,
      name: modelDBData.name,
      traits: modelDBData.traits,
      picture: modelDBData.picture,
      cost: 0,
      SPD: modelDBData.SPD,
      EV: modelDBData.EV,
      ARM: modelDBData.ARM,
      HP: modelDBData.HP,
      specialRules: [],
      actions: []
    }

    // calculate the model's cost
    this.updateCost( modelData );

    // copy over the special rules
    for ( let ruleId of modelDBData.specialRuleIds ) {
      let specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
      modelData.specialRules.push( specialRuleData );
    }

    // copy over the actions
    for ( let actionDB of modelDBData.actions ) {
      let action: ModelActionData = {
        type: actionDB.type,
        name: actionDB.name,
        traits: actionDB.traits,
        AP: actionDB.AP,
        RNG: actionDB.RNG,
        HIT: actionDB.HIT,
        DMG: actionDB.DMG,
        ONCE: actionDB.ONCE,
        specialRules: []              
      }
      for ( let ruleId of actionDB.specialRuleIds ) {
        let specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
        action.specialRules.push( specialRuleData );
      }
      modelData.actions.push(action);
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
    let modelDBList: ModelDBData[] = await this.dbConnectService.getModels();
    
    // convert everything to a SpecialRuleData and add it to the cache
    for ( let modelDB of modelDBList ) {
      this.modelCache.push( await this.convertDBToModelData(modelDB) );
    }
  }
  
  
}
