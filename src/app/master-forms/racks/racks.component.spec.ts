import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RacksComponent } from './racks.component';

describe('RacksComponent', () => {
  let component: RacksComponent;
  let fixture: ComponentFixture<RacksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
