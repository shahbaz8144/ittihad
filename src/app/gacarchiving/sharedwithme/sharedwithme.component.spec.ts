import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedwithmeComponent } from './sharedwithme.component';

describe('SharedwithmeComponent', () => {
  let component: SharedwithmeComponent;
  let fixture: ComponentFixture<SharedwithmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedwithmeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedwithmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
