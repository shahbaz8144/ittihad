import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { read, utils } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ThumbnailService {
  constructor() {}

  async generateThumbnail(file: File): Promise<Blob> {
    const fileType = file.type || (file.name.split('.').pop()?.toLowerCase() || '');

    // Handle different file types
    if (fileType.startsWith('image/')) {
      return this.generateImageThumbnail(file);
    } else if (fileType === 'application/pdf') {
      return this.generatePdfThumbnail(file);
    } else if (['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType)) {
      return this.generateWordThumbnail(file);
    } else if (['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(fileType)) {
      return this.generateExcelThumbnail(file);
    } else if (['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(fileType)) {
      return this.generatePptThumbnail(file);
    } else if (fileType === 'text/plain') {
      return this.generateTextThumbnail(file);
    } else if (fileType === 'text/html') {
      return this.generateHtmlThumbnail(file);
    } else {
      throw new Error('Unsupported file type for thumbnail generation.');
    }
  }

  // 1. Image Thumbnail
  private async generateImageThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Failed to get canvas context');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        image.onload = () => {
          const maxWidth = 100;
          const maxHeight = 100;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          canvas.toBlob((blob) => {
            blob ? resolve(blob) : reject('Failed to create thumbnail');
          }, 'image/png');
        };

        image.src = reader.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 2. PDF Thumbnail
  private async generatePdfThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfData = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(pdfData).promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 0.5 }); // Scale down the PDF
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject('Failed to get canvas context');
            return;
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          canvas.toBlob((blob) => {
            blob ? resolve(blob) : reject('Failed to create PDF thumbnail');
          }, 'image/png');
        } catch (error) {
          reject('Error processing PDF file: ' + error.message);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // 3. Word Thumbnail (Placeholder Image)
  private async generateWordThumbnail(file: File): Promise<Blob> {
    // Placeholder logic for Word documents
    return this.createPlaceholderThumbnail('DOCX');
  }

  // 4. Excel Thumbnail (Placeholder Image)
  private async generateExcelThumbnail(file: File): Promise<Blob> {
    // Placeholder logic for Excel documents
    return this.createPlaceholderThumbnail('XLSX');
  }

  // 5. PowerPoint Thumbnail (Placeholder Image)
  private async generatePptThumbnail(file: File): Promise<Blob> {
    // Placeholder logic for PowerPoint documents
    return this.createPlaceholderThumbnail('PPTX');
  }

  // 6. Text File Thumbnail
  private async generateTextThumbnail(file: File): Promise<Blob> {
    return this.createPlaceholderThumbnail('TXT');
  }

  // 7. HTML File Thumbnail
  private async generateHtmlThumbnail(file: File): Promise<Blob> {
    return this.createPlaceholderThumbnail('HTML');
  }

  // Placeholder Thumbnail (Generic for Unsupported Formats)
  private async createPlaceholderThumbnail(label: string): Promise<Blob> {
    return new Promise((resolve) => {
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

        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      }
    });
  }
}
