import { Component, OnInit, Renderer2,Inject } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.component.html',
  styleUrls: ['./generate-barcode.component.css']
})
export class GenerateBarcodeComponent implements OnInit {
  selectedOption: string = 'option1';
  obj:GACFiledto;
  BarCodeListJson :any[];
  BarcodeSearch:string;
  currentLang: "ar" | "en" = "ar";
  constructor(public service: GACFileService,
    private translate: TranslateService,
        @Inject(DOCUMENT) private document: Document,
            private renderer: Renderer2,
  ) { 
this.obj = new GACFiledto();
HeaderComponent.languageChanged.subscribe((lang) => {
  localStorage.setItem('language', lang);
  this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.BarcodeSearch = lang === 'en' ? 'Search...' : 'يبحث...';
  // this.Entercabinetname = lang === 'en' ? 'Enter cabinet name' : 'أدخل اسم الخزانة'

  if (lang == 'ar') {
    this.renderer.addClass(document.body, 'kt-body-arabic');
  } else if (lang == 'en') {
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
  const editElement = document.getElementById("editrck");
  if (editElement) {
    editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
  }
});
  }
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
      // HeaderComponent.languageChanged.subscribe((lang) => {
        const lang: any = localStorage.getItem('language');
        this.translate.use(lang);
        localStorage.setItem('language', lang);
        this.translate.use(lang);
        this.currentLang = lang ? lang : 'en';
        this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        this.BarcodeSearch = lang === 'en' ? 'Search...' : 'يبحث...';
        // this.Entercabinetname = lang === 'en' ? 'Enter cabinet name' : 'أدخل اسم الخزانة'
    
        if (lang == 'ar') {
          this.renderer.addClass(document.body, 'kt-body-arabic');
        } else if (lang == 'en') {
          this.renderer.removeClass(document.body, 'kt-body-arabic');
        }
        const editElement = document.getElementById("editrck");
        if (editElement) {
          editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
        }
    this.BarCodeList();
  }

  BarCodeList(){
    this.service.BarcodeListAPI().subscribe(data => {
      console.log(data , "Barcodelist");
      this.BarCodeListJson = data['Data'].BarcodeJson;
      console.log(this.BarCodeListJson,"BarcodeList");
    })
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
