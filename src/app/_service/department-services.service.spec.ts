import { TestBed } from '@angular/core/testing';

import { DepartmentServicesService } from './department-services.service';

describe('DepartmentServicesService', () => {
  let service: DepartmentServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
