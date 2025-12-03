import { TestBed } from '@angular/core/testing';

import { ForgetPassService } from './forget-pass.service';

describe('ForgetPassService', () => {
  let service: ForgetPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgetPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
