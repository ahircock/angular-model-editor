import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable()
export class DataAccessService {

    private apiUrlModels = environment.apiUrl + "/models";
    private apiUrlRules  = environment.apiUrl + "/rules";
    private apiUrlForces = environment.apiUrl + "/forces";
    private apiUrlActions = environment.apiUrl + "/actions";
    private apiUrlGetNextId = environment.apiUrl + "/services/getnextid";
    private apiUrlLogin = environment.apiUrl + "/login";
    private apiUrlSignup = environment.apiUrl + "/signup";

    private sessionid: string = "";

    constructor(
        private httpClient: HttpClient
    ) {}

    async getRules(): Promise<RuleDBData[]>{
        return ( this.httpClient.get(this.apiUrlRules, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData[]>);
    }
    async createRule( newRule: RuleDBData ): Promise<RuleDBData> {
        return ( this.httpClient.post(this.apiUrlRules, newRule, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData>);
    }
    async updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
        let url = this.apiUrlRules + "/" + updateRule._id;
        return ( this.httpClient.put(url, updateRule, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData>);
    }
    async deleteRule( deleteRule: RuleDBData ): Promise<void> {
        let url = this.apiUrlRules + "/" + deleteRule._id;
        this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
    }

    async getModels(): Promise<ModelDBData[]> {
        return ( this.httpClient.get(this.apiUrlModels, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData[]>);
    }
    async createModel( newModel: ModelDBData ): Promise<ModelDBData> {
        return ( this.httpClient.post(this.apiUrlModels, newModel, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData>);
    }
    async updateModel( updateModel: ModelDBData ): Promise<ModelDBData> {
        let url = this.apiUrlModels + "/" + updateModel._id;
        return ( this.httpClient.put(url, updateModel, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData>);
    }
    async deleteModel( deleteModel: ModelDBData ): Promise<void> {
        let url = this.apiUrlModels + "/" + deleteModel._id;
        this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
    }

    async getForces(): Promise<ForceDBData[]> {
        return ( this.httpClient.get(this.apiUrlForces, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData[]>);
    }
    async createForce( newForce: ForceDBData ): Promise<ForceDBData> {
        return ( this.httpClient.post(this.apiUrlForces, newForce, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData>);
    }
    async updateForce( updateForce: ForceDBData ): Promise<ForceDBData> {
        let url = this.apiUrlForces + "/" + updateForce._id;
        return ( this.httpClient.put(url, updateForce, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData>);
    }
    async deleteForce( deleteForce: ForceDBData ): Promise<void> {
        let url = this.apiUrlForces + "/" + deleteForce._id;
        this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
    }

    async getActions(): Promise<ActionDBData[]> {
        return ( this.httpClient.get(this.apiUrlActions, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ActionDBData[]>);
    }
    async createAction( newAction: ActionDBData ): Promise<ActionDBData> {
        return ( this.httpClient.post(this.apiUrlActions, newAction, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ActionDBData>);
    }
    async updateAction( updateAction: ActionDBData ): Promise<ActionDBData> {
        let url = this.apiUrlActions + "/" + updateAction._id;
        return ( this.httpClient.put(url, updateAction, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ActionDBData>);
    }
    async deleteAction( deleteAction: ActionDBData ): Promise<void> {
        let url = this.apiUrlActions + "/" + deleteAction._id;
        this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
    }

    /**
     * Generate the next ID in the sequence
     * @param prefix this is an optional  prefix to add to the beginning of the ID. Defaulted to blank
     */
    async getNextId( prefix: string ): Promise<string> {
        let url = this.apiUrlGetNextId;
        let nextId = await this.httpClient.get(url, {headers: {"sessionid": this.sessionid}}).toPromise()
                .catch( (reason) => { throw reason });
        return prefix + nextId;
    }

    async login( email: string, password: string ): Promise<void> {
        let userInfo = { email: email, password: password };
        let authResult = await this.httpClient.post(this.apiUrlLogin, userInfo).toPromise()
            .catch( (reason) => { throw reason });
        this.sessionid = (authResult as AuthResult).sessionid;
    }

    async signup( email: string, password: string ): Promise<void> {
        let userInfo = { email: email, password: password };
        let authResult = await this.httpClient.post(this.apiUrlSignup, userInfo).toPromise()
            .catch( (reason) => { throw reason });
        this.sessionid = (authResult as AuthResult).sessionid;
    }

}

interface AuthResult {
    sessionid: string
}

// *** DB DATA STRUCTURES 

/**
 * List of possible rule types
 */
export const enum RuleType {
    Special = "special",
    Attack = "attack",
    Model = "model"
}
  
  /**
 * Structure of Rule data, as stored in the database
 */
export interface RuleDBData {
    _id: string;
    userId: string;
    type: RuleType;
    name: string;
    text: string;
    printVisible: boolean;
    cost?: number;
    modSPD?: number;
    modEV?: number;
    modARM?: number;
    modHP?: number;
    modStrDMG?: number;
    modMHIT?: number;
    modRHIT?: number
}

/**
 * Structure of Model data, as stored in the database
 */
export interface ModelDBData {
    _id: string;
    userId: string;
    template: boolean,
    name: string;
    traits: string;
    picture: string;
    SPD: number;
    EV: number;
    ARM: number;
    HP: number;
    specialRuleIds: string[];
    actions: ModelActionDBData[];
}
export interface ModelActionDBData {
    modelActionName: string;
    actionId: string;
}

/**
 * Structure of Force data, as stored in the database
 */
export interface ForceDBData {
    _id: string,
    userId: string,
    name: string,
    size: string,
    models: ForceModelDBData[]
} 
export interface ForceModelDBData {
    _id: string,
    count: number 
}

/**
 * List of possible action types
 */
export const enum ActionType {
    Special = "SPECIAL",
    Melee = "MELEE",
    Ranged = "RANGED"
}
  
/**
 * Structure of Action data, as stored in the database
 */
export interface ActionDBData {
    _id: string;
    userId: string;
    type: ActionType;
    name: string;
    traits: string;
    AP: number;
    RNG: number;
    HIT: number;
    DMG: number;
    strengthBased: boolean;
    ONCE: boolean;
    cost: number;
    specialRuleIds: string[];
}

/**
 * Structure of user & login data
 */
export interface UserDBData {
    userId: string
}

/**
 * Structure of error codes that are thrown by this method
 */
export interface DBErrorData {
    errorCode: number,
    errorMessage: string
}
  
