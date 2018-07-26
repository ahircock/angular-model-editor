import { DbConnectService, RuleDBData, ModelDBData, ForceDBData, ActionDBData } from './db-connector.interface';

export class InternalDbConnector extends DbConnectService {

  // this array will simulate the data that comes back from a database
  private ruleDB: RuleDBData[] = [];

  private modelDB: ModelDBData[] = [];

  private forceDB: ForceDBData[] = [];

  private actionDB: ActionDBData[] = [];

  private nextId: number = 100;


    constructor() { super() }

    async getRules(): Promise<RuleDBData[]>{
        return JSON.parse(JSON.stringify(this.ruleDB));
    }
    async createRule( newRule: RuleDBData ): Promise<RuleDBData> {
        this.ruleDB.push( JSON.parse(JSON.stringify(newRule)) );
        return JSON.parse(JSON.stringify(newRule));
    }
    async updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
        let findRuleIndex: number = this.ruleDB.findIndex( element => element._id == updateRule._id );
        this.ruleDB[findRuleIndex] = JSON.parse(JSON.stringify(updateRule));
        return JSON.parse(JSON.stringify(updateRule));
    }
    async deleteRule( deleteRule: RuleDBData ): Promise<void> {
        let findRuleIndex: number = this.ruleDB.findIndex( element => element._id == deleteRule._id );
        this.ruleDB.splice(findRuleIndex, 1 );
        return;
    }

    async getModels(): Promise<ModelDBData[]> {
        return JSON.parse(JSON.stringify(this.modelDB));
    }
    async createModel( newModel: ModelDBData ): Promise<ModelDBData> {
        this.modelDB.push( JSON.parse(JSON.stringify(newModel)) );
        return JSON.parse(JSON.stringify(newModel));
    }
    updateModel( updateModel: ModelDBData ): Promise<ModelDBData> {
        let findRuleIndex: number = this.modelDB.findIndex( element => element._id == updateModel._id );
        this.modelDB[findRuleIndex] = JSON.parse(JSON.stringify(updateModel));
        return JSON.parse(JSON.stringify(updateModel));
    }
    deleteModel( deleteModel: ModelDBData ): Promise<void> {
        let findRuleIndex: number = this.modelDB.findIndex( element => element._id == deleteModel._id );
        this.modelDB.splice(findRuleIndex, 1 );
        return;
    }

    async getForces(): Promise<ForceDBData[]> {
        return JSON.parse(JSON.stringify(this.forceDB));
    }
    async createForce( newForce: ForceDBData ): Promise<ForceDBData> {
        this.forceDB.push( JSON.parse(JSON.stringify(newForce)) );
        return JSON.parse(JSON.stringify(newForce));
    }
    updateForce( updateForce: ForceDBData ): Promise<ForceDBData> {
        let findRuleIndex: number = this.forceDB.findIndex( element => element._id == updateForce._id );
        this.forceDB[findRuleIndex] = JSON.parse(JSON.stringify(updateForce));
        return JSON.parse(JSON.stringify(updateForce));
    }
    deleteForce( deleteForce: ForceDBData ): Promise<void> {
        let findRuleIndex: number = this.forceDB.findIndex( element => element._id == deleteForce._id );
        this.forceDB.splice(findRuleIndex, 1 );
        return;
    }
       
    async getActions(): Promise<ActionDBData[]> {
        return JSON.parse(JSON.stringify(this.actionDB));
    }
    async createAction( newAction: ActionDBData ): Promise<ActionDBData> {
        this.actionDB.push( JSON.parse(JSON.stringify(newAction)) );
        return JSON.parse(JSON.stringify(newAction));
    }
    updateAction( updateAction: ActionDBData ): Promise<ActionDBData> {
        let findRuleIndex: number = this.actionDB.findIndex( element => element._id == updateAction._id );
        this.actionDB[findRuleIndex] = JSON.parse(JSON.stringify(updateAction));
        return JSON.parse(JSON.stringify(updateAction));
    }
    deleteAction( deleteAction: ActionDBData ): Promise<void> {
        let findRuleIndex: number = this.actionDB.findIndex( element => element._id == deleteAction._id );
        this.actionDB.splice(findRuleIndex, 1 );
        return;
    }

    /**
     * Generate the next ID in the sequence
     * @param prefix this is an optional  prefix to add to the beginning of the ID. Defaulted to blank
     */
    async getNextId( prefix: string ): Promise<string> {
        return prefix + this.nextId++;
    }

    async login( email: string, password: string ): Promise<void> {};
    async signup( email: string, password: string ): Promise<void> {};
        
}