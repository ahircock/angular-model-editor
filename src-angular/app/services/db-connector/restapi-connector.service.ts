import { Injectable } from '@angular/core'
import { DbConnectService, RuleDBData, ModelDBData, ForceDBData } from './db-connector.interface';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable()
export class RestAPIConnector extends DbConnectService {

    private apiUrlModels = environment.apiUrl + "/models";
    private apiUrlRules  = environment.apiUrl + "/rules";
    private apiUrlForces = environment.apiUrl + "/forces";
    private apiUrlGetNextId = environment.apiUrl + "/services/getnextid";
    private apiUrlLogin = environment.apiUrl + "/login";
    private apiUrlSignup = environment.apiUrl + "/signup";

    private sessionid: string = "";

    constructor(
        private httpClient: HttpClient
    ) { super() }

    async getRules(): Promise<RuleDBData[]>{
        try {
            return ( this.httpClient.get(this.apiUrlRules, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async createRule( newRule: RuleDBData ): Promise<RuleDBData> {
        try {
            return ( this.httpClient.post(this.apiUrlRules, newRule, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
        try {
            let url = this.apiUrlRules + "/" + updateRule._id;
            return ( this.httpClient.put(url, updateRule, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<RuleDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async deleteRule( deleteRule: RuleDBData ): Promise<void> {
        try {
            let url = this.apiUrlRules + "/" + deleteRule._id;
            this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
        } catch (err) {
            console.log(err.toString());
        }
    }

    async getModels(): Promise<ModelDBData[]> {
        try {
            return ( this.httpClient.get(this.apiUrlModels, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async createModel( newModel: ModelDBData ): Promise<ModelDBData> {
        try {
            return ( this.httpClient.post(this.apiUrlModels, newModel, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async updateModel( updateModel: ModelDBData ): Promise<ModelDBData> {
        try {
            let url = this.apiUrlModels + "/" + updateModel._id;
            return ( this.httpClient.put(url, updateModel, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ModelDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async deleteModel( deleteModel: ModelDBData ): Promise<void> {
        try {
            let url = this.apiUrlModels + "/" + deleteModel._id;
            this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
        } catch (err) {
            console.log(err.toString());
        }
    }

    async getForces(): Promise<ForceDBData[]> {
        try {
            return ( this.httpClient.get(this.apiUrlForces, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async createForce( newForce: ForceDBData ): Promise<ForceDBData> {
        try {
            return ( this.httpClient.post(this.apiUrlForces, newForce, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async updateForce( updateForce: ForceDBData ): Promise<ForceDBData> {
        try {
            let url = this.apiUrlForces + "/" + updateForce._id;
            return ( this.httpClient.put(url, updateForce, {headers: {"sessionid": this.sessionid}}).toPromise() as Promise<ForceDBData>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async deleteForce( deleteForce: ForceDBData ): Promise<void> {
        try {
            let url = this.apiUrlForces + "/" + deleteForce._id;
            this.httpClient.delete(url, {headers: {"sessionid": this.sessionid}}).toPromise();
        } catch (err) {
            console.log(err.toString());
        }
    }

    /**
     * Generate the next ID in the sequence
     * @param prefix this is an optional  prefix to add to the beginning of the ID. Defaulted to blank
     */
    async getNextId( prefix: string ): Promise<string> {
        try {
            let url = this.apiUrlGetNextId;
            let nextId = await this.httpClient.get(url, {headers: {"sessionid": this.sessionid}}).toPromise();
            return prefix + nextId;
        } catch (err) {
            console.log(err.toString());
        }
    }

    async login( email: string, password: string ): Promise<void> {
        try {
            let userInfo = { email: email, password: password };
            let authResult = await ( this.httpClient.post(this.apiUrlLogin, userInfo).toPromise() as Promise<AuthResult>);
            this.sessionid = authResult.sessionid;
        } catch (err) {
            throw(err.error);
        }
    }

    async signup( email: string, password: string ): Promise<void> {
        try {
            let userInfo = { email: email, password: password };
            let authResult = await ( this.httpClient.post(this.apiUrlSignup, userInfo).toPromise() as Promise<AuthResult>);
            this.sessionid = authResult.sessionid;
        } catch (err) {
            throw(err.error);
        }
    }

}

interface AuthResult {
    sessionid: string
}