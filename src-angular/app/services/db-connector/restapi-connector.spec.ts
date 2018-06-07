import { TestBed, inject } from '@angular/core/testing';

import { RestAPIConnector } from './restapi-connector.service';

describe('DbConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestAPIConnector]
    });
  });

  it('should be created', inject([RestAPIConnector], (service: RestAPIConnector) => {
    expect(service).toBeTruthy();
  }));
});
