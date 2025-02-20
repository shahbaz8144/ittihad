import { Component, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { CategoryDTO } from 'src/app/_models/category-dto';

import { CategoryService } from 'src/app/_service/category.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import tippy from 'tippy.js';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  OrganizationId: boolean;
  CreatedBy: number;
  FlagId: number;
  lstPrdcts: any;
  isShow: boolean;
  String_status: string;
  CName: string;
  note: string;
  Inactive: boolean;
  objCategory: CategoryDTO
  _obj: CategoryDTO;
  ObjCategory_data: any[] = [];
  SearchCategory:string;
  MinSpecializationLength: boolean;
  index: any;
  SpecializationFrmGroup: UntypedFormGroup;
  CatogeryFrmGroup: any;
  // objCatogery_data:;
  activePage: number;
  LastPage: number;
  NextPage: Boolean = false;
  TotalRecords: number;
  PageSize: number;
  currentLang:"ar"|"en"="ar";
  daysSelected: any[] = [];
  InvaliddaysSelected: any[] = [];
  event: any;
  selected: Date | null;
  // selected: any[] = [];
  // minDate = new Date(2022, 10, 1);
  // maxDate = new Date(2022, 10, 30);

  minDate = "2022-11-01";
  maxDate = "2022-11-30";

  selecteddays: any[] = [];
  EntercategoryName:string;
  EnterDescription:string;
  PCSearch:string;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  constructor(public service: CategoryService,
     private objFormBuilder: UntypedFormBuilder, 
     private _snackBar: MatSnackBar,
      private dialog: MatDialog,
      private renderer: Renderer2,
      private translate:TranslateService,
          @Inject(DOCUMENT) private document: Document,
    ) {
    this._obj = new CategoryDTO();

    this.objCategory = new CategoryDTO();
    this.lstPrdcts = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.EntercategoryName = lang === 'en' ? 'Enter category Name' : 'أدخل اسم الفئة';
    this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
    this.PCSearch = lang === 'en' ? 'Search' : 'يبحث';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Category Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الفئة';
    }
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterCategory', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    });
  }

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);

    // return this.InvaliddaysSelected.find(x =>x.date==date && x.isvalid == true) ? "selected"
    //  : (((x: { date: string; isvalid: boolean; })=>x.date==date && x.isvalid == false) ? "selectedinvalid" : "" );

    // return this.InvaliddaysSelected.find(x => x.date==date && x.isvalid==true) ? "selected" :
    // this.InvaliddaysSelected.find(y => y.date==date && y.isvalid==false) ? "selectedinvalid" : null;
    return this.daysSelected.find(x => x == date) ? "selected" : null;
    // return "selected";
  };
  isSelectedII = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.InvaliddaysSelected.find(x => x == date) ? "selectedinvalid" : null;
  };
  doubleClick(day) {
    alert(1);
  }
  select(event: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);
    // calendar.updateTodaysDate();
  }

  getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
  dtOptions: any = {};
  ngOnInit() {
    let lang: any = localStorage.getItem('language');
    this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.EntercategoryName = lang === 'en' ? 'Enter category Name' : 'أدخل اسم الفئة';
      this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
      this.PCSearch = lang === 'en' ? 'Search' : 'يبحث';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    const d1 = new Date('2022-01-18');
    const d2 = new Date('2022-01-24');
    console.log(d1);
    console.log(this.getDatesInRange(d1, d2));
    this.activePage = 1;
    this.MinSpecializationLength = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    this.getCategoryList();
    this.service._obj.CategoryName = "";
    this.service._obj.Description = "";
    this.service._obj.IsActive = false;

    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Category Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الفئة';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterCategory', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

  }

  daysdata() {
    //Get Dates as per day between date range
    //Add days in an array
    this.selecteddays.push(2);
    this.selecteddays.push(3);
    // this.selecteddays.push(5);

    var start = moment(this.minDate);
    var end = moment(this.maxDate);

    var result = [];
    //for (let index = 0; index < this.selecteddays.length; index++) {
    var day = 3//this.selecteddays[index];
    start = start.subtract(7, "days");
    var current = start.clone();
    debugger

    while (current.day(7 + day).isSameOrBefore(end)) {
      console.log(current);
      result.push(current.clone());
    }
    //}

    const format2 = "YYYY-MM-DD"
    //console.log(result.map(m => moment(m).format(format2)));
    //this.daysSelected = ["2022-11-02", "2022-11-09", "2022-11-16"];
    this.InvaliddaysSelected = [
      { "date": "2022-11-06", "isvalid": true },
      { "date": "2022-11-13", "isvalid": true },
      { "date": "2022-11-20", "isvalid": false },
      { "date": "2022-11-27", "isvalid": true }
    ];
    this.daysSelected = result.map(m => moment(m).format(format2));
    this.calendar.updateTodaysDate();
  }

  Category_add() {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    document.getElementById("editrck").innerHTML = "Add";

  }
  Category_edit(item: CategoryDTO) {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    document.getElementById("editrck").innerHTML = "Edit";

    this.CategoryId = item.CategoryId;
    this.CName = item.CategoryName;
    this.note = item.Description;
    this.Inactive = item.IsActive;
    this.isShow = true;
  }
  Category_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("editrck").innerHTML = "Add";
    this.CategoryId = 0;
    this.CategoryName = "";
    this.Description = "";
    this.IsActive = false;
    this.isShow = false;
    this.Reset();
  }
  getCategoryList() {
    this.service.GetCategoryList(this._obj).subscribe(data => {
      this.ObjCategory_data = data as [];
      this.dtTrigger.next(this.dtOptions)
    })
  }
  ReBindData(){
    this.SearchCategory = "";
    this.getCategoryList();
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    this.LastPage = (this.TotalRecords / this.PageSize)
    if (this.activePage == 1) {
      this.NextPage = false;
    } else {
      this.NextPage = true;
    }
    // this.GetUserList();

  }
  get f() {
    return this.CatogeryFrmGroup.controls;
  }
  OnCreate() {
    try {

      this.objCategory.CategoryId = this.CategoryId
      this.objCategory.CategoryName = this.CName;
      this.objCategory.Description = this.note;
      this.objCategory.IsActive = this.Inactive;
      if (this.objCategory.Description == null) {
        this.objCategory.Description = "";
      }
      else {
        this.objCategory.Description = this.note;
      }
      if (this.objCategory.IsActive == undefined) {
        this.objCategory.IsActive = false;
      }
      else {
        this.objCategory.IsActive = this.Inactive;
      }

      if (this.CategoryId == undefined || this.CategoryId == 0) {
        this.objCategory.FlagId = 1;
      } else if (this.CategoryId != 0) {
        this.objCategory.FlagId = 2;
      }
      this.service.Category_add(this.objCategory).subscribe(
        (data) => {

          if (data["message"] == "1") {

            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
            this.getCategoryList()

          }
          else if (data["message"] == "2") {
            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
            this.getCategoryList()
          }
          this.Category_cl();
          this.Reset();
          this.isShow = false;
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
          // this.service.GetCategoryList(this._obj).subscribe(data => {
          //   this.ObjCategory_data = data as [];
          //   this.dtTrigger.next(this.dtOptions)
          // });

        });


    } catch (error) {
      alert(error)
    }

  }
  Reset() {
    this.CName = "";
    this.note = "";
    this.Inactive = false;
    this.isShow = false
  }
  UpdateStatus(Obj_Status: CategoryDTO) {

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
          this.Inactive;
        }
        else {
          Obj_Status.IsActive = true;
        }
        this.service.UpDatedialog_Status(Obj_Status);
      }
    });
  }
  checkCategoryName() {
    debugger
    let checkSpc = (<HTMLInputElement>document.getElementById("checkSpc")).value;
    this.service.checkCategoryName(checkSpc)
      .subscribe(data => {
        debugger
        this._obj = data as CategoryDTO;
        if (this._obj.message != "1") {
          (<HTMLInputElement>document.getElementById("checkSpc")).value = "";
          this._snackBar.open('Category Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        }
      })
  }
  TriggerLengthValidation() {
    if (this.CName.trim().length < 3) {

      this.MinSpecializationLength = false;
    }
    else {

      this.MinSpecializationLength = true;
    }
  }

  closeInfo() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.Reset();
  }
}




