import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedbymeComponent } from './sharedbyme.component';

describe('SharedbymeComponent', () => {
  let component: SharedbymeComponent;
  let fixture: ComponentFixture<SharedbymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedbymeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedbymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
