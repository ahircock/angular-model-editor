import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceDataService, ForceData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-force-ability-details',
  templateUrl: './force-ability-details.component.html',
  styleUrls: ['./force-ability-details.component.css']
})
export class ForceAbilityDetailsComponent implements OnInit {

  public force: ForceData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private forceDataService: ForceDataService,
    private userService: UserService,
    private location: Location
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    // load the forceData object
    const forceId = this.activatedRoute.snapshot.paramMap.get('id');
    this.force = await this.forceDataService.getForceById(forceId);
    console.log('force=' + this.force );
  }

  backArrow() {
    this.location.back();
  }
}
