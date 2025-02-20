import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMSRequestComponent } from './dmsrequest.component';

describe('DMSRequestComponent', () => {
  let component: DMSRequestComponent;
  let fixture: ComponentFixture<DMSRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMSRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DMSRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
