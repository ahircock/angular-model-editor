import { Component, OnInit, Input } from '@angular/core';
import { ModelAttackData } from '../../../../services/model-data.service';

@Component({
  selector: 'app-attack-details',
  templateUrl: './attack-details.component.html',
  styleUrls: ['./attack-details.component.css']
})
export class AttackDetailsComponent implements OnInit {

  @Input() attack: ModelAttackData;

  constructor() { }

  ngOnInit() {
  }

}
