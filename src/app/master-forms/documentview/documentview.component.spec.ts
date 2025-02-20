import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentviewComponent } from './documentview.component';

describe('DocumentviewComponent', () => {
  let component: DocumentviewComponent;
  let fixture: ComponentFixture<DocumentviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
