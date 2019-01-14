import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data.service';
import { ActionData } from '../../services/action-data.service';
import { PORTRAIT_LIST } from '../../../assets/portraits/portrait-list.const';

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

  @Input() model: ModelData;
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
    if ( this.model.editable && this.allowEdit ) {
      this.editable = true;
    } else {
      this.editable = false;
    }

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

  selectModelStat( value: any, statName: string ): void {

    const newStat = Number(value);

    switch ( statName ) {
      case 'SPD': this.model.SPD = newStat; break;
      case 'EV': this.model.EV = newStat; break;
      case 'ARM': this.model.ARM = newStat; break;
      case 'HP': this.model.HP = newStat; break;
    }

    // save the changed model to the database
    this.saveModelData();
  }

  addModelSpecialRule( newSpecialRule: SpecialRuleData ): void {
    this.model.specialRules.push( newSpecialRule);
    this.saveModelData();
  }

  deleteModelSpecialRule( ruleIndex: number ): void {
    this.model.specialRules.splice( ruleIndex, 1 );
    this.saveModelData();
  }

  selectActionStat( index: number, value: any, type: string ): void {

    const newStat = Number(value);

    switch ( type ) {
      case 'RNG-MELEE': this.model.actions[index].RNG = newStat; break;
      case 'RNG-RANGED': this.model.actions[index].RNG = newStat; break;
      case 'HIT': this.model.actions[index].HIT = newStat; break;
      case 'DMG': this.model.actions[index].DMG = newStat; break;
    }

    // update the cost of the model
    this.saveModelData();
  }

  deleteAction( actionIndex: number ) {
    this.model.actions.splice( actionIndex, 1 );
    this.saveModelData();
  }

  async addAction( action: ActionData ) {
    const updatedModel = await this.modelDataService.addAction( this.model, action );
    this.model = updatedModel;
    this.updated.emit();
  }

  addAttackSpecialRule( actionIndex: number, newRule: SpecialRuleData ): void {
    this.model.actions[actionIndex].specialRules.push(newRule);
    this.saveModelData();
  }

  deleteAttackSpecialRule( actionIndex: number, ruleIndex: number ): void {
    this.model.actions[actionIndex].specialRules.splice( ruleIndex, 1 );
    this.saveModelData();
  }

  selectPortrait( portrait: string ) {
    this.model.picture = portrait;
    this.saveModelData();
    this.showModelPortraitsDropdown = false;
  }

  async saveModelData() {
    const updatedModel = await this.modelDataService.updateModel( this.model );
    this.model = updatedModel;
    this.updated.emit();
  }
}
