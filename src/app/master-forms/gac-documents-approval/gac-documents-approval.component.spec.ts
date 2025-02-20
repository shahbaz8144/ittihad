import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GacDocumentsApprovalComponent } from './gac-documents-approval.component';

describe('GacDocumentsApprovalComponent', () => {
  let component: GacDocumentsApprovalComponent;
  let fixture: ComponentFixture<GacDocumentsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GacDocumentsApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GacDocumentsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
