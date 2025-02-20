import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import * as  fabric from 'fabric';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-pdf-editor',
  templateUrl: './pdf-editor.component.html',
  styleUrls: ['./pdf-editor.component.css']
})
export class PdfEditorComponent {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef;
  @ViewChild('signatureCanvas', { static: false }) signatureCanvas!: ElementRef;

  private pdfPage: any;
  private signaturePad!: fabric.Canvas;

  constructor() {
   }
  async ngAfterViewInit() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    await this.loadPDF('https://yrglobaldocuments.blob.core.windows.net/documents/Draft/65/1739523434101MMAH%20DMS%20-%20BRD.pdf'); // Load PDF from assets
  }

  async loadPDF(pdfUrl: string) {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    this.pdfPage = await pdf.getPage(1);

    const viewport = this.pdfPage.getViewport({ scale: 1.5 });
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await this.pdfPage.render({ canvasContext: context, viewport }).promise;

    // Initialize Fabric.js for signatures
    this.signaturePad = new fabric.Canvas(this.signatureCanvas.nativeElement, {
      isDrawingMode: false
    });

    this.signatureCanvas.nativeElement.width = viewport.width;
    this.signatureCanvas.nativeElement.height = viewport.height;
  }

  enableSignature() {
    this.signaturePad.isDrawingMode = true; // Enable drawing mode
  }

  clearSignature() {
    this.signaturePad.clear(); // Clear the signature
  }

  async saveSignedPDF() {
    const pdfBytes = await fetch('/assets/sample.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    // Convert Fabric.js signature canvas to an image
    const signatureDataURL = this.signaturePad.toDataURL();
    const signatureImage = await pdfDoc.embedPng(await fetch(signatureDataURL).then(res => res.arrayBuffer()));

    page.drawImage(signatureImage, {
      x: 100,
      y: 150,
      width: 200,
      height: 50
    });

    // Save new PDF
    const newPdfBytes = await pdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'signed-document.pdf');
  }

}
