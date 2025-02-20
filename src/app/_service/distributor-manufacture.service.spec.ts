import { TestBed } from '@angular/core/testing';

import { DistributorManufactureService } from './distributor-manufacture.service';

describe('DistributorManufactureService', () => {
  let service: DistributorManufactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributorManufactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
