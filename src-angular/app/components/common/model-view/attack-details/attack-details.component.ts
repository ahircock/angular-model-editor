import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ModelAttackData } from '../../../../services/model-data.service';

@Component({
  selector: 'app-attack-details',
  templateUrl: './attack-details.component.html',
  styleUrls: ['./attack-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AttackDetailsComponent implements OnInit {

  @Input() attack: ModelAttackData;

  constructor() { }

  ngOnInit() {
  }

}
