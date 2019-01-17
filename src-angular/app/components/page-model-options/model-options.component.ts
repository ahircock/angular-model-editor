import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceDataService, ForceModelData, ForceData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { ModelOptionData } from '../../services/model-data.service';

@Component({
  selector: 'app-model-options',
  templateUrl: './model-options.component.html',
  styleUrls: ['./model-options.component.css']
})
export class ModelOptionsComponent implements OnInit {

  public model: ForceModelData;
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
    const forceModelId = this.activatedRoute.snapshot.paramMap.get('id').split(':');
    const forceId = forceModelId[0];
    const modelIndex = Number(forceModelId[1]);
    this.force = await this.forceDataService.getForceById(forceId);
    this.model = this.force.models[modelIndex];
  }

  backArrow() {
    this.location.back();
  }

  isChoiceSelected(optionId: string, choiceIndex: number) {
    const option = this.model.optionChoices.find( element => element.optionId === optionId );
    return option.choiceIndex === choiceIndex ? true : false;
  }

  async selectChoice( optionId: string, choiceIndex: number ) {
    await this.forceDataService.updateModelOptionChoice( this.force, this.model, optionId, choiceIndex );
  }

}
