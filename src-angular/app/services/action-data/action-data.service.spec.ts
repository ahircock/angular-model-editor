import { TestBed, inject } from '@angular/core/testing';

import { ActionDataService } from './action-data.service';

describe('ActionDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionDataService]
    });
  });

  it('should be created', inject([ActionDataService], (service: ActionDataService) => {
    expect(service).toBeTruthy();
  }));
});
