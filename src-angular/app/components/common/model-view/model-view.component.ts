import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelDataService } from '../../../services/model-data.service';
import { PORTRAIT_LIST } from '../../../../assets/portraits/portrait-list.const';
import { ForceModelData } from '../../../services/force-data.service';

interface StatCost {
  stat: number;
  cost: number;
}

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrls: ['./model-view.component.css']
})
export class ModelViewComponent implements OnInit {

  @Input() model: ForceModelData;
  @Input() allowEdit: boolean;
  @Output() updated: EventEmitter<void> = new EventEmitter();

  modelPortraits: string[] = PORTRAIT_LIST;
  showModelPortraitsDropdown = false;

  constructor(
    private modelDataService: ModelDataService
   ) { }

  ngOnInit() {
  }

  async saveModelData() {
    this.updated.emit();
  }
}
