import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExecutionPlannerComponent } from './execution-planner.component';

describe('ExecutionPlannerComponent', () => {
  let component: ExecutionPlannerComponent;
  let fixture: ComponentFixture<ExecutionPlannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
