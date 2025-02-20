import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const anchorTags = tempDiv.getElementsByTagName('a');
    for (let i = 0; i < anchorTags.length; i++) {
      anchorTags[i].setAttribute('target', '_blank');
    }
    return this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }
}
