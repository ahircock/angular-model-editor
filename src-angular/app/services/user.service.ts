import { Injectable, EventEmitter } from '@angular/core';
import { DataAccessService } from './data-access.service';

@Injectable()
export class UserService {

  public userName = '';
  public loginError = '';

  // create event emitters that other services can subscribe to
  public loginEvent: EventEmitter<string> = new EventEmitter();
  public logoutEvent: EventEmitter<void> = new EventEmitter();

  constructor(
    private dbConnectService: DataAccessService
  ) { }

  async login( email: string, password: string ): Promise<void> {
    await this.dbConnectService.login(email, password )
        .catch((reason) => { throw reason; });

    // store the name of the user
    this.userName = email;

    // notify all of the data services
    this.loginEvent.emit(email);
  }

  async signup( email: string, password: string ): Promise<void> {
    await this.dbConnectService.signup(email, password )
        .catch((reason) => { throw reason; });

    // store the name of the user
    this.userName = email;

    // notify all of the data services
    this.loginEvent.emit(email);
  }

  async logout() {
    this.userName = '';

    // notify all of the data services
    this.logoutEvent.emit();
  }

  public isLoggedIn(): boolean {
    if ( this.userName !== '' ) {
      return true;
    } else {
      return false;
    }
  }

}
