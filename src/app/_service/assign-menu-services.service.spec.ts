import { TestBed } from '@angular/core/testing';

import { AssignMenuServicesService } from './assign-menu-services.service';

describe('AssignMenuServicesService', () => {
  let service: AssignMenuServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignMenuServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
