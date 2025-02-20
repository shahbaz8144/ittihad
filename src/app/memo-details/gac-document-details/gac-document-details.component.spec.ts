import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GacDocumentDetailsComponent } from './gac-document-details.component';

describe('GacDocumentDetailsComponent', () => {
  let component: GacDocumentDetailsComponent;
  let fixture: ComponentFixture<GacDocumentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GacDocumentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GacDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
