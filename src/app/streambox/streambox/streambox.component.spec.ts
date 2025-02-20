import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamboxComponent } from './streambox.component';

describe('StreamboxComponent', () => {
  let component: StreamboxComponent;
  let fixture: ComponentFixture<StreamboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
