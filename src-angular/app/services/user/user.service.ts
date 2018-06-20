import { Injectable } from '@angular/core';
import { DbConnectService } from '../db-connector/db-connector.interface'
import { ForceDataService } from '../force-data/force-data.service'
import { ModelDataService } from '../model-data/model-data.service'
import { SpecialRuleDataService } from '../special-rule-data/special-rule-data.service'

@Injectable()
export class UserService {

  public userName:string = "";
  public loginError: string = "";

  constructor(
    private dbConnectService: DbConnectService,
    private forceDataService: ForceDataService,
    private modelDataService: ModelDataService,
    private specialRuleDataService: SpecialRuleDataService
  ) { }

  async login( email: string, password: string ): Promise<void> {
    await this.dbConnectService.login(email, password )
        .catch((reason)=> { throw reason });
    
    // store the name of the user
    this.userName = email;
  }

  async signup( email: string, password: string ): Promise<void> {
    await this.dbConnectService.signup(email, password )
        .catch((reason)=> { throw reason });
    this.userName = email;
  }

  async logout() {
    this.userName = "";

    // clear all of the data caches
    this.forceDataService.clearCache();
    this.modelDataService.clearCache();
    this.specialRuleDataService.clearCache();
  }

  public isLoggedIn(): boolean {
    if ( this.userName != "" ) {
      return true;
    } else {
      return false;
    }
  }

}
