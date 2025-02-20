import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentMemosComponent } from './sent-memos.component';

describe('SentMemosComponent', () => {
  let component: SentMemosComponent;
  let fixture: ComponentFixture<SentMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
