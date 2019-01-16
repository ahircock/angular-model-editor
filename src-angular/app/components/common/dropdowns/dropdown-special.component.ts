import { Component } from '@angular/core';
import { ActionDataService } from '../../../services/action-data.service';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'app-dropdown-special',
  templateUrl: './dropdown-special.component.html',
  styleUrls: ['./dropdown.component.css', './dropdown-special.component.css']
})
export class DropdownSpecialComponent extends DropdownComponent {

  constructor(
    private actionDataService: ActionDataService
  ) {
    super();
  }

  async loadItemList() {
    return await this.actionDataService.getSpecialActions();
  }

}
