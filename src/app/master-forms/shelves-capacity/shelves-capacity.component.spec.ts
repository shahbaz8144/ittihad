import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelvesCapacityComponent } from './shelves-capacity.component';

describe('ShelvesCapacityComponent', () => {
  let component: ShelvesCapacityComponent;
  let fixture: ComponentFixture<ShelvesCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelvesCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelvesCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
