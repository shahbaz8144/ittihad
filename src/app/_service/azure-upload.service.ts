import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min';
import * as XLSX from 'xlsx';
import { renderAsync } from 'docx-preview';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as JsBarcode from 'jsbarcode';
import { format } from 'date-fns';

// import { Buffer } from 'buffer';
// (window as any).Buffer = Buffer; // Make Buffer globally available
// import * as mammoth from 'mammoth';

@Injectable({
  providedIn: 'root',
})
export class AzureUploadService {
  private sasToken: string = ''; // Backend-provided SAS token
  private apiUrl = 'https://cswebapps.com/dmscoretestapi/api/FileUploadAPI/NewGenerateSASToken'; // Backend endpoint
  private expiryTime: number = 0;
  blobUrl: any;

  constructor(private http: HttpClient) {
    // Configure the worker source
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.min.js';
  }

  // Get SAS token from backend
  private async getSasToken(): Promise<string> {
    try {
      if (!this.sasToken || Date.now() > this.expiryTime) {
        const response: any = await firstValueFrom(this.http.post(this.apiUrl, {}));
        this.sasToken = response.sasToken;
        this.expiryTime = new Date(response.expiryTime).getTime();
        this.blobUrl = response.blobUrl;
      }
      return this.sasToken;
    } catch (error) {
      console.error('Error fetching SAS token:', error);
      throw new Error('Unable to fetch SAS token.');
    }
  }

  // Main upload function
  async uploadFile(file: File, progressSubject: BehaviorSubject<number>, folderPath: string, uniqueId: string | number,
    name: string
  ): Promise<{ fileUrl: string, thumbnailUrl?: string }> {
    try {
      const sasToken = await this.getSasToken();
      const containerUrl = this.blobUrl;
      const blobServiceClient = new BlobServiceClient(containerUrl);
      const containerClient = blobServiceClient.getContainerClient('');

      // Generate file name
      const blobName = `${folderPath}/${uniqueId}_${file.name}`;
      const blobClient = containerClient.getBlockBlobClient(blobName);

      const formattedDate = format(new Date(), 'dd/MM/yyyy');

      // If it's a PDF, add watermark before uploading
      const processedFile = file.type === 'application/pdf' ? await this.addWatermarkToPdf(file, name, formattedDate) : file;

      // Upload original file
      await blobClient.uploadData(processedFile, {
        blobHTTPHeaders: { blobContentType: file.type },
        // onProgress: (progress) => {
        //   const percentDone = Math.round((100 * progress.loadedBytes) / (progress.total ?? 1));
        //   progressSubject.next(percentDone);
        // },
        onProgress: (progress) => {
          if (file.size > 0) { // Ensure we don't divide by zero
            const percentDone = Math.round((100 * progress.loadedBytes) / file.size);
            progressSubject.next(percentDone);
          }
        },
      });

      let thumbnailUrl: string | undefined;

      // Generate and upload thumbnail
      const thumbnailBlob = await this.generateThumbnail(file);
      let thumbnailName = '';
      if (thumbnailBlob) {
        thumbnailName = `thumbnails/${uniqueId}_thumb_${file.name}.png`;
        const thumbnailClient = containerClient.getBlockBlobClient(thumbnailName);
        await thumbnailClient.uploadData(thumbnailBlob, { blobHTTPHeaders: { blobContentType: 'image/png' } });
        thumbnailUrl = `${containerUrl}/${thumbnailName}`;
      }

      progressSubject.complete();
      return { fileUrl: blobName, thumbnailUrl: thumbnailName };
    } catch (error) {
      console.error('Error uploading file:', error);
      progressSubject.complete();
      throw error;
    }
  }

  // Add Watermark to PDF
  private async addWatermarkToPdf(file: File, name: string, date: string): Promise<Blob> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const pdfBytes = reader.result as ArrayBuffer;
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pages = pdfDoc.getPages();

          const firstPage = pages[0]; // Modify first page

          const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

          // Get PDF dimensions
          const { width, height } = firstPage.getSize();

          // Load watermark image (from assets folder)
          const imageUrl = 'assets/watermark/Progressive.png';
          const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
          const watermarkImage = await pdfDoc.embedPng(imageBytes);

          // Get watermark size
          const scaleFactor = 0.3; // Adjust size if needed
          const { width: imgWidth, height: imgHeight } = watermarkImage.scale(scaleFactor);

