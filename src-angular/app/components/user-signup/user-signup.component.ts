import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { DBErrorData } from '../../services/db-connector/db-connector.interface';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  public userEmail: string = "";
  public userPassword: string = "";
  public confirmPassword: string = "";
  public errorText: string = "";

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Called from the signup button
   */
  async signup() {

    // make sure that the password and confirmation match
    if ( this.userPassword != this.confirmPassword ) {
      this.displayError({ errorCode: -1, errorMessage: "Password and confirmation do not match" });
      return;
    }
    
    // run the signup procedure
    await this.userService.signup(this.userEmail, this.userPassword)
        .catch((reason)=> { this.displayError(reason.error); throw reason; });

    // navigate to the home page
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
