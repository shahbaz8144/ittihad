import { TestBed } from '@angular/core/testing';

import { SharebymeService } from './sharebyme.service';

describe('SharebymeService', () => {
  let service: SharebymeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharebymeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
