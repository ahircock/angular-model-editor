import { Component, OnInit, Input } from '@angular/core';
import { ForceData } from '../../services/force-data.service';

@Component({
  selector: 'app-view-force',
  templateUrl: './view-force.component.html',
  styleUrls: ['./view-force.component.css']
})
export class ViewForceComponent implements OnInit {

  @Input() force: ForceData;

  constructor() { }

  ngOnInit() {
  }

}
