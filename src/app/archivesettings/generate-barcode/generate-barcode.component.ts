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
    // Add event listener for the edit button click to add 'active' class
    document.querySelectorAll('.barcode-edit').forEach(function(editButton) {
      editButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and add 'active' class
        var barcodeSeqItem = editButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.add('active');
        }
      });
    });

    // Add event listener for the submit button to remove 'active' class
    document.querySelectorAll('.btn-chng').forEach(function(submitButton) {
      submitButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and remove 'active' class
        var barcodeSeqItem = submitButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.remove('active');
        }
      });
    });

    // Add event listener for the cancel button to remove 'active' class
    document.querySelectorAll('.btn-cncl').forEach(function(cancelButton) {
      cancelButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and remove 'active' class
        var barcodeSeqItem = cancelButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.remove('active');
        }
      });
    });
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
