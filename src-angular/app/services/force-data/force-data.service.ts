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

interface ForceSize {
  size: string,
  maxCost: number,
  stdMissionCost: number
}

@Injectable()
export class ForceDataService {

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
    // make a deep copy of the model list and then return it
    let returnList: ForceData[] = Object.assign({}, this.forceDB);
    return returnList;
  }

  async getForceById( id: string ): Promise<ForceData> {
    // find the model in the arrach (using the "find" function), and then return a deep copy of that model
    let findForce: ForceDBData = this.forceDB.find( element => { return element._id == id;} );
    let returnForce: ForceData = Object.assign({}, findForce);
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
    
    // get the ID of the next force
    let newForceId = "F" + this.nextForceIdDB;
    this.nextForceIdDB++;

    // create a new force entry
    let newForce: ForceDBData = { _id:"NEW", name:"New Force", sizeName:"standard", maxCost:200, cost:0, models:[], equipment:[] };

    newForce._id = newForceId;
    this.forceDB.push(newForce);

    // return a deep copy of the database force
    let returnForce = Object.assign({}, newForce );
    return returnForce;
  }

  async updateForce( updateForce: ForceData ): Promise<ForceData> {

    // find the force in the fake DB, and then update it
    let findForce: ForceDBData = this.forceDB.find( element => { return element._id == updateForce._id;} );
    findForce = updateForce;

    // return a deep copy of the model from the DB
    let returnForce: ForceData = Object.assign({}, findForce);
    return returnForce;
  }

  /**
   * This method will convert a ForceDBData record (which is used internally) into a ForceData record (which 
   * is used externally). Returns the converted object
   * 
   * @param forceDBData The source record
   */
  private async convertDBToForceData( forceDBData: ForceDBData ): Promise<ForceData> {

    // look up the force size from the DB
    let forceSize: ForceSize = this.FORCE_SIZES.find( element => { return element.size == forceDBData.size;} )

    // load up the list of models
    let modelIdList: string[] = [];
    for ( let forceModelData of forceDBData.models ) {
      modelIdList.push( forceModelData._id );
    }
    let modelDataList: ModelData[] = await this.modelDataService.getModelListById( modelIdList );

    // create an array of ForceModelData objects, and copy contents from ModelData and ForceDBData
    let modelList: ForceModelData[] = []
    for ( let i=0; i<forceDBData.models.length; i++ ) {
      let forceModelData: ForceModelData = Object.assign( {}, modelDataList[i], forceDBData.models[i] );
      modelList.push(forceModelData);
    }

    let forceData: ForceData = {
      _id: forceDBData._id,
      name: forceDBData.name,
      size: forceDBData.size,
      maxCost: forceSize.maxCost,
      stdMissionCost: forceSize.stdMissionCost,
      cost: 0,
      models: modelList,
      equipment: []
        };

    // update the force cost
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
    let forceDBData: ForceDBData;
    return forceDBData;
  }

  /**
   * This method will calculate the cost of a force based on the models, equipment and other 
   * settings. Returns the updated force
   * @param forceData The force whose cost needs to be calculated. This object will be updated
   */
  private updateForceCost( forceData: ForceData ): ForceData {
    forceData.cost = 100;
    return forceData;
  }


  
}
