import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

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

  async signup() {

    // make sure that the password and confirmation match
    if ( this.userPassword != this.confirmPassword ) {
      this.errorText = "Password and confirmation password do not match"
      return;
    }
    
    await this.userService.signup(this.userEmail, this.userPassword);
    this.router.navigateByUrl("/");
  }
}
