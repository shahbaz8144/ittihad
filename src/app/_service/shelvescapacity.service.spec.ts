import { TestBed } from '@angular/core/testing';

import { ShelvescapacityService } from './shelvescapacity.service';

describe('ShelvescapacityService', () => {
  let service: ShelvescapacityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelvescapacityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
