import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BackendLayoutComponent } from './backend-layout.component';

describe('BackendLayoutComponent', () => {
  let component: BackendLayoutComponent;
  let fixture: ComponentFixture<BackendLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
