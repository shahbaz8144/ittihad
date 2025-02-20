import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { DragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import SignaturePad from 'signature_pad';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import * as $ from 'jquery';
import * as JsBarcode from 'jsbarcode';
import 'pdfjs-dist/build/pdf';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class PdfComponent implements AfterViewInit {
  pdfDataUrl: string = 'https://yrglobaldocuments.blob.core.windows.net/documents/Draft/65/1739523434101MMAH%20DMS%20-%20BRD.pdf';
  @ViewChild('signaturePad') signaturePadElement: ElementRef;
  @ViewChild('pdfViewerContainer') pdfViewerContainer: ElementRef;
  private dragOffset = { x: 0, y: 0 };
  signaturePad: SignaturePad;
  signatureImage: string;
  signatures: { id: number, page: number, x: number, y: number, image: string }[] = [];
  signatureIdCounter: number = 0;
  isSignaturePadOpen: boolean = false;
  isPlacingSignature: boolean = false;
  pdf: any;

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2,
    private dragDrop: DragDrop
  ) { }

  ngAfterViewInit() {
    this.loadPdf();
    // Listen for clicks on the PDF viewer
    this.pdfViewerContainer.nativeElement.addEventListener('click', (event: MouseEvent) => {
      if (this.isPlacingSignature) {
        this.placeSignature(event);
      }
    });
  }

  placeSignature(event: MouseEvent) {
    const canvases = Array.from(document.querySelectorAll('canvas')) as HTMLCanvasElement[];
    let pageElement: HTMLCanvasElement | null = null;
    // Find the canvas (PDF page) where the user clicked
    for (const canvas of canvases) {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom) {
        pageElement = canvas;
        break;
      }
    }
    if (!pageElement) {
      console.error('Click was outside the PDF pages.');
      return;
    }
    const pageNumber = parseInt(pageElement.getAttribute('data-page-number')!, 10);
    if (isNaN(pageNumber)) {
      console.error('Invalid page number detected.');
      return;
    }
    // Convert click position to PDF coordinates
    const rect = pageElement.getBoundingClientRect();
    const scaleX = pageElement.width / rect.width;
    const scaleY = pageElement.height / rect.height;
    const offsetX = (event.clientX - rect.left) * scaleX;
    const offsetY = (event.clientY - rect.top) * scaleY;
    // console.log(`Signature placed on Page=${pageNumber}, x=${offsetX}, y=${offsetY}`);
    // Get the last signature (the one we just created)
    const signature = this.signatures[this.signatures.length - 1];

    if (!signature) {
      console.error('No signature found to place.');
      return;
    }

    // Update the signature position and page
    signature.page = pageNumber;
    signature.x = offsetX;
    signature.y = offsetY;

    // Re-render the signature at the new position
    this.renderSignatureOnPage(pageElement, offsetX, offsetY, signature.id);

    // Disable placing mode
    this.isPlacingSignature = false;
  }

  async loadPdf() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    const loadingTask = pdfjsLib.getDocument(this.pdfDataUrl);
    const pdf = await loadingTask.promise;
    this.pdf = pdf; // ✅ Store PDF instance
    const container = this.pdfViewerContainer.nativeElement;
    container.innerHTML = ''; // Clear previous pages

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });

      // Create a wrapper for each page
      const pageWrapper = document.createElement('div');
      pageWrapper.classList.add('pdf-page-wrapper');
      pageWrapper.setAttribute('data-page-number', pageNum.toString());
      pageWrapper.style.position = 'relative'; // Allows absolute positioning inside
      pageWrapper.style.marginBottom = '10px';

      // Create and configure canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.setAttribute('data-page-number', pageNum.toString());

      // Render PDF page
      const renderContext = { canvasContext: context, viewport: viewport };
      await page.render(renderContext).promise;

      // Append canvas inside the wrapper
      pageWrapper.appendChild(canvas);

      // Append wrapper to PDF container
      container.appendChild(pageWrapper);
    }

    this.renderAllSignatures();
  }

  renderAllSignatures() {
    this.signatures.forEach(signature => {
      const pageElement = this.pdfViewerContainer.nativeElement.querySelector(`canvas[data-page-number="${signature.page}"]`);
      if (pageElement) {
        this.renderSignatureOnPage(pageElement, signature.x, signature.y, signature.id);
      }
    });
  }

  openSignaturePad() {
    this.isSignaturePadOpen = true;
    this.cdr.detectChanges(); // Ensure UI is updated
    const canvas = this.signaturePadElement.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.signaturePad = new SignaturePad(canvas);
  }

  closeSignaturePad() {
    this.isSignaturePadOpen = false;
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    this.signatureImage = this.signaturePad.toDataURL();
    const id = this.signatureIdCounter++;

    // Enable placing mode
    this.isPlacingSignature = true;

    // Store the signature but don't set a fixed position yet
    this.signatures.push({
      id,
      page: 1, // Default page, updated later
      x: 0, // Will be updated on click
      y: 0,
      image: this.signatureImage
    });

    this.cdr.detectChanges();
    this.closeSignaturePad();
  }

  async onDragEnd(event: CdkDragEnd) {
    try {

      const draggedElement = event.source.element.nativeElement;
      const dragPosition = event.source.getFreeDragPosition();//event.dropPoint;

      // Get all PDF pages (canvas elements)
      const canvases = Array.from(
        this.pdfViewerContainer.nativeElement.querySelectorAll('canvas')
      ) as HTMLCanvasElement[];

      let pageElement: HTMLCanvasElement | null = null;

      // Find the canvas (PDF page) where the signature was dropped
      for (const canvas of canvases) {
        const rect = canvas.getBoundingClientRect();

        if (
          dragPosition.x >= rect.left &&
          dragPosition.x <= rect.right &&
          dragPosition.y >= rect.top &&
          dragPosition.y <= rect.bottom
        ) {
          pageElement = canvas;
          break;
        }
      }

      if (!pageElement) {
        console.error('Drop position is outside the PDF canvas.');
        return;
      }

      const pageNumber = parseInt(pageElement.getAttribute('data-page-number')!, 10);
      if (isNaN(pageNumber)) {
        console.error('Invalid page number detected.');
        return;
      }

      // Retrieve the PDF page
      const page = await this.pdf.getPage(pageNumber);
      const originalViewport = page.getViewport({ scale: 1.0 });

      // Compute scale based on actual rendered canvas size
      const viewport = page.getViewport({ scale: pageElement.width / originalViewport.width });

      // Convert drop position from screen coordinates to PDF coordinates
      const rect = pageElement.getBoundingClientRect();

      // Adjust the drop position using the stored offset
      const offsetX = (dragPosition.x - rect.left - this.dragOffset.x) / viewport.scale;
      const offsetY = (dragPosition.y - rect.top - this.dragOffset.y) / viewport.scale;

      console.log(`Signature dropped on Page=${pageNumber}, X=${offsetX}, Y=${offsetY}`);

      // Retrieve the signature ID
      const id = parseInt(draggedElement.getAttribute('data-id'), 10);
      if (isNaN(id)) {
        console.error('Invalid signature ID.');
        return;
      }

      const signature = this.signatures.find(sig => sig.id === id);
      if (!signature) {
        console.error('Signature not found in array.');
        return;
      }

      // Update the signature's position and page
      signature.page = pageNumber;
      signature.x = offsetX;
      signature.y = offsetY;

      // Render the signature at the correct position
      this.renderSignatureOnPage(pageElement, offsetX, offsetY, id);
    } catch (error) {
      console.error('Error in onDragEnd():', error);
    }
  }

  renderSignatureOnPage(pageElement: HTMLCanvasElement, x: number, y: number, id: number) {

    // Remove any existing signature with the same ID
    const existingSignature = document.querySelector(`.signature-container[data-id="${id}"]`);
    if (existingSignature) {
      existingSignature.remove();
    }

    // Find the signature data
    const signature = this.signatures.find(sig => sig.id === id);
    if (!signature) {
      console.error('❌ Signature not found in signatures array');
      return;
    }
    console.log(`Signature appended to Page ${signature.page}`);
    console.log(`Detected pageElement:`, pageElement);
    console.log(`Parent element of detected pageElement:`, pageElement.parentElement);

    // Create the signature container
    const container = document.createElement('div');
    container.setAttribute('data-id', id.toString());
    container.classList.add('signature-container');

    this.renderer.setAttribute(container, 'cdkDrag', '');

    container.style.position = 'absolute';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.cursor = 'pointer';

    container.addEventListener('click', () => this.onSignatureClick(id));
    // Create the signature image
    const img = document.createElement('img');
    img.src = signature.image;
    img.width = 100;
    img.height = 50;

    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('signature-tools'); // Main container

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('signature-tools-btn'); // Button wrapper

    // Create SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24px");
    svg.setAttribute("height", "24px");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", svgNS);

    // Create the `path` elements inside the SVG
    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("d", "M4 7H20");
    path1.setAttribute("stroke", "currentColor");
    path1.setAttribute("stroke-width", "2");
    path1.setAttribute("stroke-linecap", "round");
    path1.setAttribute("stroke-linejoin", "round");

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("d", "M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10");
    path2.setAttribute("stroke", "currentColor");
    path2.setAttribute("stroke-width", "2");
    path2.setAttribute("stroke-linecap", "round");
    path2.setAttribute("stroke-linejoin", "round");

    const path3 = document.createElementNS(svgNS, "path");
    path3.setAttribute("d", "M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z");
    path3.setAttribute("stroke", "currentColor");
    path3.setAttribute("stroke-width", "2");
    path3.setAttribute("stroke-linecap", "round");
    path3.setAttribute("stroke-linejoin", "round");

    // Append paths to the SVG
    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);

    // Append SVG to the delete button
    deleteButton.appendChild(svg);

    // Add click event to delete button
    deleteButton.onclick = () => this.removeSignature(id);

    // Append delete button to the container
    deleteContainer.appendChild(deleteButton);

    // Append image and delete button to the container
    container.appendChild(img);
    container.appendChild(deleteContainer);

    // Append the signature to the correct PDF page container
    const pdfPageContainer = pageElement.parentElement;
    if (pdfPageContainer) {
      pdfPageContainer.appendChild(container);
      console.log(`Signature appended to Page ${signature.page}`);
    } else {
      console.error('PDF page container not found');
    }
    //**Manually register the element as draggable**
    const dragRef = this.dragDrop.createDrag(container);
    dragRef.withHandles([container]); // Ensures the whole div is draggable

    this.cdr.detectChanges();
  }

  onSignatureClick(id: number) {
    console.log(`🖊️ Signature with ID ${id} clicked!`);
    const $signatureElement = $(`.signature-container[data-id="${id}"]`);
    if ($signatureElement.length) {
      // ✅ Remove 'selected-signature' from all elements before adding to the clicked one
      $('.signature-container').removeClass('selected-signature');
      $signatureElement.addClass('selected-signature');
      // ✅ Listen for clicks **outside** the signature to remove the class
      document.addEventListener('click', this.handleOutsideClick);
      console.log('✅ Class added:', $signatureElement.attr('class')); // Debug log
    } else {
      console.error(`❌ Signature element with ID ${id} not found.`);
    }
  }

  onDragStart(event: CdkDragStart) {

    const draggedElement = event.source.getRootElement(); // Get the dragged HTML element
    const rect = draggedElement.getBoundingClientRect();

    // Get the last pointer event from the DragRef
    const pointerEvent = event.source._dragRef['_lastPointerEvent'] as PointerEvent;
    if (!pointerEvent) {
      console.warn('⚠️ Unable to get pointer event, defaulting offset to (0,0)');
      this.dragOffset = { x: 0, y: 0 };
      return;
    }

    // Compute the offset of the cursor inside the dragged element
    this.dragOffset = {
      x: pointerEvent.clientX - rect.left,
      y: pointerEvent.clientY - rect.top,
    };
  }

  removeSignature(id: number) {
    this.signatures = this.signatures.filter(sig => sig.id !== id);
    const container = this.pdfViewerContainer.nativeElement.querySelector(`.signature-container[data-id="${id}"]`);
    if (container) {
      container.remove();
    }
  }
  // Function to remove class if clicked outside
  handleOutsideClick = (event: MouseEvent) => {
    const isSignature = (event.target as HTMLElement).closest('.signature-container');

    if (!isSignature) {
      // ✅ Remove class from all signatures
      document.querySelectorAll('.signature-container').forEach(el => {
        el.classList.remove('selected-signature');
      });

      // ✅ Remove event listener after execution
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  async downloadSignedPdf() {
    const pdf = new jsPDF();
    const pdfContainer = this.pdfViewerContainer.nativeElement;
    const pages = pdfContainer.querySelectorAll('.pdf-page-wrapper');
    const watermarkImage = 'assets/watermark/Progressive.png';

    // 🔹 Barcode Details
    const barcodeValue = '325440';
    const userName = 'Administrator Working dev1';
    const date = new Date().toLocaleDateString();

    // ✅ Generate barcode as a Base64 image
    const barcodeImage = await this.generateBarcode(barcodeValue);


    // Convert watermark to a transparent image
    const transparentWatermark = await this.createTransparentWatermark(watermarkImage);

    for (let i = 0; i < pages.length; i++) {
      const pageElement = pages[i];
      const canvas = pageElement.querySelector('canvas') as HTMLCanvasElement;

      if (!canvas) {
        console.error('❌ No canvas found for PDF page', i + 1);
        continue;
      }

      // Convert canvas to image
      const imageData = canvas.toDataURL('image/png');

      // Get original PDF viewport dimensions
      const page = await this.pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1.0 });

      // Get actual canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Get jsPDF A4 size in mm
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm (A4 width)
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm (A4 height)

      // Scale factors
      const scaleX = pdfWidth / canvasWidth;
      const scaleY = pdfHeight / canvasHeight;

      // Add the page image to PDF
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);


      // Draw signatures on the page with correct scaling
      this.signatures
        .filter(sig => sig.page === i + 1) // Match signatures to the current page
        .forEach(sig => {
          // Convert signature position to PDF scale
          const sigX = sig.x * scaleX;
          const sigY = sig.y * scaleY;

          // Define the correct signature size
          const sigWidth = 100 * scaleX; // Adjust width dynamically
          const sigHeight = 50 * scaleY; // Adjust height dynamically

          pdf.addImage(sig.image, 'PNG', sigX, sigY, sigWidth, sigHeight);
        });

      // ✅ Add barcode on the first page only
      if (i === 0) {
        const boxX = 10; // Left margin
        const boxY = 10; // Top margin
        const boxWidth = 80; // Box width
        const boxHeight = 40; // Box height
  
        const barcodeX = boxX + 5; // Padding from left
        const barcodeY = boxY + 5; // Padding from top
        const barcodeWidth = 60; // Adjust width
        const barcodeHeight = 15; // Adjust height
  
        // ✅ Draw a background rectangle with a border
        pdf.setFillColor(240, 240, 240); // Light gray background
        pdf.setDrawColor(0, 0, 0); // Black border
        pdf.rect(boxX, boxY, boxWidth, boxHeight, 'FD'); // 'FD' = Fill & Draw border
  
        // ✅ Add barcode inside the box
        pdf.addImage(barcodeImage, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
  
        // ✅ Add text inside the box
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Barcode: ${barcodeValue}`, barcodeX, barcodeY + 18);
        pdf.text(`Name: ${userName}`, barcodeX, barcodeY + 23);
        pdf.text(`Date: ${date}`, barcodeX, barcodeY + 28);
      }

      // Add the watermark at the center of the page
      const watermarkWidth = pdfWidth * 0.6; // Scale watermark to 80% of page width
      const watermarkHeight = watermarkWidth * 0.35; // Maintain aspect ratio

      const watermarkX = (pdfWidth - watermarkWidth) / 2; // Center horizontally
      const watermarkY = (pdfHeight - watermarkHeight) / 2; // Center vertically

      pdf.addImage(transparentWatermark, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
    }

    // Save the PDF
    pdf.save('signed-document.pdf');
  }

  async createTransparentWatermark(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.crossOrigin = 'Anonymous'; // Prevent CORS issues

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.globalAlpha = 0.19; // Set transparency (0.1 - 0.5 for light watermark)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => reject(err);
    });
  }

  async generateBarcode(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, value, {
        format: 'CODE128',
        displayValue: false, // Hide text below barcode
        width: 2,
        height: 40,
      });

      resolve(canvas.toDataURL('image/png'));
    });
  }


}
