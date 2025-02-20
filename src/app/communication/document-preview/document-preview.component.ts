import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {
  pdfSrc:string
  constructor() { }

  ngOnInit(): void {
    this.pdfSrc = 
    //"https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    "https://cswebapps.com/dmsweb/web/DATAOUTPUT/803D911C-34C5-4C4B-91F5-AD3E4FEB12A0.pdf";
  }

}
