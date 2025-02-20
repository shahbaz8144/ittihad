import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedocumentsComponent } from './sharedocuments.component';

describe('SharedocumentsComponent', () => {
  let component: SharedocumentsComponent;
  let fixture: ComponentFixture<SharedocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
