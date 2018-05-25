import { Injectable } from '@angular/core';
import { DbConnector, RuleDBData, ModelDBData, ForceDBData } from './db-connector.interface';
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

  getForces(): Promise<ForceDBData[]> {
    return this.dbConnector.getForces();
  }
  createForce( newForce: ForceDBData ): Promise<ForceDBData> {
    return this.dbConnector.createForce( newForce );
  }
  updateForce( updateForce: ForceDBData ): Promise<ForceDBData> {
    return this.dbConnector.updateForce( updateForce );
  }
  deleteForce( deleteForce: ForceDBData ): Promise<void> {
    return this.dbConnector.deleteForce( deleteForce );
  }

  getNextId( prefix: string ): Promise<string> {
    return this.dbConnector.getNextId(prefix);
  }

}
