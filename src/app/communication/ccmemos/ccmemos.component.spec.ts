import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CCMemosComponent } from './ccmemos.component';

describe('CCMemosComponent', () => {
  let component: CCMemosComponent;
  let fixture: ComponentFixture<CCMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CCMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
