import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMemoComponent } from './new-memo.component';

describe('NewMemoComponent', () => {
  let component: NewMemoComponent;
  let fixture: ComponentFixture<NewMemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
