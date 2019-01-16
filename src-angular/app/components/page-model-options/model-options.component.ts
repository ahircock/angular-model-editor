import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelDataService } from '../../services/model-data.service';
import { ForceDataService, ForceModelData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-model-options',
  templateUrl: './model-options.component.html',
  styleUrls: ['./model-options.component.css']
})
export class ModelOptionsComponent implements OnInit {

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
    const modelIndex = Number(forceModelId[1]);
    const force = await this.forceDataService.getForceById(forceId);
    this.model = force.models[modelIndex];
  }

  backArrow() {
    this.location.back();
  }

}
