import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { DBErrorData } from '../../services/db-connector/db-connector.interface';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  public userEmail: string = "";
  public userPassword: string = "";
  public errorText: string = "";

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * called from the login button
   */
  async login() {
      await this.userService.login(this.userEmail, this.userPassword)
          .catch((reason)=> { this.displayError(reason.error); throw reason; });
      this.router.navigateByUrl("/");
  }

  /**
   * Display the error message on the page
   * @param error Error data returned from the DB connection
   */
  private displayError(error: DBErrorData) {
    switch (error.errorCode ) {
      case 301: //  user does not exist
        this.errorText = "Invalid email"
        break;
      case 302: // password invalid
        this.errorText = "Invalid password"
        break;
      default:
        this.errorText = error.errorMessage;
        break;
    }    
  }

}
