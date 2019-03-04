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

    // create the first page; it's height must account for the height of the title box
    let page: Page = { leftColumn: { forceModels: [] }, rightColumn: { forceModels: [] } };
    let pageNumber = 1;

    // start adding models to the left column
    let columnName = 'left';
    let column = page.leftColumn;

    // loop through all of the models to display
    do {

      // get the remaining page height
      let remainingPageHeight = TOTAL_PAGE_HEIGHT - titleDivHeight;
      if ( pageNumber > 1 ) {
        remainingPageHeight = TOTAL_PAGE_HEIGHT;
      }

      // loop through every model, and add the ones that will fit to the column
      // also remove them from the list of remaining models to display
      let i = 0;
      do {
        if ( modelsToDisplay[i].height < remainingPageHeight ) {
          column.forceModels.push(modelsToDisplay[i].forceModelData);
          remainingPageHeight -= modelsToDisplay[i].height;
          modelsToDisplay.splice(i, 1); // remove from the list of remaining models
        } else {
          i++; // move onto the next model
        }
      } while ( i < modelsToDisplay.length );

      // if this is the bottom of the left column
      if ( columnName === 'left' ) {

        // if there are no more models, then display the page
        if ( modelsToDisplay.length === 0 ) {
          this.pages.push( page );
        } else {
          // if there are more models, then switch to the right column
          columnName = 'right';
          column = page.rightColumn;
        }

      // if this is the bottom of the right column
      } else {

        // add the displayed page
        this.pages.push( page );

        // if there are more models, then create the next page
        if ( modelsToDisplay.length > 0 ) {
          page = { leftColumn: { forceModels: [] }, rightColumn: { forceModels: [] } };
          pageNumber++;
          columnName = 'left';
          column = page.leftColumn;
        }
      }

      // if this is the last model, then display the page

    } while ( modelsToDisplay.length > 0 ); // keep looping if there are more models

    console.log(this.pages);
  }

  private async sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
