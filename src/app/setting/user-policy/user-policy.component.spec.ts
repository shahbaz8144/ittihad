import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPolicyComponent } from './user-policy.component';

describe('UserPolicyComponent', () => {
  let component: UserPolicyComponent;
  let fixture: ComponentFixture<UserPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
