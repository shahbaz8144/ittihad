import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedexpiredComponent } from './sharedexpired.component';

describe('SharedexpiredComponent', () => {
  let component: SharedexpiredComponent;
  let fixture: ComponentFixture<SharedexpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedexpiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedexpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
