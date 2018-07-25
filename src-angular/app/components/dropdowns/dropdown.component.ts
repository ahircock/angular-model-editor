import { OnInit, Output, EventEmitter } from '@angular/core';

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
