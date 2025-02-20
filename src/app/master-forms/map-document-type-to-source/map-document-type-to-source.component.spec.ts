import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapDocumentTypeToSourceComponent } from './map-document-type-to-source.component';

describe('MapDocumentTypeToSourceComponent', () => {
  let component: MapDocumentTypeToSourceComponent;
  let fixture: ComponentFixture<MapDocumentTypeToSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDocumentTypeToSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDocumentTypeToSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
