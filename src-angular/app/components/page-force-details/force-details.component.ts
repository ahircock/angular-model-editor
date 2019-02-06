import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { WindowService } from '../../services/window.service';
import { FactionModelData } from '../../services/faction-data.service';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css', '../../app.backgrounds.css']
})
export class ForceDetailsComponent implements OnInit {

  public force: ForceData;
  public selectedItemIndex: number;
  public selectedModelIndex: number;
  public commonAbilitiesExist: boolean;
  public factionModels: FactionModelData[];
  public showModelListDropdown = false;
  public smallScreen: boolean;

  /** This variable is needed to control selection problems with mobile device workflow */
  public modelButtonPressed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

    // determine if there are common abilities
    this.commonAbilitiesExist = this.force.abilities.length > 0;

    // load up the list of model templates
    this.factionModels = this.force.faction.models;
  }

  selectModel( model: ForceModelData ) {
    const forceModelIndex = this.force.models.findIndex( element => element === model );
    if ( this.commonAbilitiesExist ) {
      this.selectedItemIndex = forceModelIndex + 1;
      this.selectedModelIndex = forceModelIndex;
    } else {
      this.selectedItemIndex = forceModelIndex;
      this.selectedModelIndex = forceModelIndex;
    }

    // if this is a mobile device AND one of the buttons on the tile was not pressed
    if ( this.windowService.isWindowMobile() ) {
      if ( !this.modelButtonPressed ) {
        const forceModelId = this.force._id + ':' + (this.selectedModelIndex);
        this.router.navigateByUrl('/model/' + forceModelId);
      }
      this.modelButtonPressed = false;
    }
  }

  selectForce() {
    this.selectedItemIndex = 0;
    this.selectedModelIndex = -1;

    // if this is a mobile device AND one of the buttons on the tile was not pressed
    if ( this.windowService.isWindowMobile() ) {
      if ( !this.modelButtonPressed ) {
        const forceModelId = this.force._id;
        this.router.navigateByUrl('/force/abilities/' + forceModelId);
      }
      this.modelButtonPressed = false;
    }
  }

  async addModel( model: FactionModelData ) {

    // add the model to the force
    this.force = await this.forceDataService.addModel( this.force, model );

    // select the new model (which should be the last one in the list)
    this.selectModel( this.force.models[this.force.models.length - 1] );
  }

  async increaseModelCount( model: ForceModelData ) {

    // record that a button was pressed
    this.modelButtonPressed = true;

    this.force = await this.forceDataService.increaseModelCount( model );
  }

  async decreaseModelCount( model: ForceModelData ) {

    // record that a button was pressed
    this.modelButtonPressed = true;

    this.force = await this.forceDataService.decreaseModelCount( model );
  }

  async selectLeader( model: ForceModelData ) {

      // record that a button was pressed
      this.modelButtonPressed = true;

      this.force = await this.forceDataService.selectLeader( model );
  }

  async saveForce() {
    this.force = await this.forceDataService.updateForce( this.force );
  }

  printForce() {
    this.router.navigateByUrl('/force/print/' + this.force._id);
  }

  modelOptions() {
    const forceModelId = this.force._id + ':' + (this.selectedModelIndex);
    this.router.navigateByUrl('/model/options/' + forceModelId);
  }

  backArrow() {
    this.location.back();
  }

  isWindowMobile() {
    return this.windowService.isWindowMobile();
  }
}
