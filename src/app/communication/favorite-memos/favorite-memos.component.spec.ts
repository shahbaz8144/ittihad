import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FavoriteMemosComponent } from './favorite-memos.component';

describe('FavoriteMemosComponent', () => {
  let component: FavoriteMemosComponent;
  let fixture: ComponentFixture<FavoriteMemosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteMemosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
