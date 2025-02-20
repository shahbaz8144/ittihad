import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHierarchyComponent } from './company-hierarchy.component';

describe('CompanyHierarchyComponent', () => {
  let component: CompanyHierarchyComponent;
  let fixture: ComponentFixture<CompanyHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
