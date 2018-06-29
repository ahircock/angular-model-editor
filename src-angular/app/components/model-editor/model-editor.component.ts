import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';

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

  modelPortraits: string[] = [
    "basic.jpg",
    "chaos - beast.jpg",
    "chaos - beastmaster.jpg",
    "chaos - champion.jpg",
    "chaos - general.jpg",
    "chaos - marauder.jpg",
    "chaos - marauder-champion.jpg",
    "chaos - marauder-horn.jpg",
    "chaos - marauder-standard.jpg",
    "chaos - warrior.jpg",
    "chaos - warrior-standard.jpg",
    "templar - angel.jpg",
    "templar - general.jpg",
    "templar - knight.jpg",
    "templar - knight-captain.jpg",
    "templar - paladin.jpg",
    "templar - soulwarden.jpg",
    "sylvaneth - branchwych.jpg",
    "sylvaneth - dryad.jpg",
    "sylvaneth - treelord.jpg"
  ];
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

  async addMeleeAction() {
    let updatedModel = await this.modelDataService.addMeleeAction( this.model );
    this.model = updatedModel;
    this.updated.emit();
  }

  async addRangedAction() {
    let updatedModel = await this.modelDataService.addRangedAction( this.model );
    this.model = updatedModel;
    this.updated.emit();
  }

  async addSpecialAction( newSpecialRule: SpecialRuleData ) {
    let updatedModel = await this.modelDataService.addSpecialAction( this.model, newSpecialRule );
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