import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GacfileuploadComponent } from './gacfileupload.component';

describe('GacfileuploadComponent', () => {
  let component: GacfileuploadComponent;
  let fixture: ComponentFixture<GacfileuploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GacfileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GacfileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
