import { Component, OnInit, Input } from '@angular/core';
import { ForceModelData } from '../../../services/force-data.service';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: ['./header-details.component.css']
})
export class HeaderDetailsComponent implements OnInit {

  @Input() model: ForceModelData;

  constructor() { }

  ngOnInit() {
  }

}
