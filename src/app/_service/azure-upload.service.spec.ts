import { TestBed } from '@angular/core/testing';

import { AzureUploadService } from './azure-upload.service';

describe('AzureUploadService', () => {
  let service: AzureUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
