import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuffeldocumentsComponent } from './shuffeldocuments.component';

describe('ShuffeldocumentsComponent', () => {
  let component: ShuffeldocumentsComponent;
  let fixture: ComponentFixture<ShuffeldocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShuffeldocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuffeldocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
