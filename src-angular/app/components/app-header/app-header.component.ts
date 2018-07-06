import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  public showMenuDropdown: boolean = false;
  public showUserMenuDropdown: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  menuDropdownClick() {
    this.showMenuDropdown = !this.showMenuDropdown;
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

}
