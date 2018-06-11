import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  public userName:string = "";

  constructor() { }

  login( email: string, password: string ) {
    this.userName = email;
  }

  signup( email: string, password: string ) {
    this.userName = email;
  }

  logout() {
    this.userName = "";
  }

}
