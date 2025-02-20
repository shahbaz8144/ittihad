import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MapDocumentService } from 'src/app/_service/map-document.service';
import { MapDocumentDTO } from 'src/app/_models/map-document-dto';
import tippy from 'tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-map-document-type-to-source',
  templateUrl: './map-document-type-to-source.component.html',
  styleUrls: ['./map-document-type-to-source.component.css']
})
export class MapDocumentTypeToSourceComponent implements OnInit {
  objValues_DTO: MapDocumentDTO;
  JsonString_List: string;
  Xml_List: string;
  ObjList: any;
  _documentTypeLst: any;
  _mappeddocumenttypelst: any;
  selectedSourceValue: number
  panelOpenState = false;
  SelectItems: string[];
  DocTypeListFromService: [];


  selectedItemList = [];
  selectedItem_List2 = [];
  checkedIDs = [];

  currentLang:"ar"|"en"="ar";
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  SelectSource:string;
  constructor(public service: MapDocumentService,
    private renderer: Renderer2,
      private translate:TranslateService,
          @Inject(DOCUMENT) private document: Document,
  ) {
    this.objValues_DTO = new MapDocumentDTO();
    this.selectedSourceValue = 0;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SelectSource = lang === 'en' ? 'Select Source' : 'اختر مصدر';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Search Source For Mapping';
    } else if (lang === 'ar') {
      tooltipContent = 'البحث عن المصدر للتعيين';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#SourceForMapping', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
  }
  ngOnInit() {
    let lang: any = localStorage.getItem('language');
    this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    this.service.GetSourceData();
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Search Source For Mapping';
    } else if (lang === 'ar') {
      tooltipContent = 'البحث عن المصدر للتعيين';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#SourceForMapping', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }
  //Source DropDown Change
  OnSourceChange(sourceid: number) {
    
    this.selectedSourceValue = sourceid;
    this.service.GetMapDocumentTypestoSource(sourceid).subscribe(
      (data) => {
        
        this.objValues_DTO = data as MapDocumentDTO;
        this._documentTypeLst = JSON.parse(this.objValues_DTO.DocumentTypeJson);
        this._mappeddocumenttypelst = JSON.parse(this.objValues_DTO.DocumentTypeMappedJson);
      }
    );
    this.selectedItemList = [];
    this.selectedItem_List2 = [];
  }
  //Button Click---> Mapping
  Btn_Mapvalues(sourceid: number) {
    
    //Json Conversion
    this.JsonString_List = JSON.stringify(this.selectedItemList);
    //Object Conversion
    this.ObjList = Object.assign({}, this.selectedItemList);
    //Assigning To DTO
    this.objValues_DTO.mapdocumenttypesxml = this.ObjList;
    //Passing To Service
    this.service.NewMapDocumentTypestoSource(this.objValues_DTO).subscribe(data => {
      this.objValues_DTO = data as MapDocumentDTO;
      if (this.objValues_DTO.message == "1") {
        this.service.GetMapDocumentTypestoSource(this.selectedSourceValue).
          subscribe(
            (data) => {
              
              this.objValues_DTO = data as MapDocumentDTO;
              this._documentTypeLst = JSON.parse(this.objValues_DTO.DocumentTypeJson);
              this._mappeddocumenttypelst = JSON.parse(this.objValues_DTO.DocumentTypeMappedJson);
            }
          );
      }
    });
  }
  Btn_UnMappedvalues(sourceid: number) {

    console.log("List-2 ====>", this.selectedItem_List2);
    //Json Conversion
    this.JsonString_List = JSON.stringify(this.selectedItem_List2);
    //Object Conversion
    this.ObjList = Object.assign({}, this.selectedItem_List2)
    //Assigning To DTO-Parameter
    this.objValues_DTO.updatedocumenttypesxml = this.ObjList;
    //Passing To Service
    this.service.UpdateMapDocumentTypestoSource(this.objValues_DTO).subscribe(data => {
      this.objValues_DTO = data as MapDocumentDTO;
      if (this.objValues_DTO.message == "1") {
        this.service.GetMapDocumentTypestoSource(this.selectedSourceValue).
          subscribe(
            (data) => {
              this.objValues_DTO = data as MapDocumentDTO;
              this._documentTypeLst = JSON.parse(this.objValues_DTO.DocumentTypeJson);
              this._mappeddocumenttypelst = JSON.parse(this.objValues_DTO.DocumentTypeMappedJson);
            }
          );
      }
    });
  }
  //Button Mapping
  Mapping_changeSelection() {
    this.selectedItemList = this._documentTypeLst.filter((value, index) => {
      return value.checked == true;
    })
  }
  //Button UnMapping 
  UnMapping_changeSelection() {
    this.selectedItem_List2 = this._mappeddocumenttypelst.filter((value, index) => {
      return value.checked == true;
    })
  }
  fetchCheckedIds() {
    this.checkedIDs = [];
    this._documentTypeLst.forEach((value, index) => {
      if (value.DocumentTypeId) {
        this.checkedIDs.push(value.DocumentTypeId);
      }
    });
  }
  //Check All --Event
  master_change(value) {
    if (value.checked == true) {
      
      this._documentTypeLst.forEach(element => {
        // this.selectedItem_List2.push
        if (element.chkdisable == "false")
          element.checked = true;
      });
      this.selectedItemList = this._documentTypeLst.filter(x=>x.chkdisable=="false");
    }
    else {
      
      this._documentTypeLst.forEach(element => {
        // this.selectedItem_List2.push
        if (element.chkdisable == "false")
          element.checked = false;
      });
      this.selectedItemList = [];
    }
    // for (let value of Object.values(this._documentTypeLst)) {
    //   value['checked'] = this.master_checked;
    // }
  }

}
