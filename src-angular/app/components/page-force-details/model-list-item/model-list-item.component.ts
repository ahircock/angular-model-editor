import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForceModelData } from '../../../services/force-data.service';

@Component({
  selector: 'app-model-list-item',
  templateUrl: './model-list-item.component.html',
  styleUrls: ['./model-list-item.component.css']
})
export class ModelListItemComponent implements OnInit {

  @Input() model: ForceModelData;
  @Input() selected: boolean;
  @Output() increaseCount: EventEmitter<void> = new EventEmitter();
  @Output() decreaseCount: EventEmitter<void> = new EventEmitter();
  @Output() selectLeader: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}
