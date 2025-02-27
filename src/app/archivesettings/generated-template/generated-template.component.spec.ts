import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedTemplateComponent } from './generated-template.component';

describe('GeneratedTemplateComponent', () => {
  let component: GeneratedTemplateComponent;
  let fixture: ComponentFixture<GeneratedTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
