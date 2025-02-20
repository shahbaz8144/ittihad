import { TestBed } from '@angular/core/testing';

import { DocumentsapprovalapiService } from './documentsapprovalapi.service';

describe('DocumentsapprovalapiService', () => {
  let service: DocumentsapprovalapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsapprovalapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
