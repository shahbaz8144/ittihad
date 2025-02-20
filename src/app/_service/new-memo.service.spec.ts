import { TestBed } from '@angular/core/testing';

import { NewMemoService } from './new-memo.service';

describe('NewMemoService', () => {
  let service: NewMemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewMemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
