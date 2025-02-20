import { TestBed } from '@angular/core/testing';

import { CompanyhierarchyService } from './companyhierarchy.service';

describe('CompanyhierarchyService', () => {
  let service: CompanyhierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyhierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
