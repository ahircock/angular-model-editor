import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelData, ModelDataService } from '../../services/model-data/model-data.service';
import { SpecialRuleData } from '../../services/special-rule-data/special-rule-data.service';

interface EditorModelData {
  _id: string;
  name: string;
  traits?: string;
  picture?: string;
  cost: number;
  SPD: number;
  EV: number;
  ARM: number;
  HP: number;
  SPDBonus?: number;
  EVBonus?: number;
  ARMBonus?: number;
  HPBonus?: number;
  SPDBonusCost?: number;
  EVBonusCost?: number;
  ARMBonusCost?: number;
  HPBonusCost?: number;
  specialRules: SpecialRuleData[];
  actions: EditorModelActionData[];
}

interface EditorModelActionData {
  type: string;
  name: string;
  traits?: string;
  AP: number;
  RNG?: number;
  HIT?: number;
  DMG?: number;
  ONCE?: boolean;
  specialRules: SpecialRuleData[];
}

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() model: EditorModelData;
  public modelId: string;

  public MODEL_BASE_STATS = { Cost: 10, SPD: 5, EV: 5, ARM: 0, HP: 5, HIT: 6, DMG: 6 };
  public SPD_BONUS_COST = [ { Bonus: -2, Cost: -2 }, { Bonus: -1, Cost: -1 }, { Bonus: 0, Cost: 0 }, { Bonus: 1, Cost: 1 }, { Bonus: 2, Cost: 3 }, { Bonus: 3, Cost: 6 } ];

  constructor( 
    private location: Location,
    private route: ActivatedRoute,
    private modelDataService: ModelDataService
   ) { }

  async ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    let modelData = await this.modelDataService.getModel(id);
    this.initEditorData(modelData);
  }

  initEditorData(modelData: ModelData ) : void {
    
    // initialize the normal model-data attributes
    this.model = modelData;

    // initialize the model stat bonuses
    this.model.SPDBonus = this.model.SPD - this.MODEL_BASE_STATS.SPD;
    this.model.EVBonus = this.model.EV - this.MODEL_BASE_STATS.EV;
    this.model.ARMBonus = this.model.ARM - this.MODEL_BASE_STATS.ARM;
    this.model.HPBonus = this.model.HP - this.MODEL_BASE_STATS.HP;
    this.model.SPDBonusCost = this.SPD_BONUS_COST.find( (element) => { return element.Bonus == this.model.SPDBonus; } ).Cost;;
    this.model.EVBonusCost = 0;
    this.model.ARMBonusCost = 0;
    this.model.HPBonusCost = 0;

    // calculate the total cost
    this.updateCost();
  }

  ok(): void {
    this.location.back();
  }

  selectSPDBonus( value: any ): void {
    let SPDBonus = Number(value);
    this.model.SPD = this.MODEL_BASE_STATS.SPD + SPDBonus;
    this.model.SPDBonusCost = this.SPD_BONUS_COST.find( (element) => { return element.Bonus == SPDBonus; } ).Cost;
    this.updateCost();
  }

  updateCost(): void {
    this.model.cost = this.MODEL_BASE_STATS.Cost;
    this.model.cost += this.model.SPDBonusCost;
  }

}
