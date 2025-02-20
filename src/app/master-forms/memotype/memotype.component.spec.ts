import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemotypeComponent } from './memotype.component';

describe('MemotypeComponent', () => {
  let component: MemotypeComponent;
  let fixture: ComponentFixture<MemotypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MemotypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemotypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
