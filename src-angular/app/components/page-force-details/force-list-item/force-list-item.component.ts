import { Component, OnInit, Input } from '@angular/core';
import { ForceData } from '../../../services/force-data.service';

@Component({
  selector: 'app-force-list-item',
  templateUrl: './force-list-item.component.html',
  styleUrls: ['./force-list-item.component.css']
})
export class ForceListItemComponent implements OnInit {

  @Input() force: ForceData;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit() {
  }
}
