import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { SpecializationDTO } from 'src/app/_models/specialization-dto';
import { SpecializationserviceService } from 'src/app/_service/specializationservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import tippy from 'tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.css']
})
export class SpecializationComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  SpecializationId: number;
  Specialization: string;
  Description: string;
  IsActive: boolean;
  OrganizationId: boolean;
  CreatedBy: number;
  FlagId: number;
  specializationSearch:string;
  lstPrdcts: any;
  isShow: boolean;
  String_status: string;
  specilization: string;
  note: string;
  InActive: boolean;
  objSpecialization: SpecializationDTO
  _obj: SpecializationDTO;
  ObjSpecialization_data: [];
  MinSpecializationLength: boolean;
  index: any;
  SpecializationFrmGroup: UntypedFormGroup;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  _CurrentpageRecords:number;
  currentLang:"ar"|"en"="ar";
  SpecializationSearchs:string;
  EnterSpecializationName:string;
  EnterDescription:string;
  constructor(public service: SpecializationserviceService, 
    private objFormBuilder: UntypedFormBuilder,
     private _snackBar: MatSnackBar,
      private dialog: MatDialog,
      private renderer: Renderer2,
      private translate:TranslateService,
          @Inject(DOCUMENT) private document: Document,
    ) {
    this._obj = new SpecializationDTO();
    this.objSpecialization = new SpecializationDTO();
    this.lstPrdcts = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SpecializationSearchs = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterSpecializationName = lang === 'en' ? 'Enter SpecializationName' : 'أدخل اسم التخصص';
    this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Specialization Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم التخصص';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterSpecialization', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })

  }

  dtOptions: any = {};
  ngOnInit(): void {
    let lang: any = localStorage.getItem('language');
    this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.SpecializationSearchs = lang === 'en' ? 'Search' : 'يبحث';
      this.EnterSpecializationName = lang === 'en' ? 'Enter SpecializationName' : 'أدخل اسم التخصص';
      this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف'
    this.activePage = 1;
    //document.getElementById("kt_header").style.display = "flex";

    this.MinSpecializationLength = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    this.getSpecializationList();
    this.service._obj.Specialization = "";
    this.service._obj.Description = "";
    this.service._obj.IsActive = false;
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Specialization Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم التخصص';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterSpecialization', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }

  ReBindData(){
    this.specializationSearch = "";
    this.getSpecializationList();
  }
  specialization_add() {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    
    //   document.getElementById("remove_btn").style.display = "block";
    //    document.getElementById("remove_btn").classList.add("crossRotate");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }

  }
  specialization_edit(item: SpecializationDTO) {
    
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");

    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    // document.getElementById("remove_btn").style.display = "block";
    //  document.getElementById("remove_btn").classList.add("crossRotate");
    this.objSpecialization.SpecializationId = item.SpecializationId;
    this.SpecializationId = item.SpecializationId;
    this.specilization = item.Specialization;
    this.note = item.Description;
    this.InActive = item.IsActive;
    this.isShow = true;

  }
  specialization_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    
    
    // document.getElementById("remove_btn").style.display = "none";
    //document.getElementById("specialization_add").classList.add("crossRotate");
    this.SpecializationId = 0;
    // this.Specialization = "";
    // this.Description = "";
    // this.IsActive = false;
    // this.isShow = false;
    this.specilization = "";
    this.note = "";
    this.InActive = false;
    this.isShow = false

  }
  getSpecializationList() {
  
    this.service.GetSpecializationList(this._obj).subscribe(data => {
      this.ObjSpecialization_data = data as [];
      this.dtTrigger.next(this.dtOptions)
    })
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
  get f() {
    return this.SpecializationFrmGroup.controls;
  }
  OnCreate() {
    try {
      this.objSpecialization.SpecializationId = this.SpecializationId
      this.objSpecialization.Specialization = this.specilization;
      this.objSpecialization.Description = this.note;
      this.objSpecialization.IsActive = this.InActive;
      if (this._obj.Description == null) {
        this._obj.Description = "";
      }
      else {
        this.objSpecialization.Description = this.note;
      }
      if (this._obj.IsActive == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.InActive;
      }

      if (this.SpecializationId == undefined || this.SpecializationId == 0) {
        this.objSpecialization.FlagId = 1;
      } else if (this.SpecializationId != 0) {
        this.objSpecialization.FlagId = 2;
      }
      this.service.Specialization_add(this.objSpecialization).subscribe(
        (data) => {
          console.log(data)

          if (data["message"] == "1") {

            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.getSpecializationList()

          }
          else if (data["message"] == "2") {
            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.getSpecializationList()
          }
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.Reset();
          this.isShow = false;
          this.SpecializationId=0;
          // this.dtOptions = {
          //   pagingType: 'full_numbers',
          //   pageLength: 5,
          //   lengthMenu: [5, 10, 25],
          //   processing: true,
          //   order: []
          // };
          // jQuery('.dataTable').DataTable().destroy();
          // jQuery('.dataTable').DataTable({
          //   searching: false
          // });
          // this.service.GetSpecializationList(this._obj).subscribe(data => {
          //   this.ObjSpecialization_data = data as [];
          //   this.dtTrigger.next(this.dtOptions)
          // });
        }

      );
    } catch (error) {
      alert(error)
    }

  }
  Reset() {
    this.specilization = "";
    this.note = "";
    this.InActive = false;
    this.isShow = false
  }
  UpdateStatus(Obj_Status: SpecializationDTO) {

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
        this.service.UpDatedialog_Status(Obj_Status);
      }
    });
  }
  CheckSpecialization() {

    let checkSpc = (<HTMLInputElement>document.getElementById("checkSpc")).value;
    this.service.checkSpecializationName(checkSpc)
      .subscribe(data => {

        this._obj = data as SpecializationDTO;
        if (this._obj.message != "1") {
          (<HTMLInputElement>document.getElementById("checkSpc")).value = "";
          this._snackBar.open('Specialization Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        }
      })
  }
  TriggerLengthValidation() {
    if (this.specilization.trim().length < 1) {

      this.MinSpecializationLength = false;
    }
    else {

      this.MinSpecializationLength = true;
    }
  }

  
  closeInfo() {
    this.Reset();
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
}
