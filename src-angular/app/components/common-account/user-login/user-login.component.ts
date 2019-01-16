import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DBErrorData } from '../../../services/data-access.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  public userEmail = '';
  public userPassword = '';
  public errorText = '';

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

    // convert the email to lowercase
    this.userEmail = this.userEmail.toLowerCase();

    await this.userService.login(this.userEmail, this.userPassword)
        .then( () => this.router.navigateByUrl('/') ) // if successful, then open the main page
        .catch( (reason) => { this.displayError(reason.error); }); // if unsuccssful, then display error message
  }

  /**
   * Display the error message on the page
   * @param error Error data returned from the DB connection
   */
  private displayError(error: DBErrorData) {
    switch (error.errorCode ) {
      case 301: //  user does not exist
        this.errorText = 'Invalid email';
        break;
      case 302: // password invalid
        this.errorText = 'Invalid password';
        break;
      default:
        this.errorText = error.errorMessage;
        break;
    }
  }

}
