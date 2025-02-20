import { TestBed } from '@angular/core/testing';

import { StreamboxserviceService } from './streamboxservice.service';

describe('StreamboxserviceService', () => {
  let service: StreamboxserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamboxserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
