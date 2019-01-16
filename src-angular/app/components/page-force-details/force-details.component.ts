import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { ModelData, ModelDataService } from '../../services/model-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css']
})
export class ForceDetailsComponent implements OnInit {

  public force: ForceData;
  public selectedModelIndex: number;
  public modelTemplates: ModelData[];
  public showModelListDropdown = false;
  public smallScreen: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modelDataService: ModelDataService,
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

    // mark the first model as selected
    if ( this.force.models.length > 0 ) {
      this.selectedModelIndex = 0;
    }

    // load up the list of model templates
    this.modelTemplates = await this.modelDataService.getAllModels();
  }

  selectModel( selectedModelIndex: number ) {
    this.selectedModelIndex = selectedModelIndex;
  }

  async addModel( model: ModelData ) {

    // add the model to the force
    const newForceModelData: ForceModelData = Object.assign( {}, {count: 1, forceModelName: model.name}, model );
    this.force.models.push ( newForceModelData );

    // update the force in the DB
    this.force = await this.forceDataService.updateForce( this.force );

    // select the new model (which should be the last one in the list)
    this.selectedModelIndex = this.force.models.length - 1;
  }

  async increaseModelCount(modelIndex: number) {

    // increase the count on the force object
    this.force.models[modelIndex].count++;

    // save the changes
    await this.saveForce();

    // select the model
    this.selectModel(modelIndex);
  }

  async decreaseModelCount(modelIndex: number) {

    // decrease the count on the force object
    this.force.models[modelIndex].count--;
    if ( this.force.models[modelIndex].count <= 0) {
      this.force.models.splice(modelIndex, 1);
    }

    // save the changes
    await this.saveForce();

    // select the model
    this.selectModel(modelIndex);
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
}
