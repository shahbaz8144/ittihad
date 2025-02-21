import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignusersComponent } from './assignusers.component';

describe('AssignusersComponent', () => {
  let component: AssignusersComponent;
  let fixture: ComponentFixture<AssignusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
