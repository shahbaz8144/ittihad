import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignMenusComponent } from './assign-menus.component';

describe('AssignMenusComponent', () => {
  let component: AssignMenusComponent;
  let fixture: ComponentFixture<AssignMenusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
