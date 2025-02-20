import { TestBed } from '@angular/core/testing';

import { MapDocumentService } from './map-document.service';

describe('MapDocumentService', () => {
  let service: MapDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
