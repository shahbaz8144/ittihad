import { TestBed } from '@angular/core/testing';

import { BackgroundNewMailsService } from './background-new-mails.service';

describe('BackgroundNewMailsService', () => {
  let service: BackgroundNewMailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundNewMailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
