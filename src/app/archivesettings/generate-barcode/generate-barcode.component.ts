import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.component.html',
  styleUrls: ['./generate-barcode.component.css']
})
export class GenerateBarcodeComponent implements OnInit {
  selectedOption: string = 'option1';
  constructor() { }
  togglebarcode(option: string) {
    this.selectedOption = option;
  }
  ngOnInit(): void {
    
  }
  generate_barcode_open() {
    document.getElementById("generate_barcode").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  generate_barcode_close() {
    document.getElementById("generate_barcode").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
}
