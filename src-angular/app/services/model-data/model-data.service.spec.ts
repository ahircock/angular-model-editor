import { TestBed, inject } from '@angular/core/testing';

import { ModelDataService } from './model-data.service';

describe('ModelDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelDataService]
    });
  });

  it('should be created', inject([ModelDataService], (service: ModelDataService) => {
    expect(service).toBeTruthy();
  }));
});
