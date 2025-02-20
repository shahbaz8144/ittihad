import { TestBed } from '@angular/core/testing';

import { SourceserviceService } from './sourceservice.service';

describe('SourceserviceService', () => {
  let service: SourceserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
