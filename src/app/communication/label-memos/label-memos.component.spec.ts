import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabelMemosComponent } from './label-memos.component';

describe('LabelMemosComponent', () => {
  let component: LabelMemosComponent;
  let fixture: ComponentFixture<LabelMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
