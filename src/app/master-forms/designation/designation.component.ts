import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DesignationDTO } from 'src/app/_models/designation.dto';
import { Subject } from 'rxjs';
import { DesignationService } from 'src/app/_service/designation.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import tippy from 'node_modules/tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent implements OnInit {
  debugger
  dtTrigger: Subject<any> = new Subject<any>();
  Objdesignatin_data: any[] = []
  _obj: DesignationDTO
  displayedColumns = ['DesignationName', 'actions', 'action'];
  tabledata: MatTableDataSource<DesignationDTO>;
  DesignationFrmGroup: UntypedFormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  objDesignationDTO: DesignationDTO
  DesignationId: number;
  //objDesignation: DesignationDTO;
  submitted: boolean;
  Objdesignation_data: any;
  DesignationName: string;
  MinDesignationLength:boolean;

  index: any;
  isShow: boolean;
  String_status: string;
  InActive: boolean;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  Desigsearch:string = '';
  TotalrecordsList: any;
  _CurrentpageRecords: number;
  PageNumber:number;
  _Search: string;
  lastPagerecords:number;
  currentLang:"ar"|"en"="ar";
  EnterDesignationName:string;
  DesignationSearch:string;
  constructor(public service: DesignationService,
     private objFormBuilder: UntypedFormBuilder, private dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private translate:TranslateService,
      private renderer: Renderer2,
      @Inject(DOCUMENT) private document: Document,
    ) {
    this._obj = new DesignationDTO();
    this.objDesignationDTO = new DesignationDTO();
    this.PageSize = 10;
    this._Search = "";
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.EnterDesignationName = lang === 'en' ? 'Enter DesignationName' : 'أدخلاسم التسمية';
    this.DesignationSearch = lang === 'en' ? 'Search' : 'يبحث';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Designation Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم التصنيف';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#DesignationName', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
     })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.tabledata.filter = filterValue;
  }

  dtOptions: any = {};
  ngOnInit() {

    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.EnterDesignationName = lang === 'en' ? 'Enter DesignationName' : 'أدخلاسم التسمية';
  this.DesignationSearch = lang === 'en' ? 'Search' : 'يبحث';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.activePage = 1;
    this.MinDesignationLength=true;
    this.getdesignation();
    this._CurrentpageRecords = 0;
   // document.getElementById("addrck").style.display = "none";


   let tooltipContent = '';
   if (lang === 'en') {
     tooltipContent = 'Enter Designation Name';
   } else if (lang === 'ar') {
     tooltipContent = 'أدخل اسم التصنيف';
   }

   // Initialize Tippy.js with the appropriate tooltip content
   tippy('#DesignationName', {
     content: tooltipContent,
     arrow: true,
     animation: 'scale-extreme',
     animateFill: true,
     inertia: true
   });
  }
  designation_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("designation_add").style.display = "none";
    
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
  }
  designation_edit(row: DesignationDTO) {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("designation_add").style.display = "none";
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    this.DesignationId = row.DesignationId;
    this.DesignationName = row.DesignationName;
    this.InActive = row.IsActive;
    this.isShow = true;
  }
  designation_cl() {
    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("designation_add").style.display = "block";
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.DesignationName = "";
    this.DesignationId = 0;
    this.InActive = false;
    this.isShow = false;
  }
  getdesignation() {
    this._obj.Search = this.Desigsearch;
    this._obj.PageSize = this.PageSize;
    this._obj.PageNumber = this.activePage;
    this.service.GetdesignationData(this._obj).subscribe(data => {
      this.Objdesignation_data = data as [];
      console.log(this.Objdesignation_data , "Objdesignation_data");
      this._obj = new DesignationDTO();
      this.TotalrecordsList = data as  [];
      this.TotalRecords = this.Objdesignation_data[0].TotalRecords;
      this._CurrentpageRecords = this.Objdesignation_data.length;
      if(this.activePage == this.LastPage){
        this.lastPagerecords=10;
      } 
      let _vl = this.TotalRecords / this.PageSize;
      let _vl1 = _vl % 1;
      if (_vl1 > 0.000) {
        this.LastPage = Math.trunc(_vl) + 1;
      }
      else {
        this.LastPage = Math.trunc(_vl);
      }
    })
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
   if(this.activePage == 1){
     this.NextPage = false;
    } else{
    this.NextPage = true;
    }
    this.getdesignation();
   
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.activePage = 1;
    this.getdesignation();
  }
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.Desigsearch) {
      this.getdesignation();
    }
  }

  ReBindData() {
    this.Desigsearch = "";
    this.getdesignation();
  }
  get f() {
    return this.DesignationFrmGroup.controls;
  }
  OnCreate() {
    try {

      if (this.InActive == undefined) {
        this.InActive = false;
      }
      this.objDesignationDTO.IsActive = this.InActive;
      // this.objDesignationDTO.Search = "";
      // this.objDesignationDTO.PageNumber = 1;
      // this.objDesignationDTO.PageSize = 10000;

      if (this.DesignationId == undefined || this.DesignationId == 0) {
        this.objDesignationDTO.FlagId = 1;
      } else if (this.DesignationId != 0) {
        this.objDesignationDTO.FlagId = 2;
      }
      if (this.DesignationId == undefined) {
        this.objDesignationDTO.DesignationId = 0;
      } else {
        this.objDesignationDTO.DesignationId = this.DesignationId;
      }
      this.objDesignationDTO.DesignationName = this.DesignationName;

      this.service.designation_add(this.objDesignationDTO).subscribe(
        (data: any) => {
           
          if (data["message"] == "1") {
            const language = localStorage.getItem('language');

            // Set translations based on language preference
            if (language === 'ar') {
              this._snackBar.open('اضيف بنجاح', 'تنتهي الآن', {
                duration: 5000,            
                verticalPosition: 'bottom',
                horizontalPosition:'right',
              });
            } else {
              this._snackBar.open('Added Successfully', 'End now', {
                duration: 5000,            
                verticalPosition: 'bottom',
                horizontalPosition:'right',
              });
            }
          }
          else if (data["message"] == "2") {
            const language = localStorage.getItem('language');

            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
              });
            } else {
              this._snackBar.open('Updated Successfully', 'End now', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
              });
            }
          }
          this.designation_cl();
          // this.dtOptions = {
          //   pagingType: 'full_numbers',
          //   pageLength: 10,
          //   lengthMenu: [10, 25, 50],
          //   processing: true,
          //   order: []
          // };
          // jQuery('.dataTable').DataTable().destroy();
          // jQuery('.dataTable').DataTable({
          //   searching: false
          // });
          // this.service.GetdesignationData(this._obj).subscribe(data => {
          //   this.Objdesignation_data = data as [];
           
          //   this.dtTrigger.next(this.dtOptions);
          // })
          this.getdesignation();
        }
      );
    } catch (error) {
      alert(error)
    }
    this.isShow = false
  }
  UpdateStatus(Obj_Status: DesignationDTO) {

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
 
  TriggerLengthValidation() {
    if (this.DesignationName.trim().length <3) {
      //true
      this.MinDesignationLength=false;
    }
    else{
      //false
      this.MinDesignationLength=true;
    }
  }

  closeInfo() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("designation_add").style.display = "block";
    this.DesignationName = "";
    this.DesignationId = 0;
    this.InActive = false;
    this.isShow = false;
  }


}


