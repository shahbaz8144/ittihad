import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapCategoriesCompanyComponent } from './map-categories-company.component';

describe('MapCategoriesCompanyComponent', () => {
  let component: MapCategoriesCompanyComponent;
  let fixture: ComponentFixture<MapCategoriesCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCategoriesCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCategoriesCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
