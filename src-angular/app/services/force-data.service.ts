import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';
import { ModelData, ModelDataService } from './model-data.service';
import { UserService } from './user.service';

/**
 * Interface that defines the data-structure of a force. Can be loaded using the methods of the ForceDataService
 */
export interface ForceData {
  _id: string;
  name: string;
  size: string;
  maxCost: number;
  stdMissionCost: number;
  cost: number;
  modelCost: number;
  equipmentCost: number;
  models: ForceModelData[];
  editable: boolean;
}
export interface ForceModelData extends ModelData {
  count: number;
  forceModelName: string;
}

/**
 * Structure of Force data, as stored in the database
 */
interface ForceDBData {
  _id: string;
  userId: string;
  name: string;
  size: string;
  models: ForceModelDBData[];
}
interface ForceModelDBData {
  _id: string;
  count: number;
  forceModelName: string;
}


/**
 * Used to store the table of size to cost conversions
 */
interface ForceSize {
  size: string;
  maxCost: number;
  stdMissionCost: number;
}

@Injectable()
export class ForceDataService {

  /**
   * Cache of the forces, loaded from DB
   */
  private forceCache: ForceData[] = [];

  private loggedInUserId: string;

  /**
   * This is the hardcoded list of force sizes, their names and point costs
   */
  public FORCE_SIZES: ForceSize[] = [
    {size: 'small', maxCost: 100, stdMissionCost: 100},
    {size: 'standard', maxCost: 150, stdMissionCost: 150},
    {size: 'epic', maxCost: 250, stdMissionCost: 250}
  ];

  constructor(
    private modelDataService: ModelDataService,
    private dbConnectService: DataAccessService,
    private userService: UserService
  ) {

    // initialize the user id
    this.loggedInUserId = this.userService.userName;

    // subscribe to events from the other services
    this.userService.loginEvent.subscribe( (email: any) => this.login(email) );
    this.userService.logoutEvent.subscribe( () => this.logout() );
  }

