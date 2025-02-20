import { TestBed } from '@angular/core/testing';

import { GACFileService } from './gacfile.service';

describe('GACFileService', () => {
  let service: GACFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GACFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
