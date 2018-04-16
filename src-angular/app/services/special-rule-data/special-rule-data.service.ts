import { Injectable } from '@angular/core';

export interface SpecialRuleData {
  _id: string;
  ruleType: string;
  ruleName: string;
  ruleText: string;
  ruleCost: number;
  ruleAP?: number;
}

@Injectable()
export class SpecialRuleDataService {

  constructor() { }

}
