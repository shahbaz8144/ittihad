import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GacarchivinglistComponent } from './gacarchivinglist.component';

describe('GacarchivinglistComponent', () => {
  let component: GacarchivinglistComponent;
  let fixture: ComponentFixture<GacarchivinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GacarchivinglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GacarchivinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
