import { Component } from '@angular/core';
import { ActionDataService } from '../../services/action-data/action-data.service';
import { DropdownComponent } from './dropdown.component'

@Component({
  selector: 'app-dropdown-ranged',
  templateUrl: './dropdown-ranged.component.html',
  styleUrls: ['./dropdown.component.css', './dropdown-ranged.component.css']
})
export class DropdownRangedComponent extends DropdownComponent {

  constructor(
    private actionDataService: ActionDataService
  ) { 
    super();
  }

  async loadItemList() {
    let returnVal = await this.actionDataService.getRangedActions();
    return returnVal;
  }

}
