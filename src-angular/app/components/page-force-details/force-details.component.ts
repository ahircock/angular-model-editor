import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { ModelData, ModelDataService } from '../../services/model-data.service';
import { Location } from '@angular/common';
import { WindowService } from '../../services/window.service';
import { FactionModelData } from '../../services/faction-data.service';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css']
})
export class ForceDetailsComponent implements OnInit {

  public force: ForceData;
  public selectedModelIndex: number;
  public factionModels: FactionModelData[];
  public showModelListDropdown = false;
  public smallScreen: boolean;
  public modelButtonPressed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modelDataService: ModelDataService,
    private forceDataService: ForceDataService,
    private userService: UserService,
    private location: Location,
    private windowService: WindowService
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

    // mark the first model as selected
    if ( this.force.models.length > 0 && !this.isWindowMobile() ) {
      this.selectedModelIndex = 0;
    }

    // load up the list of model templates
    this.factionModels = this.force.faction.models;
  }

  selectModel( selectedModelIndex: number ) {
    this.selectedModelIndex = selectedModelIndex;

    // if this is a mobile device AND one of the buttons on the tile was not pressed
    if ( this.windowService.isWindowMobile() ) {
      if ( !this.modelButtonPressed ) {
        const forceModelId = this.force._id + ':' + this.selectedModelIndex;
        this.router.navigateByUrl('/model/' + forceModelId);
      }
      this.modelButtonPressed = false;
    }
  }

  async addModel( model: FactionModelData ) {

    // add the model to the force
    this.force = await this.forceDataService.addModel( this.force, model.modelData );

    // select the new model (which should be the last one in the list)
    this.selectedModelIndex = this.force.models.length - 1;
  }

  async increaseModelCount(modelIndex: number) {

    // record that a button was pressed
    this.modelButtonPressed = true;

    // increase the count on the force object
    this.force.models[modelIndex].count++;

    // save the changes
    await this.saveForce();
  }

  async decreaseModelCount(modelIndex: number) {

    // record that a button was pressed
    this.modelButtonPressed = true;

    // decrease the count on the force object
    this.force.models[modelIndex].count--;
    if ( this.force.models[modelIndex].count <= 0) {
      this.force.models.splice(modelIndex, 1);
    }

    // save the changes
    await this.saveForce();
  }


  async saveForce() {
    this.force = await this.forceDataService.updateForce( this.force );
  }

  printForce() {
    this.router.navigateByUrl('/force/print/' + this.force._id);
  }

  modelOptions() {
    const forceModelId = this.force._id + ':' + this.selectedModelIndex;
    this.router.navigateByUrl('/model/options/' + forceModelId);
  }

  backArrow() {
    this.location.back();
  }

  isWindowMobile() {
    return this.windowService.isWindowMobile();
  }
}
