import { Component, OnInit, ChangeDetectorRef, Renderer2, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { DocumentTypeService } from "src/app/_service/document-type.service";
import { DocumentTypeDTO } from "src/app/_models/document-type-dto.model";
import { AlertService } from 'src/app/_service/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { data } from 'jquery';
import tippy from 'tippy.js';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
interface IStatus {
  value: boolean;
  viewValue: string;
}
@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.css']
})
export class DocumentTypeComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _DocTypeList:any[] = []
  message: string;
  isShow: boolean;
  DocumentTypeId: number;
  checked = false;
  String_status: string;
  Active = true;
  InActive = false;
  DocumentTypeSearch:string;
  objvalues_DocTypeDto: DocumentTypeDTO;
  selectedValue: string;
  currentLang:"ar"|"en"="ar";
  DocTypeFormgroup: UntypedFormGroup;
  DocumentTypeNameMinLength: boolean;
  // loadComponent: boolean;
  Status: IStatus[] = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' },
  ];
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  DocumentTypeSearchs:string;
  EnterDocumentTypeName:string;
  EnterDescription:string;
  constructor(public service: DocumentTypeService, private objFormBuilder: UntypedFormBuilder,
    public alertService: AlertService, private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private renderer: Renderer2,
private translate:TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.DocumentTypeSearchs = lang === 'en' ? 'Search' : 'سيراتش';
  this.EnterDocumentTypeName = lang === 'en' ? 'Enter DocumentType Name' : 'أدخل اسم نوع المستند';
  this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
  let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Document Type Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم نوع المستند';
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#TippyDocumentTypeName', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
    this.objvalues_DocTypeDto = new DocumentTypeDTO();
    this.isShow = false;
    // this.loadComponent = true;
  }
  // reloadComponent() {
  //   let currentUrl = this.router.url;
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //     this.router.navigate([currentUrl]);
  //   });
  // }
  dtOptions: any = {};
  ngOnInit() {
    let lang: any = localStorage.getItem('language');
this.translate.use(lang);
this.DocumentTypeSearchs = lang === 'en' ? 'Search' : 'سيراتش';
this.EnterDocumentTypeName = lang === 'en' ? 'Enter DocumentType Name' : 'أدخل اسم نوع المستند';
this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.activePage = 1;
    this.GetDocTypeList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    this.DocumentTypeNameMinLength = true;
    this.DocTypeFormgroup = this.objFormBuilder.group({
      'docName': new UntypedFormControl('', [Validators.required]),
      'note': new UntypedFormControl,
      'status': new UntypedFormControl
    });
    // tippy('#myButton', {
    //   content: "Enter Document Type Name",
    //   arrow: true,
    //   animation: 'scale-extreme',
    //   //animation: 'tada',
    //   // theme: 'tomato',
    //   animateFill: true,
    //   inertia: true,
    // });

    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Document Type Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم نوع المستند';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#TippyDocumentTypeName', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }
  get f() {
    return this.DocTypeFormgroup.controls;
  }
  checkDocumentExits() {
    this.objvalues_DocTypeDto.DocumentTypeName = (<HTMLInputElement>document.getElementById("txtdocumentname")).value;
    if (this.objvalues_DocTypeDto.DocumentTypeName.trim().length < 3) {
      this.DocumentTypeNameMinLength = false;
    } else {
      this.DocumentTypeNameMinLength = true;
    }
  }
  OnCreate() {
    // this.loadComponent = false;
    try {
      if (this.DocTypeFormgroup.invalid) {
        return;
      }
      this.objvalues_DocTypeDto.DocumentTypeId = this.service.objDocTypeDTO.DocumentTypeId;
      this.objvalues_DocTypeDto.DocumentTypeName = this.DocTypeFormgroup.get('docName').value;
      this.objvalues_DocTypeDto.Description = this.DocTypeFormgroup.get('note').value;
      if (this.objvalues_DocTypeDto.Description == null) {
        this.objvalues_DocTypeDto.Description = "";
      }
      if (this.DocTypeFormgroup.get('status').value == undefined) {
        this.objvalues_DocTypeDto.IsActive = false;
      }
      else {
        this.objvalues_DocTypeDto.IsActive = this.DocTypeFormgroup.get('status').value;
      }
      if (this.objvalues_DocTypeDto.DocumentTypeId == undefined || this.objvalues_DocTypeDto.DocumentTypeId == 0) {
        this.objvalues_DocTypeDto.FlagId = 1;
      } else if (this.objvalues_DocTypeDto.DocumentTypeId != 0) {
        this.objvalues_DocTypeDto.FlagId = 2;
      }
      this.service.sendDocTypedata(this.objvalues_DocTypeDto).subscribe(
        data => {
          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
          }
          else if (data["message"] == "2") {
            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
          }
          // document.getElementById("addrck").style.display = "none";
          // document.getElementById("document_add").style.display = "block";
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.GetDocTypeList();
          // this.reloadComponent();
          this.DocTypeFormgroup.reset();
          this.service.objDocTypeDTO.DocumentTypeId = 0;
        });
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }
  ResetForm() {
    this.DocTypeFormgroup.reset();
    this.service.objDocTypeDTO.DocumentTypeId = 0;
  }
  // getDocTypeData() {
  //   this.service.getDocTypeData();
  //   this.loadComponent = true;
  // }

  GetDocTypeList() {
    this.service.getDocTypeData_2().subscribe(data => {
      this._DocTypeList = data as DocumentTypeDTO[];
     
      //this.dtTrigger.next()
    });
  }
  ReBindData(){
    this.DocumentTypeSearch = "";
    this.GetDocTypeList();
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    this.LastPage = (this.TotalRecords/this.PageSize)
   if(this.activePage == 1){
     this.NextPage = false;
    } else{
    this.NextPage = true;
    }
    // this.GetUserList();
   
  }
  document_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("document_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
    this.isShow = false;
    this.DocumentTypeNameMinLength = true;
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  populateForm(f1: DocumentTypeDTO) {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("document_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Edit Document";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.EditDocument");
    }
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.service.objDocTypeDTO = Object.assign({}, f1);
    this.isShow = true;
  }
  document_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("document_add").style.display = "block";
    this.DocTypeFormgroup.reset();
    this.service.objDocTypeDTO.DocumentTypeId = 0;
    this.isShow = false;
  }
  
  UpdateStatus(Obj_Status: DocumentTypeDTO) {
    if (Obj_Status.IsActive === true) {
      this.String_status = "In-Active"
    }
    else {
      this.String_status = "Active"
    }
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm ',
        message: this.String_status
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        if (Obj_Status.IsActive === true) {
          Obj_Status.IsActive = false;
          this.InActive;
        }
        else {
          Obj_Status.IsActive = true;
        }
        this.service.UpDate_Status(Obj_Status);
      }
    });
  }

  
  closeInfo() {
     this.DocTypeFormgroup.reset();
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";
  }
}
