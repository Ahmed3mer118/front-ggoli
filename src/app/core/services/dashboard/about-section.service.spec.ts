import { TestBed } from '@angular/core/testing';

import { AboutSectionService } from './about-section.service';

describe('AboutSectionService', () => {
  let service: AboutSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
