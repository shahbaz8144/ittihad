import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicsnackbarComponent } from './basicsnackbar.component';

describe('BasicsnackbarComponent', () => {
  let component: BasicsnackbarComponent;
  let fixture: ComponentFixture<BasicsnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicsnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
