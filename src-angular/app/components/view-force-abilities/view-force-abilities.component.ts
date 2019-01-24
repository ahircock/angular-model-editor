import { Component, OnInit, Input } from '@angular/core';
import { ForceData } from '../../services/force-data.service';

@Component({
  selector: 'app-view-force-abilities',
  templateUrl: './view-force-abilities.component.html',
  styleUrls: ['./view-force-abilities.component.css']
})
export class ViewForceAbilitiesComponent implements OnInit {

  @Input() force: ForceData;

  constructor() { }

  ngOnInit() {
  }

}
