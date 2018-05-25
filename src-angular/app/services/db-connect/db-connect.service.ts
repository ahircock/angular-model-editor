import { Injectable } from '@angular/core';
import { DbConnector, RuleDBData, ModelDBData } from './db-connector.interface';
import { InternalDbConnector } from './internal-db-connector.class';

// re-export the db interfaces
export * from './db-connector.interface';


@Injectable()
export class DbConnectService implements DbConnector {

  private dbConnector: DbConnector;
  
  constructor() { 
    this.dbConnector = new InternalDbConnector();
  }

  getRules(): Promise<RuleDBData[]>{
    return this.dbConnector.getRules();
  }
  createRule( newRule: RuleDBData ): Promise<RuleDBData> {
    return this.dbConnector.createRule( newRule );
  }
  updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
    return this.dbConnector.updateRule(updateRule);
  }
  deleteRule( deleteRule: RuleDBData ): Promise<void> {
    return this.dbConnector.deleteRule(deleteRule);
  }

  getModels(): Promise<ModelDBData[]> {
    return this.dbConnector.getModels();
  }
  createModel( newModel: ModelDBData ): Promise<ModelDBData> {
    return this.dbConnector.createModel( newModel );
  }
  updateModel( updateModel: ModelDBData ): Promise<ModelDBData> {
    return this.dbConnector.updateModel( updateModel );
  }
  deleteModel( deleteModel: ModelDBData ): Promise<void> {
    return this.dbConnector.deleteModel( deleteModel );
  }


  getNextId( prefix: string ): Promise<string> {
    return this.dbConnector.getNextId(prefix);
  }

}
