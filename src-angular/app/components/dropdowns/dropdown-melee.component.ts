import { Component } from '@angular/core';
import { ActionDataService } from '../../services/action-data.service';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'app-dropdown-melee',
  templateUrl: './dropdown-melee.component.html',
  styleUrls: ['./dropdown.component.css', './dropdown-melee.component.css']
})
export class DropdownMeleeComponent extends DropdownComponent {

  constructor(
    private actionDataService: ActionDataService
  ) {
    super();
  }

  async loadItemList() {
    const returnVal = await this.actionDataService.getMeleeActions();
    return returnVal;
  }

}
