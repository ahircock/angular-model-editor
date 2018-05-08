import { TestBed, inject } from '@angular/core/testing';

import { ForceDataService } from './force-data.service';

describe('ForceDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForceDataService]
    });
  });

  it('should be created', inject([ForceDataService], (service: ForceDataService) => {
    expect(service).toBeTruthy();
  }));
});