          // Apply watermark to all pages

          // //repeating watermark
          // pages.forEach((page) => {
          //   const { width, height } = page.getSize(); // Get PDF page size
          //   // Tile the watermark across the page
          //   for (let x = 0; x < width; x += imgWidth + 30) { // Adjust spacing
          //     for (let y = 0; y < height; y += imgHeight + 30) {
          //       page.drawImage(watermarkImage, {
          //         x,
          //         y,
          //         width: imgWidth,
          //         height: imgHeight,
          //         opacity: 0.2, // Transparent watermark
          //       });
          //     }
          //   }
          // });

          // //one time watermark in center
          // pages.forEach((page) => {
          //   const { width, height } = page.getSize(); // Get PDF page size
          //   page.drawImage(watermarkImage, {
          //     x: (width - imgWidth) / 2, // Center X
          //     y: (height - imgHeight) / 2, // Center Y
          //     width: imgWidth,
          //     height: imgHeight,
          //     opacity: 0.2, // Transparent watermark
          //   });
          // });

          // Apply watermark to all pages in a **vertical repeating pattern**
          pages.forEach((page) => {
            const { width, height } = page.getSize(); // Get PDF page size

            // Start watermarking from the **middle horizontally** and repeat it **vertically**
            const x = width / 2 - imgWidth / 2; // Center horizontally

            for (let y = 0; y < height; y += imgHeight + 20) { // Adjust vertical spacing
              page.drawImage(watermarkImage, {
                x,
                y,
                width: imgWidth,
                height: imgHeight,
                opacity: 0.2, // Transparent watermark
              });
            }
          });

          // Generate a barcode image
          const barcodeValue = "325440";//Math.floor(100000 + Math.random() * 900000).toString();
          const barcodeImage = await this.generateBarcode(barcodeValue, pdfDoc);

          // Adjust Box Size and Position (Make Smaller & Move Up)
          const boxWidth = 160;  // Smaller box
          const boxHeight = 70;  // Smaller box
          const boxX = 40;  // Left position
          const boxY = height - 30 - boxHeight;  // Move up

          firstPage.drawRectangle({
            x: boxX,
            y: boxY,
            width: boxWidth,
            height: boxHeight,
            color: rgb(0.9, 0.9, 0.9),
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });

          // Draw barcode image (Keep sharp)
          firstPage.drawImage(barcodeImage, {
            x: boxX + 10,
            y: boxY + 30,
            width: 120, // Reduce barcode width
            height: 20, // Reduce barcode height
          });

          // Draw text (Smaller font)
          firstPage.drawText(`Barcode: ${barcodeValue}`, { x: boxX + 10, y: boxY + 20, size: 7, font, color: rgb(0, 0, 0) });
          firstPage.drawText(`Name: ${name}`, { x: boxX + 10, y: boxY + 10, size: 7, font, color: rgb(0, 0, 0) });
          firstPage.drawText(`Date: ${date}`, { x: boxX + 10, y: boxY + 0, size: 7, font, color: rgb(0, 0, 0) });




