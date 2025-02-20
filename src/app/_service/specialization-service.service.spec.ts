import { TestBed } from '@angular/core/testing';

import { SpecializationServiceService } from './specialization-service.service';

describe('SpecializationServiceService', () => {
  let service: SpecializationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecializationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
