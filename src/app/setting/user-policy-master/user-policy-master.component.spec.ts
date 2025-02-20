import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPolicyMasterComponent } from './user-policy-master.component';

describe('UserPolicyMasterComponent', () => {
  let component: UserPolicyMasterComponent;
  let fixture: ComponentFixture<UserPolicyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPolicyMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPolicyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
