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
    return option.choiceIndex === choiceIndex ? true : false;
  }

  async selectChoice( optionId: string, choiceIndex: number ) {
    const optionChoice = this.model.optionChoices.find( element => element.optionId === optionId );
    optionChoice.choiceIndex = choiceIndex;
    this.updated.emit();
  }

}
