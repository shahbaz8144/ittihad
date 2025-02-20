import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DistributorManufactureService } from 'src/app/_service/distributor-manufacture.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DistributorManufactureDTO } from 'src/app/_models/distributor-manufacture-dto';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { number } from '@amcharts/amcharts4/core';
import tippy from 'tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';


@Component({
  selector: 'app-distributor-manufacture',
  templateUrl: './distributor-manufacture.component.html',
  styleUrls: ['./distributor-manufacture.component.css']
})
export class DistributorManufactureComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  selectedValues: any[];
  DM_List: DistributorManufactureDTO[];
  ObjDM: DistributorManufactureDTO;
  DMformGroup: UntypedFormGroup;
  ObjCountryCode: string;
  DM_ById: DistributorManufactureDTO[];
  DMId: number;
  p: number = 1;
  isShow: boolean;
  CountryId: number;
  ListCountry: any;
  ListCity: any;
  //Status Change For Table
  String_status: string;
  Active = true;
  InActive = false;
  selected: string[] = [];
  namelist: string[] = [];
  array: [];
  _SpecializationIds: []
  NameMinLength: boolean;
  PhoneNoMinLength: boolean;
  // FaxMinLength: boolean;
  AddressMinLength: boolean;
  ContactUserMinLength: boolean;
  ObjSpecializationList = [];
  loadAPI: Promise<any>;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  userlist: boolean;
  IsConfidential: any;
  SourceList: any;
  AccessUsers: any;
  DMSearch:any;
  currentLang:"ar"|"en"="ar";
  SelectUsers:string;
  EnterContactPersonName:string;
  SelectSpecialization:string;
  SelectCountry:string;
  DMSearchs:string;
  EnterDistributorManufactureName:string;
  EnterDistributorandManufactureAddress:string;
  EnterEmailAddress:string;
  EnterPhoneNumber:string;
  EnterFaxNumber:string;
  EnteraNote:string;
  constructor(public service: DistributorManufactureService,
     private objFormBuilder: UntypedFormBuilder, 
     private dialog: MatDialog
    , private _snackBar: MatSnackBar,
    private renderer: Renderer2,
    private translate:TranslateService,
        @Inject(DOCUMENT) private document: Document,
  ) {
    this.ListCountry = [];
    this.ObjDM = new DistributorManufactureDTO();
    this.isShow = false;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SelectUsers = lang === 'en' ? 'Select Users' : 'حدد المستخدمين';
    this.EnterContactPersonName = lang === 'en' ? 'Enter ContactPersonName' : 'أدخل اسم جهة الاتصال';
    this.SelectSpecialization = lang === 'en' ? 'Select Specialization' : 'اختر التخصص';
    this.EnterDistributorandManufactureAddress = lang === 'en' ? 'EnterDistributor/ManufactureAddress' : 'أدخل عنوان الموزع/التصنيع';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.DMSearchs = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterDistributorManufactureName = lang === 'en' ? 'Enter Distributor/ManufactureName' : 'أدخل اسم الموزع/التصنيع';
    this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
    this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
    this.EnteraNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Distributor/Manufacture Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الموزع/الصانع';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterDistributorManufacture', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Contact Person Name';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل اسم الشخص الذي يمكن الاتصال به';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#ContactPerson', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
  }
  keyPress(event: any) {
    const pattern =  /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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
      this.SelectUsers = lang === 'en' ? 'Select Users' : 'حدد المستخدمين';
      this.EnterContactPersonName = lang === 'en' ? 'Enter ContactPersonName' : 'أدخل اسم جهة الاتصال';
      this.SelectSpecialization = lang === 'en' ? 'Select Specialization' : 'اختر التخصص';
      this.EnterDistributorandManufactureAddress = lang === 'en' ? 'EnterDistributor/ManufactureAddress' : 'أدخل عنوان الموزع/التصنيع';
      this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
      this.DMSearchs = lang === 'en' ? 'Search' : 'يبحث';
      this.EnterDistributorManufactureName = lang === 'en' ? 'Enter Distributor/ManufactureName' : 'أدخل اسم الموزع/التصنيع';
      this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
      this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
      this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
      this.EnteraNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';

    this.userlist=true;
    this.activePage = 1;
    this.service.Obj_DMs.CountryCode='+1'
    this.NameMinLength = true;
    this.PhoneNoMinLength = true;
    // this.FaxMinLength = true;
    this.AddressMinLength = true;
    this.ContactUserMinLength = true;
    this.getlist();
    this.service.GetCountries().subscribe(a => {
      this.ListCountry = a;
    })
    this.service.getSpecilizationNamesFor_DMS();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
 
    this.DMformGroup = this.objFormBuilder.group({
      specialization: new UntypedFormControl('', [Validators.required]),
      // type: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      contactusername: new UntypedFormControl,
      state: new UntypedFormControl,
      UsersList: new UntypedFormControl,
      address: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required]),
      fax: new UntypedFormControl,
      note: new UntypedFormControl,
      status: new UntypedFormControl,
      phonecode:new UntypedFormControl('', [Validators.required])
    });
  
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Distributor/Manufacture Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الموزع/الصانع';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterDistributorManufacture', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Contact Person Name';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل اسم الشخص الذي يمكن الاتصال به';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#ContactPerson', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    tippy('#myButton2', {
      content: "Select Type",
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      // theme: 'tomato',
      animateFill: true,
      inertia: true,
    });
   
  }
  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }
    if (!isFound) {
      var dynamicScripts = [
        "../../../assets/js/intlTelInput.min.js"];
      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
  get f() {
    return this.DMformGroup.controls;
  }
  checkNameLength() {
    this.ObjDM.Name = (<HTMLInputElement>document.getElementById("txtname")).value;
    if (this.ObjDM.Name.trim().length < 3) {
      this.NameMinLength = false;
    } else {
      this.NameMinLength = true;
    }
  }
  checkphoneNoLength() {
    this.ObjDM.Phone = (<HTMLInputElement>document.getElementById("txtphoneNo")).value;
    if (this.ObjDM.Phone.trim().length < 8) {
      this.PhoneNoMinLength = false;
    } else {
      this.PhoneNoMinLength = true;
    }
  }
  CheckEmailExist() {
    let Email = (<HTMLInputElement>document.getElementById("txtemail")).value;
    var Emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (Email.match(Emailformat)) {
    } else {
      (<HTMLInputElement>document.getElementById("txtemail")).value = "";
      this._snackBar.open('Email must be a valid email address', 'End now', {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ['red-snackbar']
      });
    }
  }
  // checkFaxLength() {
  //   this.ObjDM.Fax = (<HTMLInputElement>document.getElementById("txtfax")).value;
  //   if (this.ObjDM.Fax.trim().length < 3) {
  //     this.FaxMinLength = false;
  //   } else {
  //     this.FaxMinLength = true;
  //   }
  // }
  checkaddressLength() {
    this.ObjDM.Address = (<HTMLInputElement>document.getElementById("txtaddress")).value;
    if (this.ObjDM.Address.trim().length < 3) {
      this.AddressMinLength = false;
    } else {
      this.AddressMinLength = true;
    }
  }
  checkContactUserLength() {
    this.ObjDM.ContactUser = (<HTMLInputElement>document.getElementById("txtContactUser")).value;
    if (this.ObjDM.ContactUser.trim().length < 3) {
      this.ContactUserMinLength = false;
    } else {
      this.ContactUserMinLength = true;
    }
  }
  getlist() {
   
    this.service.getDMs().subscribe(
      (data) => {
        this.DM_List = data as DistributorManufactureDTO[];
        //this.dtTrigger.next();
      });
  }
  ReBindData(){
    this.DMSearch = "";
    this.ReBindData();
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
  GetUsersListDrp() {
   
    if(this.service.Obj_DMs.IsConfidential == true){
      this.userlist = false;
      this.service.GetUserList(this.ObjDM).subscribe(data => {
        console.log(data, '6666')
        this.ObjDM = data as DistributorManufactureDTO;
        this.SourceList = this.ObjDM.Data["UserList"];
        tippy('.tips', {
          arrow: true,
          animation: 'scale-extreme',
          //animation: 'tada',
          // theme: 'tomato',
          animateFill: true,
          inertia: true,
        });
      });
    }
    else {
    this.userlist = true;
    }
  }
  
  OnCreate() {
    debugger
    try {
      if (this.DMformGroup.invalid) {
        return;
      }
      this.ObjDM.DMId = this.DMId;
      this.ObjDM.TypeValue = "Both";
      this.ObjDM.Name = this.DMformGroup.get('name').value;
      this.ObjDM.ContactUser = this.DMformGroup.get('contactusername').value;
      // #2 Converting the Json Object
      this.ObjDM.SpecializationNames = this.DMformGroup.get('specialization').value;
      this.ObjDM.SpecializationNames = JSON.stringify(this.ObjDM.SpecializationNames);
      this.array = JSON.parse(this.ObjDM.SpecializationNames);
      var _touse = [];
      for (let index = 0; index < this.array.length; index++) {
        const element = this.array[index];
        var jsonData = {};
        var columnName = "SpecializationID";
        jsonData[columnName] = element;
        _touse.push(jsonData);
      }
      this.ObjDM.specialIdsxml = JSON.stringify(_touse);
      this.ObjDM.SpecializationNames = this.ObjDM.specialIdsxml;
      this.ObjDM.Address = this.DMformGroup.get('address').value;
      this.ObjDM.CountryId = this.DMformGroup.get('country').value;
      this.ObjDM.CityId = this.DMformGroup.get('city').value;
      this.ObjDM.Email = this.DMformGroup.get('email').value;
      this.ObjDM.Phone = this.DMformGroup.get('phone').value;
      this.ObjDM.CountryCode = this.DMformGroup.get('phonecode').value;
      // if (this.ObjCountryCode == null) {
      //   this.ObjCountryCode = "0";
      // }
      // this.ObjDM.CountryCode = this.ObjCountryCode;
      this.ObjDM.Fax = this.DMformGroup.get('fax').value;
      if (this.ObjDM.Fax == null) {
        this.ObjDM.Fax = "";
      }
      this.ObjDM.Description = this.DMformGroup.get('note').value;
      if (this.ObjDM.Description == null) {
        this.ObjDM.Description = "";
      }
      if (this.DMformGroup.get('status').value == undefined) {
        this.ObjDM.IsActive = false;
      }
      else {
        this.ObjDM.IsActive = this.DMformGroup.get('status').value;
      }
      if (this.ObjDM.DMId == undefined || this.ObjDM.DMId == 0) {
        this.ObjDM.FlagId = 1;
      } else if (this.ObjDM.DMId != 0) {
        this.ObjDM.FlagId = 2;
      }
      this.ObjDM.IsConfidential = this.DMformGroup.get('state').value;
     
      if (this.ObjDM.IsConfidential == true) {
        this.ObjDM.AccessUsers = this.AccessUsers.toString();
      }
      else{
        this.ObjDM.AccessUsers ="";
      }
      this.service.Insertupdate_DMs(this.ObjDM).subscribe(
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
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.getlist();
          this.DMformGroup.reset();
          this.DMId = 0;
          this.DMformGroup.patchValue({
            phonecode: "+1"
          })
          this.service.Obj_DMs.CountryCode='+1'
          this.GetUsersListDrp();
        });
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }
  onCountryChange(event) {
    // this.ObjCountryCode = event.dialCode;
    // this.service.Obj_DMs.CountryCode="+"+this.ObjCountryCode.toString();
    this.ObjCountryCode = "+" +event.dialCode;
    this.service.Obj_DMs.CountryCode =  this.ObjCountryCode.toString();
  }
  getCities(CountryId) {
    this.ObjDM.CountryId = CountryId;
    this.service.GetCities(this.ObjDM)
      .subscribe(data => {
        this.ListCity = data;
      })
  }

  

  PopulateForm(f1: DistributorManufactureDTO) {
    
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");

    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("distributor_add").style.display = "none";
    document.getElementById("editrck").innerHTML = "Edit";
    this.DMId = f1.DMId;
    this.service.Obj_DMs.Type = f1.Type
    this.service.Obj_DMs.Name = f1.Name
    this.service.Obj_DMs.IsConfidential = f1.IsConfidential;
    var ids = f1.AccessUsers;
    this.selected = ids.split(",");
    let _ary1 = [];
    for (let index = 0; index < this.selected.length; index++) {
      const element = this.selected[index];
      _ary1.push(parseInt(element))
    }
    this.AccessUsers = _ary1;
    this.service.Obj_DMs.ContactUser = f1.ContactUser
    var ids = f1.SpecializationIdsString;
    this.selected = ids.split(",");
    let _ary = [];
    for (let index = 0; index < this.selected.length; index++) {
      const element = this.selected[index];
      _ary.push(parseInt(element))
    }
    console.log(_ary,"DMarray");
    this.service.Obj_DMs.specializationids = _ary;

    this.service.Obj_DMs.Address = f1.Address
    this.service.Obj_DMs.CountryId = f1.CountryId
    this.ObjDM.CountryId = f1.CountryId
    this.service.GetCities(this.ObjDM)
      .subscribe(data => {
        this.ListCity = data;
        this.service.Obj_DMs.CityId = f1.CityId
      })
    this.service.Obj_DMs.CityId = f1.CityId
    this.service.Obj_DMs.Email = f1.Email
    this.service.Obj_DMs.Phone = f1.Phone;
    this.service.Obj_DMs.CountryCode = f1.CountryCode;
    this.service.Obj_DMs.Fax = f1.Fax
    this.service.Obj_DMs.Description = f1.Description
    this.service.Obj_DMs.IsActive = f1.IsActive
    this.isShow = true
    this.GetUsersListDrp();
  }
  ResetForm() {
    this.DMId = 0;
    this.DMformGroup.reset();
  }
  UpdateStatus(Obj_Status: DistributorManufactureDTO) {
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
  distributor_add() {
    
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("distributor_add").style.display = "none";
    document.getElementById("editrck").innerHTML = "Add";
    this.isShow = false;
    this.NameMinLength = true;
  }
  distributor_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    
    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("distributor_add").style.display = "block";
    this.ResetForm();
    this.DMformGroup.reset();
    this.isShow = false;
    this.GetUsersListDrp();
  }
  
  closeInfo() {
    this.DMformGroup.reset();
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
}