  /**
   * Returns the list of all forces in the database
   */
  async getAllForces(): Promise<ForceData[]> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.forceCache.length === 0 ) {
      await this.loadCache();
    }

    // sort the list of models in the cache
    this.forceCache.sort(this.sortForceData);

    // return all models in the cache
    return this.forceCache;
  }

  /**
   * Returns the details of a single force
   * @param id the id of the force to return
   */
  async getForceById( id: string ): Promise<ForceData> {

    // if the cache has not been loaded yet, then refresh it from the DB
    if ( this.forceCache.length === 0 ) {
      await this.loadCache();
    }

    // return the entry with the matching ID
    return this.forceCache.find( element => element._id === id );
  }

  /**
   * Returns an array of forces, based on the given array of _id values. The return array will
   * be in the same order as the provided idList array
   * @param idList array of _id values to return
   */
  async getForceListById( idList: string[] ): Promise<ForceData[]> {

    const returnList: ForceData[] = [];
    for ( const id of idList ) {
      returnList.push( await this.getForceById(id) );
    }
    return returnList;
  }

  /**
   * Create a new force, initializing the attributes to some defaults
   */
  async createForce(): Promise<ForceData> {

    // generate a new ID for the new force
    const newForceId = await this.dbConnectService.getNextId('F');

    // create a new force DB Object
    let newForceDB: ForceDBData = {
      _id: newForceId,
      userId: this.loggedInUserId.toLowerCase(),
      name: 'New Force',
      size: 'standard',
      models: []
    };

    // create the model in the database
    newForceDB = await this.dbConnectService.createForce( newForceDB );

    // add this new model to the cache
    const newForce = await this.convertDBToForceData( newForceDB );
    this.forceCache.push(newForce);

    // return the new model
    return newForce;
  }

  /**
   * Update the existing record in the database to the value that is being
   * provided. Some values on the force may be altered as a result of this update. Will not update
   * any attributes of the force's model objects. Returns the updated object
   * @param updateForce The udpated force object that will be saved to the DB. This value may be modified as a result of this update
   */
  async updateForce( updateForce: ForceData ): Promise<ForceData> {

    // update the database
    const updateDBForce = await this.dbConnectService.updateForce( this.convertForceDataToDB(updateForce) );

    // find the force record in the fake DB, and then replace it with the updated force
    const newUpdatedForce = await this.convertDBToForceData( updateDBForce );
    const forceIndex: number = this.forceCache.findIndex( element => element._id === newUpdatedForce._id );
    this.forceCache[forceIndex] = newUpdatedForce;

    // return a deep copy of the model from the DB
    return newUpdatedForce;
  }

  /**
   * Delete the given force from the database. Does not return anything
   * @param deleteForce The force to be delete
   */
  async deleteForce( deleteForce: ForceData ): Promise<void> {

    // delete the matching force from the DB
    await this.dbConnectService.deleteForce( this.convertForceDataToDB(deleteForce) );
    const forceIndex: number = this.forceCache.findIndex( element => element._id === deleteForce._id );
    this.forceCache.splice( forceIndex, 1 );
  }

  /**
   * This method will convert a ForceDBData record (which is used internally) into a ForceData record (which
   * is used externally). Returns the converted object
   *
   * @param forceDBData The source record
   */
  private async convertDBToForceData( forceDBData: ForceDBData ): Promise<ForceData> {

    // look up the force size from the DB
    const forceSize: ForceSize = this.FORCE_SIZES.find( element => element.size === forceDBData.size );

    // create the new object
    const forceData: ForceData = {
      _id: forceDBData._id,
      name: forceDBData.name,
      size: forceDBData.size,
      maxCost: forceSize.maxCost,
      stdMissionCost: forceSize.stdMissionCost,
      cost: 0, // will be calculated below
      modelCost: 0,
      equipmentCost: 0,
      models: [],
      editable: forceDBData.userId.toLowerCase() === this.loggedInUserId.toLowerCase() ? true : false
    };

    // retrieve the model information from its service
    const modelIdList: string[] = [];
    for ( const forceModelData of forceDBData.models ) {
      modelIdList.push( forceModelData._id );
    }
    const modelDataList: ModelData[] = await this.modelDataService.getModelListById( modelIdList );

    // create an array of ForceModelData objects, and copy contents from ModelData and ForceDBData
    for ( let i = 0; i < forceDBData.models.length; i++ ) {
      const forceModelData: ForceModelData = Object.assign( {}, modelDataList[i], forceDBData.models[i] );
      forceData.models.push(forceModelData);
    }

    // calculate the force cost
    forceData.cost = this.calculateForceCost( forceData );

    // return the prepared force info
    return forceData;
  }

  /**
   * This method will convert a ForceData record (which is used externally) into a ForceData record (which is used
   * internally), ready to be inserted into the database. Returns the converted object
   *
   * @param forceData the source record
   */
  private convertForceDataToDB( forceData: ForceData ): ForceDBData {

    // create the list of models
    const modelList: ForceModelDBData[] = [];
    for ( const model of forceData.models ) {
      const newModelDBData: ForceModelDBData = {
        _id: model._id,
        count: model.count,
        forceModelName: model.forceModelName
      };
      modelList.push( newModelDBData );
    }

    const forceDBData: ForceDBData = {
      _id: forceData._id,
      userId: this.loggedInUserId.toLowerCase(),
      name: forceData.name,
      size: forceData.size,
      models: modelList
    };

    // update the cost
    return forceDBData;
  }

  /**
   * This method will calculate the cost of a force based on the models, equipment and other
   * settings. It will then update the provided force object. Returns the updated force
   * @param forceData The force whose cost needs to be calculated. This object will be updated
   */
  private calculateForceCost( forceData: ForceData ): number {

    // get the total cost of models
    let totalCost = 0;
    for ( const model of forceData.models ) {
      totalCost += model.cost * model.count;
    }

    // return the updated forceData
    return totalCost;
  }

  /**
   * The method used by Javascript to sort force datas
   * @param a first force
   * @param b second force
   */
  private sortForceData( a: ForceData, b: ForceData ): number {
    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  }

/**
   * method that loads all records from the database and stores them in the local cache
   */
  private async loadCache() {

    // clear out the rule cache
    this.forceCache = [];

    // load the rule objects form the DB
    const forceDBList: ForceDBData[] = await this.dbConnectService.getForces();

    // convert everything to a ForceData and add it to the cache
    for ( const forceDB of forceDBList ) {
      this.forceCache.push( await this.convertDBToForceData(forceDB) );
    }
  }

  /**
   * This method should be called after logout
   */
  public logout() {
    this.forceCache = [];
    this.loggedInUserId = '';
  }

  /**
   * This method should be called after login
   */
  public login(userId: string) {
    this.loggedInUserId = userId;
  }
}
