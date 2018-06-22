import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpecialRuleData, SpecialRuleDataService } from '../../services/special-rule-data/special-rule-data.service';

@Component({
  selector: 'app-special-rule-editor',
  templateUrl: './special-rule-editor.component.html',
  styleUrls: ['./special-rule-editor.component.css']
})
export class SpecialRuleEditorComponent implements OnInit {

  @Input() rule: SpecialRuleData;
  @Output() updated: EventEmitter<void> = new EventEmitter();

  constructor(
    private specialRuleDataService: SpecialRuleDataService
  ) { }

  ngOnInit() {
  }

  async updateRuleData() {
    this.rule = await this.specialRuleDataService.updateRule(this.rule);
    this.updated.emit();
  }

}
