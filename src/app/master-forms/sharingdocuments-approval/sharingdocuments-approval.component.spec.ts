import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sharingDocumentsApprovalComponent } from './sharingdocuments-approval.component';

describe('DocumentsApprovalComponent', () => {
  let component: sharingDocumentsApprovalComponent;
  let fixture: ComponentFixture<sharingDocumentsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ sharingDocumentsApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(sharingDocumentsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
