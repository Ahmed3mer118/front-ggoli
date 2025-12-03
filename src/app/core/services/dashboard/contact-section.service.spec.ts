import { TestBed } from '@angular/core/testing';

import { ContactSectionService } from './contact-section.service';

describe('ContactSectionService', () => {
  let service: ContactSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
