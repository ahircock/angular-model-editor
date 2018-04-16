import { TestBed, inject } from '@angular/core/testing';

import { SpecialRuleDataService } from './special-rule-data.service';

describe('SpecialRuleDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialRuleDataService]
    });
  });

  it('should be created', inject([SpecialRuleDataService], (service: SpecialRuleDataService) => {
    expect(service).toBeTruthy();
  }));
});
