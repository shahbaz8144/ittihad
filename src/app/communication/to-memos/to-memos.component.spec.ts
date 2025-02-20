import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToMemosComponent } from './to-memos.component';

describe('ToMemosComponent', () => {
  let component: ToMemosComponent;
  let fixture: ComponentFixture<ToMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

  
  
