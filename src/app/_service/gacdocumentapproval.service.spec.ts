import { TestBed } from '@angular/core/testing';

import { GacdocumentapprovalService } from './gacdocumentapproval.service';

describe('GacdocumentapprovalService', () => {
  let service: GacdocumentapprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GacdocumentapprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
