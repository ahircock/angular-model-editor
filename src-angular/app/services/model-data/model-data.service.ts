import { Injectable, EventEmitter } from '@angular/core';
import { DbConnectService, ModelDBData, ModelActionDBData } from '../db-connector/db-connector.interface';
import { SpecialRuleData, SpecialRuleDataService } from '../special-rule-data/special-rule-data.service'
import { ActionData, ActionDataService } from '../action-data/action-data.service'
import { UserService } from '../user/user.service'

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
  editable: boolean;
}

export interface ModelActionData extends ActionData {
  modelActionName: string;
}

export interface StatCost {
  stat: number;
  cost: number;
}

@Injectable()
export class ModelDataService {

  private modelCache: ModelData[] = [];

  private loggedInUserId: string;

  // these are events that other services can subscribe to
  public modelUpdated: EventEmitter<ModelData> = new EventEmitter();
  public modelDeleted: EventEmitter<ModelData> = new EventEmitter();

  // These constant arrays are used to calculate the total cost of a model, and can be displayed in dropdowns
  public BASE_COST = 10;
  public SPD_COST: StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:6} ];
  public EV_COST:  StatCost[] = [ {stat:3, cost:-2}, {stat:4, cost:-1}, {stat:5,  cost:0}, {stat:6, cost:1}, {stat:7, cost:3}, {stat:8, cost:5} ];
  public ARM_COST: StatCost[] = [ {stat:0, cost:0 }, {stat:1, cost:1 }, {stat:2,  cost:2}, {stat:3, cost:4}, {stat:4, cost:6} ];
  public HP_COST:  StatCost[] = [ {stat:5, cost:0 }, {stat:8, cost:3 }, {stat:10, cost:5} ];
  public HIT_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3}, {stat:10, cost:4}, {stat:11, cost:5}, {stat:12, cost:6} ];
  public DMG_COST: StatCost[] = [ {stat:4, cost:-2}, {stat:5, cost:-1}, {stat:6,  cost:0}, {stat:7, cost:1}, {stat:8, cost:2}, {stat:9, cost:3}, {stat:10, cost:4}, {stat:11, cost:5}, {stat:12, cost:6} ];
  public MELEE_RNG_COST:  StatCost[] = [ {stat:0, cost:-1 }, {stat:1, cost:0 }, {stat:2, cost:2} ];
  public RANGED_RNG_COST: StatCost[] = [ {stat:8, cost:2 }, {stat:12, cost:3 }, {stat:24, cost:5}, {stat:60, cost:7} ];

  constructor(
    private specialRuleDataService: SpecialRuleDataService,
    private actionDataService: ActionDataService,
    private dbConnectService: DbConnectService,
    private userService: UserService
  ) { 

    // initialize the user id
    this.loggedInUserId = this.userService.userName;

    // subscribe to events from the other services
    this.userService.loginEvent.subscribe( (email:any) => this.login(email) );
    this.userService.logoutEvent.subscribe( () => this.logout() );
    this.specialRuleDataService.ruleUpdated.subscribe( (updatedRule:any) => this.ruleUpdated(updatedRule) );
  }

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
    
    // generate a new ID for the model
    let newModelId = await this.dbConnectService.getNextId("M");    

    // clone the "basic" model
    let newModelDB: ModelDBData = { 
      _id:newModelId, 
      userId: this.loggedInUserId.toLowerCase(), 
      template:true, 
      name:"New Model", 
      traits:null, 
      picture:"basic.jpg", 
      SPD:5,
      EV:5,
      ARM:0,
      HP:5,
      specialRuleIds:[],
      actions:[]
    };

    // create the model in the database
    newModelDB = await this.dbConnectService.createModel( newModelDB );
    
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

    // update the database with the new model
    let updateDBModel = await this.dbConnectService.updateModel( this.convertModelDataToDB(updateModel) );
    
    // update the record in the cache
    let newUpdateModel = await this.convertDBToModelData(updateDBModel);
    let findModelIndex: number = this.modelCache.findIndex( element => element._id == newUpdateModel._id );
    this.modelCache[findModelIndex] = newUpdateModel;

    // notify all subscribing services that change occurred
    this.modelUpdated.emit(newUpdateModel);

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

    // if this is being cloned from a template, then the new model should not be a template
    if ( cloneModelFromTemplate ) {
      newModel.template = false;

    // if not cloned from a template, then give the new model a different name
    } else {
      newModel.name = newModel.name + "-C"
    }

    // generate a new ID for the model
    newModel._id = await this.dbConnectService.getNextId("M");

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

    // notify all subscribing services that change occurred
    this.modelDeleted.emit(deleteModel);
  }

  /**
   * Adds a baselined action to the model and updates the database
   * @param model the model to update
   * @param action the action to add to the model
   */
  async addAction( model: ModelData, action: ActionData ): Promise<ModelData> {
    
    // add a new special action to the model
    let newAction: ModelActionData = { 
      modelActionName: action.name,
      _id: action._id,
      userId: action.userId,
      type: action.type,
      name: action.name,
      traits: action.traits,
      AP: action.AP,
      RNG: action.RNG,
      HIT: action.HIT,
      DMG: action.DMG,
      ONCE: action.ONCE,
      cost: action.cost,
      specialRules: [],
      editable: true
    }

    // copy over the special rules
    for ( let actionRule of action.specialRules ) {
      let newRule: SpecialRuleData = {
        _id: actionRule._id,
        ruleType: actionRule.ruleType,
        ruleName: actionRule.ruleName,
        ruleText: actionRule.ruleText,
        ruleCost: actionRule.ruleCost,
        editable: true
      }
      newAction.specialRules.push( newRule );
    }

    // add the new action to the model
    model.actions.push(newAction);

    // update the database
    return await this.updateModel(model);
  }

  /**
   * Updates the ModelData.cost value of a given model based on all of the proper calculations
   * @param model the model whose cost will be updated
   */
  private calculateModelCost( model: ModelData ): ModelData {
    
    // start with the base cost
    let modelCost = this.BASE_COST;

    // add the cost of model stats
    modelCost += this.SPD_COST.find( element => element.stat == model.SPD ).cost;
    modelCost += this.EV_COST.find( element => element.stat == model.EV ).cost;
    modelCost += this.ARM_COST.find( element => element.stat == model.ARM ).cost;
    modelCost += this.HP_COST.find( element => element.stat == model.HP ).cost;

    // add the special rule costs
    for ( let specialRule of model.specialRules ) {
      modelCost += specialRule.ruleCost;
    }
    
    // add the action costs, based on the type of action
    for ( let action of model.actions ) {
      modelCost += action.cost;
    }

    // a model cannot be lower than the base cost
    if ( modelCost < this.BASE_COST ) {
      modelCost = this.BASE_COST;
    }

    // update the model and return it
    model.cost = modelCost;
    return model;
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
      userId: this.loggedInUserId.toLowerCase(),
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
        modelActionName: action.modelActionName,
        actionId: action._id
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
      actions: [],
      editable: modelDBData.userId.toLowerCase() == this.loggedInUserId.toLowerCase() ? true : false
    }

    // copy over the model special rules
    for ( let ruleId of modelDBData.specialRuleIds ) {
      let specialRuleData: SpecialRuleData = await this.specialRuleDataService.getSpecialRuleById(ruleId);
      modelData.specialRules.push( specialRuleData );
    }

    // copy over the actions
    for ( let actionDB of modelDBData.actions ) {

      let action: ActionData = await this.actionDataService.getActionById( actionDB.actionId );

      let modelAction: ModelActionData = {
        modelActionName: actionDB.modelActionName,
        _id: action._id,
        userId: action.userId,
        type: action.type,
        name: action.name,
        traits: action.traits,
        AP: action.AP,
        RNG: action.RNG,
        HIT: action.HIT,
        DMG: action.DMG,
        ONCE: action.ONCE,
        cost: action.cost? action.cost : 0,
        specialRules: action.specialRules,
        editable: modelData.editable
      }
      // for ( let rule of action.specialRules ) {
      //   modelAction.specialRules.push( rule );
      // }
      modelData.actions.push( modelAction );
    }

    // calculate the model's cost
    modelData = this.calculateModelCost( modelData );

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
  
  /**
   * This method should be called after logout
   */
  private logout() {
    this.modelCache = [];
    this.loggedInUserId = "";
  }

  /**
   * This method should be called after login
   */
  private login(userId: string) {
    this.loggedInUserId = userId;
  }  

  /**
   * This method should be called whenever a special rule is updated. It will
   * update the details of any models that use this rule
   */
  private ruleUpdated( updatedRule: SpecialRuleData) {

    // loop through all models
    for ( let model of this.modelCache ) {

      // update different properties based on the rule type
      switch ( updatedRule.ruleType ) {

        // update the model's special rules
        case "model":
          let cachedRule = model.specialRules.find( element => element._id == updatedRule._id );
          if ( cachedRule ) {
            Object.assign( cachedRule, updatedRule );
          }
          break;

        // loop through all actions and update them
        case "special":
        case "attack":
          for ( let action of model.actions ) {
            let cachedRule = action.specialRules.find( element => element._id == updatedRule._id );
            if ( cachedRule ) {
              Object.assign( cachedRule, updatedRule );
            }
          }
          break;
      }

      // recalculate the details of the model and inform people that it has changed
      model = this.calculateModelCost( model );
      this.modelUpdated.emit(model);
    }
  }
}

