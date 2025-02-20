import { TestBed } from '@angular/core/testing';

import { DateCategorizerService } from './date-categorizer.service';

describe('DateCategorizerService', () => {
  let service: DateCategorizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateCategorizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
