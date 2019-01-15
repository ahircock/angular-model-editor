import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DataAccessService {

    private apiUrlModels = environment.apiUrl + '/models';
    private apiUrlRules  = environment.apiUrl + '/rules';
    private apiUrlForces = environment.apiUrl + '/forces';
    private apiUrlActions = environment.apiUrl + '/actions';
    private apiUrlGetNextId = environment.apiUrl + '/services/getnextid';
    private apiUrlLogin = environment.apiUrl + '/login';
    private apiUrlSignup = environment.apiUrl + '/signup';

    private sessionid = '';

    constructor(
        private httpClient: HttpClient
    ) {}

    async getRules(): Promise<any[]> {
        return ( this.httpClient.get(
                this.apiUrlRules,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any[]>);
    }

    async getActions(): Promise<any[]> {
        return ( this.httpClient.get(
                this.apiUrlActions,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any[]>);
    }

    async getModels(): Promise<any[]> {
        return ( this.httpClient.get(
                this.apiUrlModels,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any[]>);
    }

    async getForces(): Promise<any[]> {
        return ( this.httpClient.get(
                this.apiUrlForces,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any[]>);
    }
    async createForce( newForce: any ): Promise<any> {
        return ( this.httpClient.post(
                this.apiUrlForces,
                newForce,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any>);
    }
    async updateForce( updateForce: any ): Promise<any> {
        const url = this.apiUrlForces + '/' + updateForce._id;
        return ( this.httpClient.put(
                url,
                updateForce,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise() as Promise<any>);
    }
    async deleteForce( deleteForce: any ): Promise<void> {
        const url = this.apiUrlForces + '/' + deleteForce._id;
        this.httpClient.delete(
                url,
                {headers: {'sessionid': this.sessionid}}
            ).toPromise();
    }

    /**
     * Generate the next ID in the sequence
     * @param prefix this is an optional  prefix to add to the beginning of the ID. Defaulted to blank
     */
    async getNextId( prefix: string ): Promise<string> {
        const url = this.apiUrlGetNextId;
        const nextId = await this.httpClient.get(url, {headers: {'sessionid': this.sessionid}}).toPromise()
                .catch( (reason) => { throw reason; });
        return prefix + nextId;
    }

    async login( email: string, password: string ): Promise<void> {
        const userInfo = { email: email, password: password };
        const authResult = await this.httpClient.post(this.apiUrlLogin, userInfo).toPromise()
            .catch( (reason) => { throw reason; });
        this.sessionid = (authResult as AuthResult).sessionid;
    }

    async signup( email: string, password: string ): Promise<void> {
        const userInfo = { email: email, password: password };
        const authResult = await this.httpClient.post(this.apiUrlSignup, userInfo).toPromise()
            .catch( (reason) => { throw reason; });
        this.sessionid = (authResult as AuthResult).sessionid;
    }

}

interface AuthResult {
    sessionid: string;
}

/**
 * Structure of user & login data
 */
export interface UserDBData {
    userId: string;
}

/**
 * Structure of error codes that are thrown by this method
 */
export interface DBErrorData {
    errorCode: number;
    errorMessage: string;
}

