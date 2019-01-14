import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActionDataService, ActionData } from '../../services/action-data.service';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})
export class ActionDetailsComponent implements OnInit {

  action: ActionData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private actionDataService: ActionDataService,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    // load the action object
    const actionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = await this.actionDataService.getActionById(actionId);
  }

}
