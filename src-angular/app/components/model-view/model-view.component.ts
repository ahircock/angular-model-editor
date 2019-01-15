import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data.service';
import { ActionData } from '../../services/action-data.service';
import { PORTRAIT_LIST } from '../../../assets/portraits/portrait-list.const';
import { ForceModelData } from '../../services/force-data.service';

interface StatCost {
  stat: number;
  cost: number;
}

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrls: ['./model-view.component.css']
})
export class ModelViewComponent implements OnInit, OnChanges {

  @Input() model: ForceModelData;
  @Input() allowEdit: boolean;
  @Output() updated: EventEmitter<void> = new EventEmitter();

  modelPortraits: string[] = PORTRAIT_LIST;
  showModelPortraitsDropdown = false;
  visibleModelRules = false;
  editable = false;

  constructor(
    private modelDataService: ModelDataService
   ) { }

  ngOnInit() {
    this.initViewSettings();
  }

  ngOnChanges() {
    this.initViewSettings();
  }

  initViewSettings() {

    // if no model is selected
    if ( !this.model ) {
      this.editable = false;
      this.visibleModelRules = false;
      return;
    }

    // figure out if the model should be editable
    this.editable = this.allowEdit;

    // figure out if the Model Rules box should be shown
    this.visibleModelRules = false;
    if ( this.editable ) {
      this.visibleModelRules = true; // show the box since there is an Add Model button
    } else {
      for ( const rule of this.model.specialRules ) {
        if ( rule.printVisible ) { this.visibleModelRules = true; }
      }
    }

  }

  selectPortrait( portrait: string ) {
    this.model.picture = portrait;
    this.saveModelData();
    this.showModelPortraitsDropdown = false;
  }

  async saveModelData() {
    this.updated.emit();
  }
}
