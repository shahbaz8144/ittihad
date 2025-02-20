import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteMemosComponent } from './delete-memos.component';

describe('DeleteMemosComponent', () => {
  let component: DeleteMemosComponent;
  let fixture: ComponentFixture<DeleteMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
