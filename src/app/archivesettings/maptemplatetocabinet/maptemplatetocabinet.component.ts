import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from '../../_service/gacfile.service';
import { GACFiledto } from '../../_models/gacfiledto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-maptemplatetocabinet',
  templateUrl: './maptemplatetocabinet.component.html',
  styleUrls: ['./maptemplatetocabinet.component.css']
})
export class MaptemplatetocabinetComponent implements OnInit {
  MapTemplateSearch:string = "";
  _CabinetArray:any;
  _CabinetJson:any;
  _TemplateJson:any;
  _TemplateArray:any;
  _MapJson:any [] = [];
  obj:GACFiledto;
  Cabineterrormessage:boolean=false;
  Templateerrormessage:boolean = false;
  prefixerrormessage:boolean = false;
  Barcodeerrormessage:boolean = false;
  autoIncrementerrormessage:boolean = false;
  Barcodesequence:string = "";
  prefix:string = "";
  autoIncrementValue:number;
  currentLang:"ar"|"en"="ar";
  SearchTemp:string = "";
  SelectCabinet:string = "";
  SelectTemplate:string = "";
  Enterprefix:string = "";
  Enternumber:string = "";
  constructor(private service:GACFileService,private _snackBar: MatSnackBar,
    private translate:TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    this.obj = new GACFiledto();
       HeaderComponent.languageChanged.subscribe((lang)=>{
          localStorage.setItem('language',lang);
          this.translate.use(lang);
          this.currentLang = lang ? lang : 'en';
        this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        this.SearchTemp = lang === 'en' ? 'Search...' : 'يبحث...';
         this.SelectCabinet = lang === 'en' ? 'Select Cabinet' : 'حدد الخزانة';
          this.SelectTemplate = lang === 'en' ? 'Select Template' : 'حدد القالب';
           this.Enterprefix = lang === 'en' ? 'Enter prefix' : 'أدخل البادئة';
            this.Enternumber = lang === 'en' ? 'Enter number' : 'أدخل الرقم';
        if(lang == 'ar'){
          this.renderer.addClass(document.body, 'kt-body-arabic');
        }else if (lang == 'en'){
          this.renderer.removeClass(document.body, 'kt-body-arabic');
        }
           });
   }

  ngOnInit(): void {
    // HeaderComponent.languageChanged.subscribe((lang)=>{
      const lang: any = localStorage.getItem('language');
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SearchTemp = lang === 'en' ? 'Search...' : 'يبحث...';
     this.SelectCabinet = lang === 'en' ? 'Select Cabinet' : 'حدد الخزانة';
      this.SelectTemplate = lang === 'en' ? 'Select Template' : 'حدد القالب';
       this.Enterprefix = lang === 'en' ? 'Enter prefix' : 'أدخل البادئة';
        this.Enternumber = lang === 'en' ? 'Enter number' : 'أدخل الرقم';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
      //  });
    this.CabinetAndTemplateList();
    this.GetMappedTemplatesList();
  }

  CabinetAndTemplateList(){
    this.service.MapTemplatetoCabinetListAPI().subscribe(data => {
      console.log(data , "Cabinet list");
      this._CabinetJson = data['Data'].CabinetJson;
      this._TemplateJson = data['Data'].TemplateJson;
    })
  }

  GetMappedTemplatesList(){
    this.service.GetMappedTemplatesListAPI().subscribe(data =>{
      this._MapJson = data['Data'].MapJson;
      console.log(data,"GetMappedTemplatesList Data");
    })
  }


  // AddMapTemplate(){
  //   if(this._CabinetArray == undefined || this._TemplateArray == undefined || this.Barcodesequence == ""){
  //     this.Cabineterrormessage = true;
  //     this.Templateerrormessage = true;
  //     this.Barcodeerrormessage = true;
  //   }else if(this._CabinetArray != undefined || this._TemplateArray == undefined || this.Barcodesequence == "" ) {
  //     this.Cabineterrormessage = false;
  //     this.Templateerrormessage = false;
  //     this.Barcodeerrormessage = false;
  //     this.obj.TemplateId = this._TemplateArray.toString();
  //     this.obj.CabinetId = this._CabinetArray.toString();
  //     this.obj.BarcodeSequence = this.Barcodesequence;
  //     this.service.AddMapTemplateAPI(this.obj).subscribe(data => {
  //       console.log(data ,"Add MapTemplate Data");
        
  //       if(data['Message'] == '1'){
  //         this._snackBar.open(('Added Successfully'), 'End now', {
  //           duration: 5000,
  //           verticalPosition: 'bottom',
  //           horizontalPosition: 'right',
  //         });
  //         this.ClearTemplate();
  //         this.GetMappedTemplatesList()
  //       }else if(data['Message'] == '2'){
  //         alert('for Template Already Mapped to Cabinet');
  //       }else if(data['Message'] == '3'){
  //         alert('for Barcode Sequence already exist');
  //       }

  //     })
  //   }
  //   }
   
  AddMapTemplate() {
    
    if (!this._CabinetArray || !this._TemplateArray || !this.prefix || !this.autoIncrementValue) {
      this.Cabineterrormessage = !this._CabinetArray;
      this.Templateerrormessage = !this._TemplateArray;
       this.prefixerrormessage = !this.prefix;
       this.autoIncrementerrormessage = !this.autoIncrementValue;
      return; // Stop execution if validation fails
    } 
  
    // Reset error messages
    this.Cabineterrormessage = false;
    this.Templateerrormessage = false;
    this.prefixerrormessage = false;
    this.autoIncrementerrormessage = false;
  
    // Prepare request object
    this.obj.TemplateId = this._TemplateArray.toString();
        this.obj.CabinetId = this._CabinetArray.toString();
        this.obj.BarcodeSequence = this.autoIncrementValue;
        this.obj.Prefix = this.prefix;
  
    // Call API
    this.service.AddMapTemplateAPI(this.obj).subscribe(data => {
      console.log("Add MapTemplate Data:", data);
  
      switch (data['Message']) {
        case '1':
          this._snackBar.open('Added Successfully', 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.template_cabin_map_close();
          this.GetMappedTemplatesList();
          break;
        case '2':
          alert('Template is already mapped to the cabinet.');
          break;
        case '3':
          alert('Barcode sequence already exists.');
          break;
        default:
          alert('An unknown error occurred.');
      }
    }, error => {
      console.error("API Error:", error);
      alert('An error occurred while adding the template.');
    });
  }
  
  ClearSearch(){
    this.MapTemplateSearch = "";
  }

  // ClearTemplate(){
  //   this._TemplateArray = null;
  //   this._CabinetArray = null;
  //   this.Barcodesequence = "";
  //   this.Cabineterrormessage = false;
  //   this.Templateerrormessage = false;
  //   this.Barcodeerrormessage = false;
  //   document.getElementById("template_cabin_map").classList.remove("kt-quick-panel--on");
  //   document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
  //   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  // }


  template_cabin_map_open() {
    document.getElementById("template_cabin_map").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  template_cabin_map_close() {
    this._TemplateArray = null;
    this._CabinetArray = null;
    // this.Barcodesequence = "";
    this.prefix = "";
    this.autoIncrementValue = null;
    this.Cabineterrormessage = false;
    this.Templateerrormessage = false;
    this.prefixerrormessage = false;
    this.autoIncrementerrormessage = false;
    this.Barcodeerrormessage = false;
    document.getElementById("template_cabin_map").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
}
