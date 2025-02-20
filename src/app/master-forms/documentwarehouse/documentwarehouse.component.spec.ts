import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentwarehouseComponent } from './documentwarehouse.component';

describe('DocumentwarehouseComponent', () => {
  let component: DocumentwarehouseComponent;
  let fixture: ComponentFixture<DocumentwarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentwarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentwarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
