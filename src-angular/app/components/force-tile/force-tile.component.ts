import { Component, OnInit, Input } from '@angular/core';
import { ForceData } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-force-tile',
  templateUrl: './force-tile.component.html',
  styleUrls: ['./force-tile.component.css']
})
export class ForceTileComponent implements OnInit {

  @Input() force: ForceData;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit() {
  }

}
