import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { data, event } from 'jquery';
import { WarehouseDTO } from 'src/app/_models/warehouse-dto';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import tippy from 'node_modules/tippy.js';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { UserDTO } from 'src/app/_models/user-dto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  private _ApiurlService: any;
  user: string;
  mail: string;
  call: string;
  lstPrdcts: any;
  lstCities: any;
  _obj: WarehouseDTO;
  submitted = false;
  warehouseFrmGroup: UntypedFormGroup;
  Active = true;
  InActive = false;
  f1: any;
  WarehouseName = '';
  wareNote: any;
  wareAddress: any;
  waremail: any;
  Count: any;
  town: any;
  warephone: any;
  Objwarehouse_data: any[];
  objwareDTO: WarehouseDTO;
  f_firstPanel = false;
  S_SecondPanel = true;
  BtnSubmit_TextChange: string;
  index: any;
  WarehouseDTO: any;
  isShow: boolean;
  email: string = ""
  String_status: string;
  p: number = 1;
  plus_btn = false;
  dtOptions: any = {};
  Warehouse: string;
  note: string;
  Address: any;
  this: any;
  phone: Number;
  ObjCountryCode: string;
  countrycode: string = "";
  address: string;
  CountryId: number;
  status: boolean;
  MinPhoneLength: boolean;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  _CurrentpageRecords:number;
  ObjgetCompanyList: any;
  _obj1:UserRegistrationDTO;
  CompanyDrp:any;
  SelectedCompanyValue:number;
  CompanyIds: string;
  warehousesearch:string;
  selected: string[] = [];
  warehouseSearch:string;
  currentLang:"ar"|"en"="ar";
  selectCompany:string;
  EnterWarehouseName:string;
  EnterAddress:string;
  EnterEmailAddress:string;
  SelectCountry:string;
  SelectCity:string;
  EnterPhoneNumber:string;
  EnterNote:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(public service: WarehouseService, private objFormBuilder: UntypedFormBuilder,
     private dialog: MatDialog, private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar,
     public services: UserRegistrationService,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.lstPrdcts = [];
    this._obj = new WarehouseDTO();
    this._obj1 = new UserRegistrationDTO();
    this.objwareDTO = new WarehouseDTO();
    this.objwareDTO.WareHouseId = 0;
    this.isShow = false;
    this.ObjgetCompanyList = [];
    HeaderComponent.languageChanged.subscribe((lang )=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang)
      this.warehouseSearch = lang === 'en' ? 'Search' : 'يبحث';
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.selectCompany = lang === 'en' ? 'select' : 'يختار';
      this.EnterWarehouseName = lang === 'en' ? 'Enter WarehouseName' : 'أدخل اسم المستودع';
      this.EnterAddress = lang === 'en' ? 'Enter Address' : 'أدخل العنوان';
      this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
      this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
      this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
      this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
      this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
      let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Warehouse Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم المستودع';
    }
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterWarehouse', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
  }

  ngOnInit() {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
    this.warehouseSearch = lang === 'en' ? 'Search' : 'يبحث'; 
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.selectCompany = lang === 'en' ? 'select' : 'يختار';
  this.EnterWarehouseName = lang === 'en' ? 'Enter WarehouseName' : 'أدخل اسم المستودع';
  this.EnterAddress = lang === 'en' ? 'Enter Address' : 'أدخل العنوان';
  this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
  this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
  this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
  this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
  this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة'
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
 
    this.getDropdown();
    this.countrycode="+1";
    this.activePage = 1;   
    this.Objwarehouse_data = [];
    this.MinPhoneLength = true;
    this.service.callGetapi()
      .subscribe(a => {
        this.lstPrdcts = a;
      });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25,50],
      processing: true,
      order: []
    };
    this.getwarelist();
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Warehouse Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم المستودع';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterWarehouse', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }
  clearSearch(){
    this.warehousesearch = "";
    this.getwarelist();
  }
  getwarelist() {
    this.service.Gettablelist(this._obj).subscribe(data => {   
      this.Objwarehouse_data = data as WarehouseDTO[];
      console.log(this.Objwarehouse_data,"Warehouse Data");
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
  
  PhoneLengthValidation() {
    if (this.phone.toString().trim().length < 8) {
      //true
      this.MinPhoneLength = false;
    }
    else {
      //false
      this.MinPhoneLength = true;
    }
  }

  onCountryChange(event) {
    this.countrycode =  "+" +event.dialCode.toString();
  }

  getcities(CountryId) {
    this._obj.CountryId = CountryId;
    this.service.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;     
      })
  }
  getDropdown() {
    this._obj1.CreatedBy=this.currentUserValue.createdby;
    this._obj1.OrganizationId=this.currentUserValue.organizationid;
    this.services.GetCompanyList(this._obj1)
      .subscribe(data => {
        this._obj1 = data as UserRegistrationDTO;
        this.ObjgetCompanyList = this._obj1.Data["CompanyList"]
        // console.log(data, "CompanyDrp");
      })
  }
  OnCreate() {
    try {
      this.objwareDTO.CompanyIds = this.CompanyDrp.toString();
      this.objwareDTO.WareHouseName = this.Warehouse;
      this.objwareDTO.Email = this.mail;
      this.objwareDTO.Phone = this.phone;
      this.objwareDTO.CountryCode = this.countrycode;
      this.objwareDTO.Description = this.note;
      this.objwareDTO.Address = this.Address;
      this.objwareDTO.CountryId = this.Count;
      this.objwareDTO.CityId = this.town;
      if (this.status == undefined) {
        this.objwareDTO.IsActive = false;
      }
      else {
        this.objwareDTO.IsActive = this.status;
      }
      if (this.objwareDTO.WareHouseId == undefined || this.objwareDTO.WareHouseId == 0) {
        this.objwareDTO.FlagId = 1;
      } else if (this.objwareDTO.WareHouseId != 0) {
        this.objwareDTO.FlagId = 2;
      }

      this.service.insertupdatewarehouse(this.objwareDTO).subscribe(
        data => {
        
          if (data["message"] == "1") {
            this._snackBar.open(this.translate.instant('Masterform.AddedSuccessfully'), 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
            
            this.getwarelist();
          }
          else if (data["message"] == "2") {
            this._snackBar.open(this.translate.instant('Masterform.UpdatedSuccessfully'), 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.getwarelist();
          }
          this.isShow = false;
          this.Reset();
        }
      );

    } catch (error) {
      alert(error)
    }
  }

  Reset() {
    this.objwareDTO.WareHouseId = 0
    this.CompanyDrp = null;
    this.Warehouse = "";
    this.note = "";
    this.mail = "";
    this.Address = "";
    this.Count = null;
    this.town = null;
    this.phone = null;
    this.countrycode= "+1";
    this.status = false;
    this.isShow = false;
    // (<HTMLInputElement>document.getElementById("ware")).style.display="none";
    // (<HTMLInputElement>document.getElementById("ware_add")).style.display="block";
    
    document.getElementById("addwarehouse_div").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

  }
  CheckEmailExist() {
    let mail = (<HTMLInputElement>document.getElementById("txtemail")).value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) {
    } else {
      (<HTMLInputElement>document.getElementById("txtemail")).value = "";
      this._snackBar.open('Email incorrect', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition:'right',
        panelClass: ['red-snackbar']
      });
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  populateForm(f1: WarehouseDTO) {
    // this.f_firstPanel = true;
    // this.S_SecondPanel = true;
    // this.objwareDTO.CompanyIds = f1.CompanyIds;
    var ids = f1.CompanyIds;
    this.selected = ids.split(",");
    let _ary = [];
    for (let index = 0; index < this.selected.length; index++) {
      const element = this.selected[index];
      _ary.push(parseInt(element))
    }
    this.CompanyDrp = _ary;

    this.objwareDTO.WareHouseId = f1.WareHouseId;
    this.Warehouse = f1.WareHouseName;
    this.note = f1.Description;
    this.mail = f1.Email;
    this.Address = f1.Address;
    this.Count = f1.CountryId;
    this._obj.CountryId = f1.CountryId;
    this.service.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
        this.town = f1.CityId;
      });
    this.town = f1.CityId;
    this.phone = f1.Phone;
    this.countrycode=f1.CountryCode;
    this.status = f1.IsActive;
    this.isShow = true;
          
    document.getElementById("addwarehouse_div").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit";

    const element = document.getElementById("editrck");

if (element) {
  // Set the inner HTML content based on the selected language
  element.innerHTML = this.translate.instant("Masterform.Edit");
}
    
  }

  UpdateStatus(Obj_Status: WarehouseDTO) {

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
  ware_add() {
    document.getElementById("addwarehouse_div").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    // Assuming 'editrck' is the ID of the element you want to modify
const element = document.getElementById("editrck");

if (element) {
  // Set the inner HTML content based on the selected language
  element.innerHTML = this.translate.instant("Masterform.Add");
}

  }

  closeInfo() {
    document.getElementById("addwarehouse_div").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.Reset();
  }


}

