import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoDetailsV2Component } from './memo-details-v2.component';

describe('MemoDetailsV2Component', () => {
  let component: MemoDetailsV2Component;
  let fixture: ComponentFixture<MemoDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
