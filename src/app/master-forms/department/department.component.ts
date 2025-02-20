import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginationInstance } from 'ngx-pagination';
import { map, Observable, Subject, tap } from 'rxjs';
import { DepartmentDTO } from 'src/app/_models/department-dto';
import { DepartmentServicesService } from 'src/app/_service/department-services.service';
import tippy from 'tippy.js';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: DepartmentDTO
  _objDepartment: any[] = []
  String_status: string;
  is_mandatory: string;
  DepartmentId: number;
  InActive: false;
  IsInActive: false;
  isShow: boolean;
  objDepartmentDTO: DepartmentDTO;
  departmentformGroup: UntypedFormGroup;
  displayedColumns = ["Department", "Note", "IsMandatory", "actions", "action"]
  DepartmentNameMinLength: boolean;
  activePage: number;
  LastPage: number;
  NextPage: Boolean = false;
  TotalRecords: number;
  PageSize: number;
  Depsearch: string = '';
  _CurrentpageRecords: number;
  TotalrecordsList: any;
  PageNumber: Number;
  _Search: string;
  DepartmentSearch:string;
  currentLang:"ar"|"en"="ar";
  EnterDepartmentName:string;
  EnterDescription:string;
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  lastPagerecords:number;
  constructor(public services: DepartmentServicesService,
     private objFormBuilder: UntypedFormBuilder,
      private dialog: MatDialog,
       private _snackBar: MatSnackBar,
       private translate:TranslateService,
       private renderer: Renderer2,
       @Inject(DOCUMENT) private document: Document,
      ) {
    this._obj = new DepartmentDTO();
    this.objDepartmentDTO = new DepartmentDTO();
    this.objDepartmentDTO.DepartmentId = 0;
    this.isShow = false;
    this.PageSize = 10;
    this._Search = "";
    this.LastPage = 0;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.DepartmentSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterDepartmentName = lang === 'en' ?  'Enter DepartmentName' :'أدخل اسم القسم';
    this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
        let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Is Mandatory Department Is Used In Company Hierarchy';
    } else if (lang === 'ar') {
      tooltipContent = 'هل يتعين استخدام القسم إلزاميًا في التسلسل الهرمي للشركة؟';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the tooltip content
    if (tooltipContent) {
      tippy('#DepartmentMandatory', {
        content: tooltipContent,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true
      });
    }
     })
  }
 

  getdepartmentdetails() { //View DepartmentList
    this._obj.Search = this.Depsearch;
    this._obj.PageSize = this.PageSize;
    this._obj.PageNumber = this.activePage;
    this.services.getdepartmentlist(this._obj).subscribe(data => {
      this._objDepartment = data as [];
      //this.dtTrigger.next()
      this._obj = new DepartmentDTO();
      this.TotalrecordsList = data as [];
      this.TotalRecords = this._objDepartment[0].TotalRecords;
      this._CurrentpageRecords = this._objDepartment.length;
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

      // let totalPages = 20;
      // let page = 10;
      // this.createPagination(10,5);
      // let liTag = '';
      // let active;
      // let beforePage = page - 1;
      // let afterPage = page + 1;
      // if (page > 1) { //show the next button if the page value is greater than 1
      //   liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
      // }
      // if (page > 2) { //if page value is less than 2 then add 1 after the previous button
      //   liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
      //   if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
      //     liTag += `<li class="dots"><span>...</span></li>`;
      //   }
      // }
      // // how many pages or li show before the current li
      // if (page == totalPages) {
      //   beforePage = beforePage - 2;
      // } else if (page == totalPages - 1) {
      //   beforePage = beforePage - 1;
      // }
      // // how many pages or li show after the current li
      // if (page == 1) {
      //   afterPage = afterPage + 2;
      // } else if (page == 2) {
      //   afterPage = afterPage + 1;
      // }


      // for (var plength = beforePage; plength <= afterPage; plength++) {
      //   if (plength > totalPages) { //if plength is greater than totalPage length then continue
      //     continue;
      //   }
      //   if (plength == 0) { //if plength is 0 than add +1 in plength value
      //     plength = plength + 1;
      //   }
      //   if (page == plength) { //if page is equal to plength than assign active string in the active variable
      //     active = "active";
      //   } else { //else leave empty to the active variable
      //     active = "";
      //   }
      //   liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
      // }
      // if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      //   if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      //     liTag += `<li class="dots"><span>...</span></li>`;
      //   }
      //   liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
      // }

      // if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
      //   liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
      // }
      // element.innerHTML = liTag; //add li tag inside ul tag
      // return liTag; //reurn the li tag
    })
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.activePage = 1;
    this.getdepartmentdetails();
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.Depsearch) {
      this.getdepartmentdetails();
    }
  }

  numSequence(n: number): Array<number> {
    //alert(n)
    return Array(n);
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    if (this.activePage == 1) {
      this.NextPage = false;
    } else {
      this.NextPage = true;
    }
    this.getdepartmentdetails();
    //alert(pageNumber);

  }
  ReBindData() {
    this.Depsearch = "";
    this.getdepartmentdetails();
  }
  dtOptions: any = {};
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.DepartmentSearch = lang === 'en' ? 'Search' : 'يبحث';
  this.EnterDepartmentName = lang === 'en' ?  'Enter DepartmentName' :'أدخل اسم القسم';
  this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف'
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    $('#li_pageno' + 1).addClass('active');
    this.activePage = 1;
    this.LastPage = 0;
    this._CurrentpageRecords = 0;
    this.DepartmentNameMinLength = true;
    this.departmentformGroup = this.objFormBuilder.group({
      'DName': new UntypedFormControl('', [Validators.required]),
      'note': new UntypedFormControl,
      'status': new UntypedFormControl,
      'IsMandatory': new UntypedFormControl
    })
    //this.getPage(1);
    this.getdepartmentdetails();
    //document.getElementById("addrck").style.display = "none";
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    // tippy('#DepartmentMandatory', {
    //   content: "Is Mandatory Department Is Used In Company Hierarchy",
    //   arrow: true,
    //   animation: 'scale-extreme',
    //   //animation: 'tada',
    //   //theme: 'tomato',
    //   animateFill: true,
    //   inertia: true,
    // });
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Is Mandatory Department Is Used In Company Hierarchy';
    } else if (lang === 'ar') {
      tooltipContent = 'هل يتعين استخدام القسم إلزاميًا في التسلسل الهرمي للشركة؟';
    }

    // Initialize Tippy.js with the tooltip content
    if (tooltipContent) {
      tippy('#DepartmentMandatory', {
        content: tooltipContent,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true
      });
    }
  }
  get f() {
    return this.departmentformGroup.controls;
  }

  
  checkdepartmentnameExist() {
    this._obj.DepartmentName = (<HTMLInputElement>document.getElementById("txtDepartmentName")).value;
    if (this._obj.DepartmentName.trim().length < 3) {
      this.DepartmentNameMinLength = false;
    } else {
      this.DepartmentNameMinLength = true;
    }
    this.services.CheckDepartmentName(this._obj).subscribe(data => {
      this._obj = data as DepartmentDTO
      if (this._obj.message != 1) {
        const language = localStorage.getItem('language');

        // Set translations based on language preference
        if (language === 'ar') {
          this._snackBar.open('اسم القسم يخرج بالفعل', 'تنتهي الآن', {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ['red-snackbar']
          });
        } else {
          this._snackBar.open('Department Name Already Exits', 'End now', {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ['red-snackbar']
          });
        }
       
        this.services._obj.DepartmentName = '';
      }
    })
  }
  OnCreate() {
    try {
      if (this.departmentformGroup.invalid) {
        return;
      }
      this._obj.DepartmentId = this.DepartmentId;
      // alert(this.DepartmentId);
      this._obj.DepartmentName = this.departmentformGroup.get('DName').value;
      this._obj.Description = this.departmentformGroup.get('note').value;
      if (this._obj.Description == null) {
        this._obj.Description = "";
      }
      if (this.departmentformGroup.get('IsMandatory').value == undefined) {
        this._obj.IsMandatory = false;
      } else {
        this._obj.IsMandatory = this.departmentformGroup.get('IsMandatory').value;
      }
      if (this.departmentformGroup.get('status').value == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.departmentformGroup.get('status').value;
      }
      if (this._obj.DepartmentId == undefined || this._obj.DepartmentId == 0) {
        this._obj.FlagId = 1;
      } else if (this._obj.DepartmentId != 0) {
        this._obj.FlagId = 2;
      }
      this.services.insertdepartmentdetails(this._obj).subscribe(
        data => {
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
          // document.getElementById("addrck").style.display = "none";
          // document.getElementById("department_add").style.display = "block";
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.getdepartmentdetails();
          this.departmentformGroup.reset()
          this.DepartmentId = 0;
        }
      );
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }

  

  UpdateStatus(Obj_Status: DepartmentDTO) {
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
          // this.InActive;
        }
        else {
          Obj_Status.IsActive = true;
        }
        Obj_Status.FlagId = 2;
        this.services.updatedepartmentstatus(Obj_Status).subscribe(data => {
        });
      }
    });
  }

 
  

  Updateisstatus(Obj_isStatus: DepartmentDTO) {
    if (Obj_isStatus.IsMandatory === true) {
      this.is_mandatory = "IsNot-Mandatory"
    }
    else {
      this.is_mandatory = "IsMandatory"
    }
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm ',
        message: this.is_mandatory
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        if (Obj_isStatus.IsMandatory === true) {
          Obj_isStatus.IsMandatory = false;
          this.IsInActive;
        }
        else {
          Obj_isStatus.IsMandatory = true;
        }
        Obj_isStatus.FlagId = 1;
        this.services.updatedepartmentstatus(Obj_isStatus).subscribe(data => {
        });
      }
    });
  }
  department_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("department_add").style.display = "none";
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
    this.isShow = false;
  }
  department_edit(D1: DepartmentDTO) {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("department_add").style.display = "none";
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    this.objDepartmentDTO.DepartmentId = D1.DepartmentId;
    this.DepartmentId = D1.DepartmentId;
    this.services._obj.DepartmentName = D1.DepartmentName;
    this.services._obj.Description = D1.Description;
    this.services._obj.IsMandatory = D1.IsMandatory;
    this.services._obj.IsActive = D1.IsActive;
    this.isShow = true
  }
  department_cl() {
    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("department_add").style.display = "block";
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.departmentformGroup.reset()
    this.DepartmentId = 0;
    this.isShow = false;
  }
  closeInfo() {
    this.departmentformGroup.reset()
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";
  }
}

