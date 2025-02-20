import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerticketingComponent } from './customerticketing.component';

describe('CustomerticketingComponent', () => {
  let component: CustomerticketingComponent;
  let fixture: ComponentFixture<CustomerticketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerticketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerticketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
