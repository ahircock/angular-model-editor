import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActionDataService } from '../../services/action-data/action-data.service';

@Component({
  selector: 'app-dropdown-melee',
  templateUrl: './dropdown-melee.component.html',
  styleUrls: ['./dropdown-melee.component.css']
})
export abstract class DropdownComponent implements OnInit {

  /**
   * This is the bind-output when an item is selected
   */
  @Output() itemSelected = new EventEmitter<any>();

  /**
   * List of objects to display in the dropdown
   */
  itemList: any[] = [];
  
  /**
   * controls whether the dropdown is visible
   */
  dropdownVisible: boolean = false;

  constructor() { }

  async ngOnInit() {
    this.itemList = await this.loadItemList();
  }

  selectItem(selectedItem: any) {
    this.itemSelected.emit( selectedItem );
    this.dropdownVisible = false;
  }

  async abstract loadItemList(): Promise<any>;
}
