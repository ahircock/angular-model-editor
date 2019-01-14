import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelDataService, ModelData  } from '../../services/model-data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  public models: ModelData[];
  public selectedModelIndex: number;
  public showPrintable = false; // controls whether model is shown as printable or not

  constructor(
    private router: Router,
    private modelDataService: ModelDataService,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.models = await this.modelDataService.getAllTemplates();

    // select the first one
    if ( this.models.length > 0 ) {
      this.selectedModelIndex = 0;
    }
  }

  async refreshData() {
    this.models = await this.modelDataService.getAllTemplates();
  }

  onSelect( selectedModelIndex: number ) {
    this.selectedModelIndex = selectedModelIndex;
  }

  async modelDetailsChanged( modelIndex: number ) {
    const updatedModel = await this.modelDataService.getModelById( this.models[modelIndex]._id );
    this.models[modelIndex] = updatedModel;
  }

  async newModelClick() {
    const newModel: ModelData = await this.modelDataService.createTemplate();
    await this.refreshData();

    // select the new rule from the list
    this.selectedModelIndex = this.models.findIndex( element => element._id === newModel._id );

  }
}
