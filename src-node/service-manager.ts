import { ModelService } from './services/model-service';
import { MongoDbService } from './services/mongo-db-service';

/**
 * The array of services that can be accessed. Provide a "name" for the service,
 * and the class of the service. The class can be anything. No restrictions.
 */
const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  { name: "ModelService", class: ModelService },
  { name: "MongoDbService", class: MongoDbService }
]

/**
 * This class is meant to allow you to manage an array of singleton "services".
 * 
 * To use the ServiceManager, fill in the SERVICE_DEFINITIONS array above. Provide each service
 * a descriptive name, and the class that is used for that service. The class does not need 
 * anything special and any class can be used. In order to access a service, simply use the
 * ServiceManager.getService(name) method. Provide the descriptive name of the service you 
 * would like to access.
 * 
 * Since you access services by name, this also allows you to handle dependency injection.
 * If you would like to use a different class for the service, simply change the class: 
 * property.
 */
export class ServiceManager {
  
  static serviceList: ServiceRegistry[] = [];

  /**
   * Returns the named service. This service is a singleton.
   * @param name the name of the service you would like to get
   */
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

/**
 * The interface used for the SERVICE_DEFINITIONS array
 */
interface ServiceDefinition {
  name: string,
  class: any
}

/**
 * The interface used for the array of instantiated services
 */
interface ServiceRegistry {
  name: string,
  singleton: any
}
