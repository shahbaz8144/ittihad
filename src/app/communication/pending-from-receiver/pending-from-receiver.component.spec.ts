import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingFromReceiverComponent } from './pending-from-receiver.component';

describe('PendingFromReceiverComponent', () => {
  let component: PendingFromReceiverComponent;
  let fixture: ComponentFixture<PendingFromReceiverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingFromReceiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingFromReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
