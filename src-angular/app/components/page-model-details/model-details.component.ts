import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceDataService, ForceModelData, ForceData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css']
})
export class ModelDetailsComponent implements OnInit {

  public force: ForceData;
  public forceModelIndex: number;
  public model: ForceModelData;

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
    const forceModelId = this.activatedRoute.snapshot.paramMap.get('id').split(':');
    const forceId = forceModelId[0];
    this.forceModelIndex = Number(forceModelId[1]);
    this.force = await this.forceDataService.getForceById(forceId);
    this.model = this.force.models[this.forceModelIndex];
  }

  backArrow() {
    this.location.back();
  }

  async saveForce() {
    this.force = await this.forceDataService.updateForce( this.force );
    this.model = this.force.models[this.forceModelIndex];
  }
}
