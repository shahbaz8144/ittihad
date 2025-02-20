import { TestBed } from '@angular/core/testing';

import { MemoReplyService } from './memo-reply.service';

describe('MemoReplyService', () => {
  let service: MemoReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
