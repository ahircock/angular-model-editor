import { Component, OnInit, ViewChildren, QueryList, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

interface ModelDisplayInfo {
  forceModelData: ForceModelData;
  height: number;
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

  // the following variables are all used to calculate the height of the
  // various div boxes
  @ViewChildren('modeldiv') private modelDivs: QueryList<ElementRef>;
  @ViewChild('titlediv') private titleDiv: ElementRef;

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

    // use the heights of the boxes to layout for printing
    await this.arrangePrintLayout();
  }

  /**
   * arrange the model boxes so that they will fit on a printed page
   */
  private async arrangePrintLayout() {

    const modelDisplays = await this.getBoxHeights();

    await this.placeBoxesOnPages(modelDisplays);
  }

  /**
   * This method will temporarily display the boxes on a single page, so that we can
   * calculate the height of each div. Heights will be stored in instance variables
   */
  private async getBoxHeights() {

    // create an empty page, and add all models to the left column
    const page: Page = { leftColumn: { forceModels: [] }, rightColumn: { forceModels: [] } };
    for ( const model of this.force.models ) {
      page.leftColumn.forceModels.push(model);
    }
    this.pages.push(page);

    // wait until angular updates the view, so that you can get the ElementRef properties
    await this.sleep(0);

    // get the model box heights
    let i = 0;
    const modelDisplays: ModelDisplayInfo[] = [];
    for ( const modelBoxElem of this.modelDivs.toArray() ) {
      const modelBoxHeight: ModelDisplayInfo = {
        forceModelData: this.force.models[i],
        height: modelBoxElem.nativeElement.offsetHeight ? modelBoxElem.nativeElement.offsetHeight : 0
      };
      modelDisplays.push(modelBoxHeight);
      i++;
    }

    return modelDisplays;
  }

  /**
   * This method will use the heights of each div to properly place the
   * boxes on the page
   */
  private async placeBoxesOnPages(modelsToDisplay: ModelDisplayInfo[] ) {

    // this is the total desired height of the page
    const TOTAL_PAGE_HEIGHT = 1050;

    // calcualte the height of the title div
    const titleDivHeight = this.titleDiv ? this.titleDiv.nativeElement.offsetHeight : 0;

    // clear the current page layout
    this.pages = [];

    // keep track of whether this is the first page
    let pageNumber = 0;

    // loop through all of the models to display
    do {

      // create the page to display
      const page: Page = { leftColumn: { forceModels: [] }, rightColumn: { forceModels: [] } };
      pageNumber++;

      // get the remaining page height
      let remainingLeftColHeight = TOTAL_PAGE_HEIGHT - titleDivHeight;
      let remainingRightColHeight = TOTAL_PAGE_HEIGHT - titleDivHeight;
      if ( pageNumber > 1 ) {
        remainingLeftColHeight = TOTAL_PAGE_HEIGHT;
        remainingRightColHeight = TOTAL_PAGE_HEIGHT;
      }

      // loop through every model, and add the ones that will fit to the column
      // also remove them from the list of remaining models to display
      let i = 0;
      do {

        // look in the column that has the most height remaining
        const colName = remainingRightColHeight > remainingLeftColHeight ? 'right' : 'left';
        const column = remainingRightColHeight > remainingLeftColHeight ? page.rightColumn : page.leftColumn;
        const remainingHeight = remainingRightColHeight > remainingLeftColHeight ? remainingRightColHeight : remainingLeftColHeight;
        if ( modelsToDisplay[i].height < remainingHeight ) {

          // add the model to the column
          column.forceModels.push(modelsToDisplay[i].forceModelData);

          // adjust the height remaining
          if ( colName === 'left' ) {
            remainingLeftColHeight -= modelsToDisplay[i].height;
          } else {
            remainingRightColHeight -= modelsToDisplay[i].height;
          }

          // remove the model from the list
          modelsToDisplay.splice(i, 1);

        // not enough height remaining on this page, so move onto the next model
        } else {
          i++;
        }

      } while ( i < modelsToDisplay.length );

      // display the page, and create a new one
      this.pages.push( page );

    } while ( modelsToDisplay.length > 0 ); // keep looping if there are more models
  }

  private async sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
