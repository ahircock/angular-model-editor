import { ModelService } from './services/model-service';
import { MongoDbService } from './services/mongo-db-service';

const SERVICES = [
  { name: "ModelService", class: ModelService },
  { name: "MongoDbService", class: MongoDbService }
]

export class ServiceManager {

  static serviceList: any[] = [];

  static init() {

    // if already initialized, then do nothing
    if ( this.serviceList.length > 0 ) {
      return;
    }

    // create an instance of every service class
    for ( let serviceEntry of SERVICES ) {
      let newService = { name: serviceEntry.name, singleton: new serviceEntry.class() };
      this.serviceList.push(newService);
    }

    // run the initService() method on each of the services
    for ( let serviceEntry of this.serviceList ) {
      if ( typeof serviceEntry.singleton.initService != "undefined" ) {
        serviceEntry.singleton.initService();
      }
    }
  }

  static getService(name:string): any {

    // make sure that the services have all been started
    if ( this.serviceList.length == 0 ) {
      this.init();
    }

    return this.serviceList.find( element => element.name == name ).singleton;
  }
}