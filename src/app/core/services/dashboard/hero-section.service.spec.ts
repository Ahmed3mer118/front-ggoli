import { TestBed } from '@angular/core/testing';

import { HeroSectionService } from './hero-section.service';

describe('HeroSectionService', () => {
  let service: HeroSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