          // Save modified PDF
          const modifiedPdfBytes = await pdfDoc.save();
          const watermarkedBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
          resolve(watermarkedBlob);
        } catch (error) {
          reject('Error processing PDF with watermark: ' + error.message);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Generate Barcode Image (High DPI for Clarity)
  private async generateBarcode(barcodeValue: string, pdfDoc: PDFDocument): Promise<any> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = 400; // High resolution width
      canvas.height = 150; // High resolution height

      JsBarcode(canvas, barcodeValue, {
        format: 'CODE128',
        width: 10, // Reduce barcode width per line
        height: 70, // Reduce barcode height
        displayValue: false,
        fontSize: 17, // Reduce font size of barcode number
        margin: 10,
      });

      canvas.toBlob(async (blob) => {
        const barcodeBytes = await blob!.arrayBuffer();
        const barcodeImage = await pdfDoc.embedPng(barcodeBytes);
        resolve(barcodeImage);
      });
    });
  }

  // Generate thumbnails for various file types
  private async generateThumbnail(file: File): Promise<Blob | null> {
    const fileType = file.type || (file.name.split('.').pop()?.toLowerCase() || '');

    if (fileType.startsWith('image/')) {
      return this.generateImageThumbnail(file);
    } else if (fileType === 'application/pdf') {
      return this.generatePdfThumbnail(file);
    } else if (['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType)) {
      // return this.generatePlaceholderThumbnail('DOCX');
      return this.generateDocxThumbnail(file);
    } else if (['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(fileType)) {
      return this.generateExcelThumbnail(file);
    } else if (['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(fileType)) {
      return this.generatePlaceholderThumbnail('PPTX');
    } else if (fileType === 'text/plain') {
      return this.generatePlaceholderThumbnail('TXT');
    } else if (fileType === 'text/html') {
      return this.generatePlaceholderThumbnail('HTML');
    } else {
      // For unknown file types, generate an image with the content type as text
      return this.generateContentTypeThumbnail(fileType);
    }
  }
  // Generate Common Thumbnail For Unknown File Types
  private async generateContentTypeThumbnail(fileType: string): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 100;
      canvas.height = 100;

      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Display the content type or "Unknown"
        const label = fileType ? fileType.split('/').pop()?.toUpperCase() || 'UNKNOWN' : 'UNKNOWN';
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);

        // Convert canvas content to Blob
        canvas.toBlob(blob => resolve(blob!), 'image/png');
      }
    });
  }

  // Generate image thumbnails
  private async generateImageThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject('Canvas not supported');

      const reader = new FileReader();
      reader.onload = () => {
        image.onload = () => {
          const maxSize = 100;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          canvas.toBlob(blob => blob ? resolve(blob) : reject('Failed to create thumbnail'), 'image/png');
        };

        image.src = reader.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Generate PDF thumbnails using PDF.js
  private async generatePdfThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfData = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(pdfData).promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return reject('Canvas not supported');

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;

          canvas.toBlob(blob => blob ? resolve(blob) : reject('Failed to create PDF thumbnail'), 'image/png');
        } catch (error) {
          reject('Error processing PDF file: ' + error.message);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  // Generate xlxs thumbnails using xlsx library
  private async generateExcelThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          // Read the Excel file and parse the first worksheet
          const workbook = XLSX.read(new Uint8Array(reader.result as ArrayBuffer), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const firstSheet = workbook.Sheets[firstSheetName];

          // Convert the first worksheet to an array of arrays
          const data = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 });

          // Create the canvas for thumbnail
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas not supported');

          canvas.width = 300; // Canvas width
          canvas.height = 150; // Canvas height

          // Draw background and set text styles
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';

          // Limit rows and columns for thumbnail
          const maxRows = 5;
          const maxCols = 5;
          const cellWidth = 50;
          const cellHeight = 20;

          // Render the data onto the canvas
          data.slice(0, maxRows).forEach((row: any[], rowIndex) => {
            row.slice(0, maxCols).forEach((cell, colIndex) => {
              const text = cell?.toString() || ''; // Convert cell to string if needed
              ctx.fillText(text, colIndex * cellWidth + 10, rowIndex * cellHeight + 20);
            });
          });

          // Convert canvas content to a Blob
          canvas.toBlob(blob => blob ? resolve(blob) : reject('Failed to create Excel thumbnail'), 'image/png');
        } catch (error) {
          reject('Error processing Excel file: ' + error.message);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Generate placeholder thumbnails for other file types
  private async generatePlaceholderThumbnail(label: string): Promise<Blob> {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 100;
      canvas.height = 100;

      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);
        canvas.toBlob(blob => resolve(blob!), 'image/png');
      }
    });
  }

  // // Generate Word document thumbnails
  // private async generateDocxThumbnail(file: File): Promise<Blob> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       try {
  //         const arrayBuffer = reader.result as ArrayBuffer;

  //         // Use Mammoth to extract raw text
  //         const result = await mammoth.extractRawText({ arrayBuffer });
  //         const textPreview = result.value.split('\n').slice(0, 10).join(' '); // Limit to 10 lines

  //         // Create a canvas
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         if (!ctx) return reject('Canvas not supported');

  //         canvas.width = 300; // Canvas width
  //         canvas.height = 150; // Canvas height

  //         // Draw background and text
  //         ctx.fillStyle = '#f5f5f5';
  //         ctx.fillRect(0, 0, canvas.width, canvas.height);
  //         ctx.fillStyle = '#000';
  //         ctx.font = '12px Arial';
  //         ctx.textAlign = 'left';

  //         const lines = this.wrapText(ctx, textPreview, 280);
  //         lines.forEach((line, index) => {
  //           ctx.fillText(line, 10, 20 + index * 15); // Adjust line spacing
  //         });

  //         // Convert canvas to Blob
  //         canvas.toBlob(
  //           (blob) => (blob ? resolve(blob) : reject('Failed to create DOCX thumbnail')),
  //           'image/png'
  //         );
  //       } catch (error) {
  //         reject('Error processing DOCX file: ' + error.message);
  //       }
  //     };

  //     reader.onerror = reject;
  //     reader.readAsArrayBuffer(file);
  //   });
  // }
  // // Helper function: Wrap text for canvas
  // private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  //   const words = text.split(' ');
  //   const lines: string[] = [];
  //   let currentLine = '';

  //   words.forEach((word) => {
  //     const testLine = `${currentLine} ${word}`.trim();
  //     const testWidth = ctx.measureText(testLine).width;

  //     if (testWidth > maxWidth && currentLine) {
  //       lines.push(currentLine);
  //       currentLine = word; // Start a new line
  //     } else {
  //       currentLine = testLine;
  //     }
  //   });

  //   if (currentLine) {
  //     lines.push(currentLine);
  //   }

  //   return lines;
  // }

  // Generate Word document thumbnails using `docx-preview`
  private async generateDocxThumbnail(file: File): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;

          // Create an off-screen container for rendering
          const container = document.createElement('div');
          container.style.width = '800px';
          container.style.height = 'auto';
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          document.body.appendChild(container);

          // Render DOCX to HTML inside container
          await renderAsync(arrayBuffer, container);

          // Convert the rendered content into an image
          setTimeout(async () => {
            const canvas = await html2canvas(container, { scale: 0.5 });
            document.body.removeChild(container);

            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject('Failed to create DOCX thumbnail');
            }, 'image/png');
          }, 1000);
        } catch (error) {
          reject('Error processing DOCX file: ' + error.message);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BlobServiceClient } from '@azure/storage-blob';
