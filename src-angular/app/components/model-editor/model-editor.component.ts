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
  public EV_BONUS_COST = [ { Bonus: -2, Cost: -2 }, { Bonus: -1, Cost: -1 }, { Bonus: 0, Cost: 0 }, { Bonus: 1, Cost: 1 }, { Bonus: 2, Cost: 3 }, { Bonus: 3, Cost: 5 } ];
  public ARM_BONUS_COST = [ { Bonus: 0, Cost: 0 }, { Bonus: 1, Cost: 1 }, { Bonus: 2, Cost: 2 }, { Bonus: 3, Cost: 4 }, { Bonus: 3, Cost: 6 } ];
  public HP_BONUS_COST = [ { Bonus: 0, Cost: 0 }, { Bonus: 3, Cost: 3 }, { Bonus: 5, Cost: 5 } ];

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
    this.model.SPDBonusCost = this.SPD_BONUS_COST.find( (element) => { return element.Bonus == this.model.SPDBonus; } ).Cost;
    this.model.EVBonusCost = this.EV_BONUS_COST.find( (element) => { return element.Bonus == this.model.EVBonus; } ).Cost;
    this.model.ARMBonusCost = this.ARM_BONUS_COST.find( (element) => { return element.Bonus == this.model.ARMBonus; } ).Cost;
    this.model.HPBonusCost = this.HP_BONUS_COST.find( (element) => { return element.Bonus == this.model.HPBonus; } ).Cost;

    // calculate the total cost
    this.updateCost();
  }

  ok(): void {
    this.location.back();
  }

  selectBonus( value: any, type: string ): void {
    let Bonus = Number(value);

    switch ( type ) {
      case "SPD":
        this.model.SPD = this.MODEL_BASE_STATS.SPD + Bonus;
        this.model.SPDBonusCost = this.SPD_BONUS_COST.find( (element) => { return element.Bonus == Bonus; } ).Cost;
        break;
      case "EV":
        this.model.EV = this.MODEL_BASE_STATS.EV + Bonus;
        this.model.EVBonusCost = this.EV_BONUS_COST.find( (element) => { return element.Bonus == Bonus; } ).Cost;
        break;
      case "ARM":
        this.model.ARM = this.MODEL_BASE_STATS.ARM + Bonus;
        this.model.ARMBonusCost = this.ARM_BONUS_COST.find( (element) => { return element.Bonus == Bonus; } ).Cost;
        break;
      case "HP":
        this.model.HP = this.MODEL_BASE_STATS.HP + Bonus;
        this.model.HPBonusCost = this.HP_BONUS_COST.find( (element) => { return element.Bonus == Bonus; } ).Cost;
        break;
    }

    // update the cost of the model
    this.updateCost();
  }

  updateCost(): void {
    this.model.cost = this.MODEL_BASE_STATS.Cost;

    // add the model stat bonuses
    this.model.cost += this.model.SPDBonusCost;
    this.model.cost += this.model.EVBonusCost;
    this.model.cost += this.model.ARMBonusCost;
    this.model.cost += this.model.HPBonusCost;
  }

}
