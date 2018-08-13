import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';
import { ActionData } from '../../services/action-data/action-data.service'
import { PORTRAIT_LIST } from '../../../assets/portraits/portrait-list.const';

interface StatCost {
  stat: number;
  cost: number;
}

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() model: ModelData;
  @Output() updated: EventEmitter<void> = new EventEmitter();

  modelPortraits: string[] = PORTRAIT_LIST;  
  showModelPortraitsDropdown: boolean = false;

  constructor( 
    private modelDataService: ModelDataService
   ) { }

  async ngOnInit() {
  }

  selectModelStat( value: any, statName: string ): void {
    
    let newStat = Number(value);
    
    switch ( statName ) {
      case "SPD": this.model.SPD = newStat; break;
      case "EV": this.model.EV = newStat; break;
      case "ARM": this.model.ARM = newStat; break;
      case "HP": this.model.HP = newStat; break;
    }

    // save the changed model to the database
    this.saveModelData();
  }

  addModelSpecialRule( newSpecialRule: SpecialRuleData ) : void {
    this.model.specialRules.push( newSpecialRule);
    this.saveModelData();
  }

  deleteModelSpecialRule( ruleIndex: number ): void {
    this.model.specialRules.splice( ruleIndex, 1 );
    this.saveModelData();
  }

  selectActionStat( index: number, value: any, type: string ): void {
    
    let newStat = Number(value);

    switch ( type ) {
      case "RNG-MELEE": this.model.actions[index].RNG = newStat; break;
      case "RNG-RANGED":this.model.actions[index].RNG = newStat; break;
      case "HIT": this.model.actions[index].HIT = newStat; break;
      case "DMG": this.model.actions[index].DMG = newStat; break;
    }

    // update the cost of the model
    this.saveModelData();
  }

  deleteAction( actionIndex: number ) {
    this.model.actions.splice( actionIndex, 1 );
    this.saveModelData();
  }

  async addAction( action: ActionData ) {
    let updatedModel = await this.modelDataService.addAction( this.model, action );
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
    let updatedModel = await this.modelDataService.updateModel( this.model );
    this.model = updatedModel;
    this.updated.emit();
  }
}