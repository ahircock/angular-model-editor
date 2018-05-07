import { Injectable } from '@angular/core';

export interface ForceData {
  _id: string,
  name: string,
  sizeName: string,
  maxCost: number,
  cost: number,
  models: ForceModelData[],
  equipment: ForceEquipmentData[]
}
export interface ForceModelData {
  _id: string,
  count: number
}
export interface ForceEquipmentData {
  _id: string,
  count: number  
}

@Injectable()
export class ForceDataService {

  private forceDB: ForceData[] = [
    { _id:"F0001", name:"Templar Attack!", sizeName:"standard", maxCost: 200, cost:123, models:[{_id:"M0011",count:1},{_id:"M0003",count:2},{_id:"M0002",count:3}], equipment:[] },
    { _id:"F0001", name:"Khorne Bloodbound", sizeName:"standard", maxCost: 200, cost:340, models:[{_id:"M0008",count:1},{_id:"M0007",count:3},{_id:"M0005",count:6}], equipment:[] },    
  ];

  constructor() { }

  async getAllForces() {
    // make a deep copy of the model list and then return it
    let returnList: ForceData[] = JSON.parse(JSON.stringify(this.forceDB));
    return returnList;
  }

  async getForceById( id: string ) {
    // find the model in the arrach (using the "find" function), and then return a deep copy of that model
    let findForce: ForceData = this.forceDB.find( element => { return element._id == id;} );
    let returnForce: ForceData = JSON.parse( JSON.stringify( findForce) );
    return returnForce;
  }

  async getForceListById( idList: string[] ) {

    let returnList: ForceData[] = [];
    for ( let id of idList ) {
      returnList.push( await this.getForceById(id) );
    }
    return returnList;
  }
  
}
