import { TestBed } from '@angular/core/testing';

import { NgxIndexedDBServiceService } from './ngx-indexed-dbservice.service';

describe('NgxIndexedDBServiceService', () => {
  let service: NgxIndexedDBServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxIndexedDBServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
