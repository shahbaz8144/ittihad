import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistributorManufactureComponent } from './distributor-manufacture.component';

describe('DistributorManufactureComponent', () => {
  let component: DistributorManufactureComponent;
  let fixture: ComponentFixture<DistributorManufactureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorManufactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
