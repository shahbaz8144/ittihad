import { TestBed } from '@angular/core/testing';

import { UserPolicyMasterServiceService } from './user-policy-master-service.service';

describe('UserPolicyMasterServiceService', () => {
  let service: UserPolicyMasterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPolicyMasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
