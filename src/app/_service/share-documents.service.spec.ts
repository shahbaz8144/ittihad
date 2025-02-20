import { TestBed } from '@angular/core/testing';

import { ShareDocumentsService } from './share-documents.service';

describe('ShareDocumentsService', () => {
  let service: ShareDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
