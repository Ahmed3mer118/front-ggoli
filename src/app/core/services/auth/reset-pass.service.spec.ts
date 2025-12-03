import { TestBed } from '@angular/core/testing';

import { ResetPassService } from './reset-pass.service';

describe('ResetPassService', () => {
  let service: ResetPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
