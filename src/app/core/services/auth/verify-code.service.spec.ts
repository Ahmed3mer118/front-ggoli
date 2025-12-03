import { TestBed } from '@angular/core/testing';

import { VerifyCodeService } from './verify-code.service';

describe('VerifyCodeService', () => {
  let service: VerifyCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
