import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGrudsGuard } from './admin-gruds.guard';

describe('adminGrudsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGrudsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
