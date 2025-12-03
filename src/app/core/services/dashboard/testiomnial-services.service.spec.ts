import { TestBed } from '@angular/core/testing';

import { TestiomnialServicesService } from './testiomnial-services.service';

describe('TestiomnialServicesService', () => {
  let service: TestiomnialServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestiomnialServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
