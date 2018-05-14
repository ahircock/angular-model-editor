import { Injectable } from '@angular/core';
import { ModelData, ModelDataService } from '../model-data/model-data.service';

/**
 * Interface that defines the data-structure of a force. Can be loaded using the methods of the ForceDataService
 */
export interface ForceData {
  _id: string,
  name: string,
  size: string,
  maxCost: number,
  stdMissionCost: number,
  cost: number,
  models: ForceModelData[],
  equipment: ForceEquipmentData[]
}
export interface ForceModelData extends ModelData {
  count: number
}
export interface ForceEquipmentData {
  _id: string,
  count: number  
}

/**
 * private interface used to define the structure of the force-information that will be saved to the DB/server
 */
interface ForceDBData {
  _id: string,
  name: string,
  size: string,
  models: ForceModelDBData[]
}

/**
 * private interface used to define the structure of the force-model information, that will be saved to the DB/server
 */
interface ForceModelDBData {
  _id: string,
  count: number 
}

/**
 * Used to store the table of size to cost conversions
 */
interface ForceSize {
  size: string,
  maxCost: number,
  stdMissionCost: number
}

@Injectable()
export class ForceDataService {

  /**
   * Fake DB used 
   */
  private forceDB: ForceDBData[] = [
    { _id:"F0001", name:"Templar Attack!", size:"standard", models:[{_id:"M0011",count:1},{_id:"M0003",count:2},{_id:"M0002",count:3}] },
    { _id:"F0002", name:"Khorne Bloodbound", size:"standard", models:[{_id:"M0008",count:1},{_id:"M0007",count:3},{_id:"M0005",count:6}] }
  ];
  private nextForceIdDB: number = 3;


  /**
   * This is the hardcoded list of force sizes, their names and point costs
   */
  public FORCE_SIZES:ForceSize[] = [ 
    {size:"quick", maxCost:150, stdMissionCost:100},
    {size:"standard", maxCost:250, stdMissionCost:150},
    {size:"epic", maxCost:350, stdMissionCost:250} 
  ];

  constructor(
    private modelDataService: ModelDataService
  ) { }

  async getAllForces(): Promise<ForceData[]> {
    
    // convert every entry in the ForceDB into a ForceData object
    let returnList: ForceData[] = [];
    for ( let forceDBData of this.forceDB ) {
      returnList.push( await this.convertDBToForceData(forceDBData) );
    }
    return returnList;
  }

  async getForceById( id: string ): Promise<ForceData> {
    
    let findForce: ForceDBData = this.forceDB.find( element => element._id == id );
    let returnForce: ForceData = await this.convertDBToForceData( findForce );
    return returnForce;
  }

  async getForceListById( idList: string[] ): Promise<ForceData[]> {

    let returnList: ForceData[] = [];
    for ( let id of idList ) {
      returnList.push( await this.getForceById(id) );
    }
    return returnList;
  }

  async addNewForce(): Promise<ForceData> {
    
    // generate a new ID for the new force
    let newForceId = "F" + this.nextForceIdDB.toString().padStart(4,"0");
    this.nextForceIdDB++;

    // create a new force entry and add it to the database
    let newForce: ForceDBData = { _id: newForceId, name:"New Force", size:"standard", models:[] };
    this.forceDB.push(newForce);

    // return the new force
    return this.convertDBToForceData( newForce );
  }

  /**
   * Creates a new model object in the DB and updates the force in the DB to include this new 
   * model. The provided force will be updated. Returns the updated force
   * @param force The force that the new model will be added to
   */
  async addNewModelToForce( force: ForceData ): Promise<ForceData> {

    // create a new model in the DB
    let newModelData: ModelData = await this.modelDataService.addNewModel();

    // add the new model to the force
    let newForceModelData: ForceModelData = Object.assign( {}, {count:1}, newModelData );
    force.models.push ( newForceModelData );
    
    // update the force in the DB
    force = await this.updateForce( force );
    return force;

  }

  /**
   * Update the existing record in the database to the value that is being 
   * provided. Some values on the force may be altered as a result of this update. Will not update 
   * any attributes of the force's model objects. Returns the updated object
   * @param updateForce The udpated force object that will be saved to the DB. This value may be modified as a result of this update
   */
  async updateForce( updateForce: ForceData ): Promise<ForceData> {

    // make sure that the cost of the updated force is correct
    updateForce = this.updateForceCost( updateForce );
    
    // find the force record in the fake DB, and then replace it with the updated force
    let forceIndex: number = this.forceDB.findIndex( element => element._id == updateForce._id );
    this.forceDB[forceIndex] = this.convertForceDataToDB(updateForce);

    // return a deep copy of the model from the DB
    return updateForce;
  }

  /**
   * This method will convert a ForceDBData record (which is used internally) into a ForceData record (which 
   * is used externally). Returns the converted object
   * 
   * @param forceDBData The source record
   */
  private async convertDBToForceData( forceDBData: ForceDBData ): Promise<ForceData> {

    // look up the force size from the DB
    let forceSize: ForceSize = this.FORCE_SIZES.find( element => element.size == forceDBData.size )

    // create the new object
    let forceData: ForceData = {
      _id: forceDBData._id,
      name: forceDBData.name,
      size: forceDBData.size,
      maxCost: forceSize.maxCost,
      stdMissionCost: forceSize.stdMissionCost,
      cost: 0, // will be calculated below
      models: [],
      equipment: []
    };

    // retrieve the model information from its service
    let modelIdList: string[] = [];
    for ( let forceModelData of forceDBData.models ) {
      modelIdList.push( forceModelData._id );
    }
    let modelDataList: ModelData[] = await this.modelDataService.getModelListById( modelIdList );

    // create an array of ForceModelData objects, and copy contents from ModelData and ForceDBData
    for ( let i=0; i<forceDBData.models.length; i++ ) {
      let forceModelData: ForceModelData = Object.assign( {}, modelDataList[i], forceDBData.models[i] );
      forceData.models.push(forceModelData);
    }

    // calculate the force cost
    forceData = this.updateForceCost( forceData );

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
    let modelList: ForceModelDBData[] = [];
    for ( let model of forceData.models ) {
      let newModelDBData: ForceModelDBData = {
        _id: model._id,
        count: model.count 
      }
      modelList.push( newModelDBData );
    }

    let forceDBData: ForceDBData = {
      _id: forceData._id,
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
  private updateForceCost( forceData: ForceData ): ForceData {
    
    // get the total cost of models
    forceData.cost = 0;
    for ( let model of forceData.models ) {
      forceData.cost += model.cost * model.count;
    }

    // return the updated forceData
    return forceData;
  }
 
}
