import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaptemplatetocabinetComponent } from './maptemplatetocabinet.component';

describe('MaptemplatetocabinetComponent', () => {
  let component: MaptemplatetocabinetComponent;
  let fixture: ComponentFixture<MaptemplatetocabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaptemplatetocabinetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaptemplatetocabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
