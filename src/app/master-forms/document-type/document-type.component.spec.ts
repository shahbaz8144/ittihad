import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentTypeComponent } from './document-type.component';

describe('DocumentTypeComponent', () => {
  let component: DocumentTypeComponent;
  let fixture: ComponentFixture<DocumentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
