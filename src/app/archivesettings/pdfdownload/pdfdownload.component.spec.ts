import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfdownloadComponent } from './pdfdownload.component';

describe('PdfdownloadComponent', () => {
  let component: PdfdownloadComponent;
  let fixture: ComponentFixture<PdfdownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfdownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfdownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
