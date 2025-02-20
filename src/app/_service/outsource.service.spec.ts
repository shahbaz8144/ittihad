import { TestBed } from '@angular/core/testing';

import { OutsourceService } from './outsource.service';

describe('OutsourceService', () => {
  let service: OutsourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutsourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
