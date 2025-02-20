import { Directive, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appTrimSpaces]'  // Use a selector that suits your naming conventions
})
export class TrimSpacesDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.trimValue();
  }

  @HostListener('input') onInput() {
    this.trimValue();
  }

  private trimValue() {
    const value = this.el.nativeElement.value;
    const trimmedValue = value.replace(/^\s+/, ''); // Remove leading spaces
    alert(trimmedValue)
    if (value !== trimmedValue) {
      this.renderer.setProperty(this.el.nativeElement, 'value', trimmedValue);
    }
  }
}
