import { TestBed } from '@angular/core/testing';

import { ShuffeldocumentsService } from './shuffeldocuments.service';

describe('ShuffeldocumentsService', () => {
  let service: ShuffeldocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShuffeldocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
