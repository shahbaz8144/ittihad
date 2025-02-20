import { TestBed } from '@angular/core/testing';

import { SharedwithmeServicesService } from './sharedwithme-services.service';

describe('SharedwithmeServicesService', () => {
  let service: SharedwithmeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedwithmeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
