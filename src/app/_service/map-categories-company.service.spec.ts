import { TestBed } from '@angular/core/testing';

import { MapCategoriesCompanyService } from './map-categories-company.service';

describe('MapCategoriesCompanyService', () => {
  let service: MapCategoriesCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapCategoriesCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
