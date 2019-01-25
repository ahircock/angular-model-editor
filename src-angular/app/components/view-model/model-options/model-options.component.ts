import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceDataService, ForceModelData, ForceData } from '../../../services/force-data.service';
import { UserService } from '../../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-model-options',
  templateUrl: './model-options.component.html',
  styleUrls: ['./model-options.component.css']
})
export class ModelOptionsComponent implements OnInit {

  @Input() model: ForceModelData;
  @Input() force: ForceData;
  @Output() updated: EventEmitter<void> = new EventEmitter();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private forceDataService: ForceDataService,
    private userService: UserService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  backArrow() {
    this.location.back();
  }

  isChoiceSelected(optionId: string, choiceIndex: number) {
    const option = this.model.optionChoices.find( element => element.optionId === optionId );
    if ( !option ) {
      return false;
    }
    const value = option.choiceIndexes.find( element => element === choiceIndex );
    return typeof value === 'undefined' ? false : true;
  }

  async selectChoice( optionId: string, choiceIndex: number ) {

    // find out if the choice is optional
    const option = this.model.factionModelData.options.find( element => element.id === optionId );

    // get the list of possible choices for this option
    const optionChoices = this.model.optionChoices.find( element => element.optionId === optionId );

    // find out if this choice has already been selected
    const indexChoiceIndexes = optionChoices.choiceIndexes.findIndex( element => element === choiceIndex );
    const alreadySelected = indexChoiceIndexes !== -1;

    // if the choice was previously selected, and it is optional, then de-select it
    if ( alreadySelected && option.optional ) {
      optionChoices.choiceIndexes.splice(indexChoiceIndexes, 1);
      this.updated.emit();

    // if the choice has changed and it is multi-select, then add a new selection
    } else if ( !alreadySelected && option.multiSelect ) {
      optionChoices.choiceIndexes.push(choiceIndex);
      this.updated.emit();

    // if the choice has changed but it is not multi-select, then simply replace the existing one
    } else if ( !alreadySelected && !option.multiSelect ) {
      optionChoices.choiceIndexes[0] = choiceIndex;
      this.updated.emit();
    }
  }

}
