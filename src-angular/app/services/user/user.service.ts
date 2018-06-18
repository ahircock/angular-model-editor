import { Injectable } from '@angular/core';
import { DbConnectService } from '../db-connector/db-connector.interface'

@Injectable()
export class UserService {

  public userName:string = "";
  public loginError: string = "";

  constructor(
    private dbConnectService: DbConnectService
  ) { }

  async login( email: string, password: string ): Promise<boolean> {
    try {
      await this.dbConnectService.login(email, password );
      this.userName = email;
      return true;
    } catch {
      return false;
    }
  }

  async signup( email: string, password: string ): Promise<boolean> {
    try {
      await this.dbConnectService.signup(email, password );
      this.userName = email;
      return true;
    } catch {
      return false;
    }
  }

  async logout() {
    this.userName = "";
  }

  public isLoggedIn(): boolean {
    if ( this.userName != "" ) {
      return true;
    } else {
      return false;
    }
  }

}
