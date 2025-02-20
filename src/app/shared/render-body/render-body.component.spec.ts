import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenderBodyComponent } from './render-body.component';

describe('RenderBodyComponent', () => {
  let component: RenderBodyComponent;
  let fixture: ComponentFixture<RenderBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
