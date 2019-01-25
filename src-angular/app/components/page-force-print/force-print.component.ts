import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceDataService, ForceData, ForceModelData } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';

interface Page {
  leftColumn: Column;
  rightColumn: Column;
}
interface Column {
  forceModels: ForceModelData[];
}

@Component({
  selector: 'app-force-print',
  templateUrl: './force-print.component.html',
  styleUrls: ['./force-print.component.css']
})
export class ForcePrintComponent implements OnInit {

  /**
   * The details of the force being shown
   */
  public force: ForceData;

  /**
   * This property is checked by the parent component, and
   * is used to show or hide the application header band
   */
  public showHeader = false;

  /**
   * This is the list of pages to be printed
   */
  public pages: Page[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private forceDataService: ForceDataService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    // load the force object
    const forceId = this.activatedRoute.snapshot.paramMap.get('id');
    this.force = await this.forceDataService.getForceById(forceId);

    // add the first half of the models to the left array, and the second half to the right
    this.preparePrintLayout();
  }

  private preparePrintLayout() {

    // create a page for every 4 models
    const numPages = (this.force.models.length / 4) + 1;
    for ( let i = 0; i < numPages; i++ ) {
      const leftColumn: Column = { forceModels: [] };
      const rightColumn: Column = { forceModels: [] };
      const page: Page = { leftColumn: leftColumn, rightColumn: rightColumn };
      this.pages.push(page);
    }

    // add each model to the correct page
    let pageIndex = 0;
    let modelCounter = 1;
    for ( const model of this.force.models ) {
      if ( modelCounter === 1 ) {
        this.pages[pageIndex].leftColumn.forceModels.push(model);
        modelCounter++;
      } else  if ( modelCounter === 2 ) {
        this.pages[pageIndex].leftColumn.forceModels.push(model);
        modelCounter++;
      } else if ( modelCounter === 3 ) {
        this.pages[pageIndex].rightColumn.forceModels.push(model);
        modelCounter++;
      } else if ( modelCounter === 4 ) {
        this.pages[pageIndex].rightColumn.forceModels.push(model);
        modelCounter = 1;
        pageIndex++;
      }
    }
  }

}
