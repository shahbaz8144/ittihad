import { TestBed } from '@angular/core/testing';

import { RacksService } from './racks.service';

describe('RacksService', () => {
  let service: RacksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RacksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
