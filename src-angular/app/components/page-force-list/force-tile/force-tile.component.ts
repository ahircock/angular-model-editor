import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForceData } from '../../../services/force-data.service';

@Component({
  selector: 'app-force-tile',
  templateUrl: './force-tile.component.html',
  styleUrls: ['./force-tile.component.css']
})
export class ForceTileComponent implements OnInit {

  @Input() force: ForceData;
  @Input() selected: boolean;
  @Output() delete: EventEmitter<void> = new EventEmitter();
  @Output() select: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }
}
