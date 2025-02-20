import { TestBed } from '@angular/core/testing';

import { InboxfilterService } from './inboxfilter.service';

describe('InboxfilterService', () => {
  let service: InboxfilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InboxfilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