// import { firstValueFrom } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AzureUploadService {
//   private sasToken: string = ''; // Backend-provided SAS token
//   // private containerName: string = 'documents';
//   // private storageAccountName: string = 'yrglobaldocuments'; // Replace with your storage account name
//   private apiUrl = 'https://cswebapps.com/dmscoretestapi/api/FileUploadAPI/NewGenerateSASToken'; // Backend endpoint
//   private expiryTime: number = 0;
//   blobUrl: any;

//   constructor(private http: HttpClient) { }

//   // Method to get a new SAS token when required
//   private async getSasToken(): Promise<string> {
//     try {
//       if (!this.sasToken || Date.now() > this.expiryTime) {
//         const response: any = await firstValueFrom(this.http.post(this.apiUrl, {})); // POST to get SAS token
//         this.sasToken = response.sasToken;
//         this.expiryTime = new Date(response.expiryTime).getTime(); // Use ExpiryDate from the backend response
//         this.blobUrl = response.blobUrl; // Save BlobUrl from backend
//       }
//       return this.sasToken;
//     } catch (error) {
//       console.error('Error fetching SAS token:', error);
//       throw new Error('Unable to fetch SAS token. Please try again later.');
//     }
//   }

//   async uploadFile(file: File, progressSubject: BehaviorSubject<number>, folderPath: string, uniqueId: string | number): Promise<string> {
//     try {
//       const sasToken = await this.getSasToken();
//       const containerUrl = this.blobUrl;
//       const blobServiceClient = new BlobServiceClient(containerUrl);
//       const containerClient = blobServiceClient.getContainerClient('');
//       const blobName = `${folderPath}/${uniqueId + file.name}`; 
//       const blobClient = containerClient.getBlockBlobClient(blobName);
//       const uploadOptions = {
//         blobHTTPHeaders: { blobContentType: file.type }, // Set the correct MIME type
//         onProgress: (progress) => {
//           const percentDone = Math.round((100 * progress.loadedBytes) / progress.totalBytes);
//           progressSubject.next(percentDone);  // Update progress
//         },
//       };
//       await blobClient.uploadData(file, uploadOptions);
//       progressSubject.complete();
//       return blobName;
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       progressSubject.complete(); // Ensure completion on error as well
//     }
//   }
// }