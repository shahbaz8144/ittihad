import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveTrashComponent } from './archive-trash.component';

describe('ArchiveTrashComponent', () => {
  let component: ArchiveTrashComponent;
  let fixture: ComponentFixture<ArchiveTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveTrashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
