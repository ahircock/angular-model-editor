import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PORTRAIT_LIST } from '../../../../assets/portraits/portrait-list.const';
import { ForceModelData } from '../../../services/force-data.service';
import { ModelAbilityData } from '../../../services/model-data.service';

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
  visibleAbilities: ModelAbilityData[] = [];

  constructor(
   ) { }

  ngOnInit() {
    this.setupVisibleAbilities();
  }

  ngOnChanges() {
    this.setupVisibleAbilities();
  }

  private setupVisibleAbilities() {

    // clear out the list of visible abilities
    this.visibleAbilities = [];

    // setup the list of visible abilities
    if ( this.model ) {
      for ( const ability of this.model.abilities ) {
        if ( ability.abilityData.display ) {
          this.visibleAbilities.push(ability);
        }
      }
    }
  }
}
