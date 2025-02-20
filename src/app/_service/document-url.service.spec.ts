import { TestBed } from '@angular/core/testing';

import { DocumentUrlService } from './document-url.service';

describe('DocumentUrlService', () => {
  let service: DocumentUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
