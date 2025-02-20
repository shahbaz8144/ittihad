import { TestBed } from '@angular/core/testing';

import { MovedocumenttowarehouseService } from './movedocumenttowarehouse.service';

describe('MovedocumenttowarehouseService', () => {
  let service: MovedocumenttowarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovedocumenttowarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
