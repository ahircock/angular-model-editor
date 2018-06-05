import { ModelService } from './services/model-service';
import { MongoDbService } from './services/mongo-db-service';

const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  { name: "ModelService", class: ModelService },
  { name: "MongoDbService", class: MongoDbService }
]

export class ServiceManager {
  
  static serviceList: ServiceRegistry[] = [];

  public static getService(name:string): any {

    // see if this service has already been initialized
    let foundService = this.serviceList.find( element => element.name == name );
    if ( foundService ) {
      return foundService.singleton;
    }

    // if this service hasn't been initialized yet, then initialize it
    let foundServiceDefn = SERVICE_DEFINITIONS.find( element => element.name == name );
    if ( foundServiceDefn ) {
      let newService = { name: foundServiceDefn.name, singleton: new foundServiceDefn.class() };
      this.serviceList.push(newService);
      return newService.singleton;
    }
  }
}

interface ServiceDefinition {
  name: string,
  class: any
}

interface ServiceRegistry {
  name: string,
  singleton: any
}
