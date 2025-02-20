import { TestBed } from '@angular/core/testing';

import { ApiurlService } from './apiurl.service';

describe('ApiurlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiurlService = TestBed.get(ApiurlService);
    expect(service).toBeTruthy();
  });
});
