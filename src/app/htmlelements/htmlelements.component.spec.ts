import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HTMLElementsComponent } from './htmlelements.component';

describe('HTMLElementsComponent', () => {
  let component: HTMLElementsComponent;
  let fixture: ComponentFixture<HTMLElementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HTMLElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HTMLElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
