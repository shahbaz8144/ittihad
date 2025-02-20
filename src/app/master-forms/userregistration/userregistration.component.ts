// import { number } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';
import tippy from 'node_modules/tippy.js';
import { environment } from 'src/environments/environment';
// import { ScriptService } from 'src/app/_service/script.service';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
// import { json } from 'stream/consumers';
@Component({
  selector: 'app-userregistration',
  templateUrl: './userregistration.component.html',
  styleUrls: ['./userregistration.component.css']
})
export class UserregistrationComponent implements OnInit {
  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;
  @ViewChild('fileUploader') fileUploader: ElementRef;
  UserRegistration: any = [{
    FirstName: '',
    MiddleName: '',
    LastName: '',
    DisplayName: '',
    Email: '',
    Phone: '',
    Address: '',
    Country: '',
    City: '',
    PinCode: '',
    Telephone1: '',
    Telephone2: '',
    Status: '',
    PositionId: '',
    CompanyId: '',
    DepartmentId: '',
    RoleId: '',
    DesignationId: '',
    LoginId: '',
    EmployeeId: '',
    IsGlobalUser: '',
    IsInterCompany: '',
    IsArchiveApproved: '',
    IsCommunicationDownload: '',
  },
  ];
  Positions: any = [{
    "PositionName": "TeamMember",
    "PositionId": "1",
  },
  {
    "PositionName": "DepartmentHead",
    "PositionId": "2"
  },
  {
    "PositionName": "CompanyHead",
    "PositionId": "3"
  },

  ]
_customerregistration:boolean=false;

  RoleDrp: any;
  CompanyDrp: any;
  DepartmentDrp: any;
  DesignationDrp: any;
  removefilename: any;
  ToUser: any;
  _message: string;
  convertedjson!: string;
  _excelJsonArray: any;
  _obj: UserRegistrationDTO;
  Fname: string = "";
  mname: string = "";
  lname: string = "";
  Display: string = "";
  email: string = "";
  phnnum: number;
  countrycode: string = "";
  addrs: string = "";
  cunname: number;
  cty: number;
  code: number;
  tele1: number;
  tele2: number;
  status: boolean;
  Position: number;
  Comp: number;
  dept: number;
  role: number;
  desig: number;
  login: string;
  Empid: number;
  Repuser: number;
  global: boolean;
  iner: boolean;
  IsArchiveApproval: boolean;
  IsCommunication: boolean;
  StreamPlanner: boolean;
  ArchiveDownload: boolean;
  _Globaluser: any[];
  CountryId: number;
  GetCountries: any;
  lstCities: any;
  lstCompany: any;
  selectedSourceValue: Number;
  paginator: any;
  _obj_UserRegistrationDTO: UserRegistrationDTO;
  private _Obj_data: any;
  tabledata: any;
  sort: any;
  selectedItemList: any[];
  UserId: number;
  http: any;
  ObjgetcountryList: any;
  ObjgetEmail: any;
  ObjgetCompanyList: any;
  ObjgetRoleList: any;
  data: any;
  // Globaluser:any[]=[]
  ObjgetDepartmentList: any;
  ObjgetDesignationList: any;
  ObjgetGlobalusersList: any;
  ObjgetReportingUser: any;
  ObjCountryCode: string;
  MinFirstNameLength: boolean;
  MinLastNameLength: boolean;
  MinPhoneLength: boolean;
  MinAddressLength: boolean;
  MinPinLength: boolean;
  MinLoginLength: boolean;
  MinEmployeeLength: boolean;

  InvalidEmailFormat: boolean;
  loadAPI: Promise<any>;
  BlukFile: any;
  currentLang:"ar"|"en"="ar";
  EnterFirstName:string;
  EnterMiddleName:string;
  EnterLastName:string;
  EnterDisplayName:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _userdto: UserDTO;
  EnterEmailAddress:string;
  EnterPhoneNumber:string;
  EnterFullAddress:string;
  SelectCountry:string;
  SelectCity:string;
  EnterPinCode:string;
  EnterTelephone1:string;
  EnterTelephone2:string;
  selectPosition:string;
  Companyselect:string;
  Departmentselect:string;
  Roleselect:string;
  Designationselect:string;
  EnterLoginId:string;
  EnterEmployeeId:string;
  ReportingUserselect:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(public services: UserRegistrationService,
     private _snackBar: MatSnackBar,
    private translate:TranslateService,
    private renderer: Renderer2,
   @Inject(DOCUMENT) private document: Document
    // , private script: ScriptService
  ) {
    this.CompanyDrp = [];
    this.DepartmentDrp = [];
    this.RoleDrp = [];
    this.DesignationDrp = [];
    this.ObjgetcountryList = [];
    this.ObjgetEmail = [];
    this.lstCities = [];
    this.ObjgetCompanyList = [];
    this.ObjgetDepartmentList = [];
    this.ObjgetRoleList = [];
    this.ObjgetDesignationList = [];
    this.ObjgetGlobalusersList = [];
    this.ObjgetReportingUser = [];
    this._obj = new UserRegistrationDTO();
    this._userdto = new UserDTO();
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.EnterFirstName  = lang === 'en' ? 'Enter First Name' : 'أدخل الاسم الأول';
    this.EnterMiddleName = lang === 'en' ? 'Enter Middle Name' :  'أدخل الاسم الأوسط';
    this.EnterLastName  = lang === 'en' ? 'Enter Last Name' : 'إدخال اسم آخر';
    this.EnterDisplayName = lang  === 'en' ? 'Enter DisplayName' : 'أدخل اسم العرض';
    this.EnterEmailAddress = lang === 'en' ? 'Enter Email Address' : 'أدخل عنوان البريد الالكتروني';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter Phone Number' : 'أدخل رقم الهاتف';
    this.EnterFullAddress = lang === 'en' ? 'Enter Full Address' : 'أدخل العنوان الكامل';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
    this.EnterPinCode = lang === 'en' ? 'Enter PinCode' : 'أدخل الرمز السري';
    this.EnterTelephone1 = lang === 'en' ? 'Enter Telephone1' : 'أدخل الهاتف1';
    this.EnterTelephone2  = lang === 'en' ? 'Enter Telephone2' : 'أدخل الهاتف2';
    this.selectPosition  = lang === 'en' ? 'select' : 'يختار';
    this.Companyselect = lang === 'en' ? 'select' : 'يختار';
    this.Departmentselect = lang === 'en' ? 'select' : 'يختار';
    this.Roleselect = lang === 'en' ? 'select' : 'يختار'; 
    this.Designationselect  = lang === 'en' ? 'select' : 'يختار'; 
    this.EnterLoginId = lang === 'en' ? 'Enter Login Id' : 'أدخل معرف تسجيل الدخول';
    this.EnterEmployeeId = lang === 'en' ? 'Enter Employee Id' : 'أدخل معرف الموظف';
    this.ReportingUserselect = lang === 'en' ? 'select' : 'يختار';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Company Area Pincode/Zipcode';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل رمز المنطقة/الرمز البريدي للشركة';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterCompanyArea', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
     
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Valid Address';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل عنوانًا صالحًا';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myAddress', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContentss = '';
    if (lang === 'en') {
      tooltipContentss = 'Enter Valid Phone Number';
    } else if (lang === 'ar') {
      tooltipContentss = 'أدخل رقم هاتف صالح';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    

    let tooltipContentn = '';
    if (lang === 'en') {
      tooltipContentn = 'Enter Valid Phone Number';
    } else if (lang === 'ar') {
      tooltipContentn = 'أدخل رقم هاتف صالح';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myPhone', {
      content: tooltipContentn,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    let tooltipContentV = '';
    if (lang === 'en') {
      tooltipContentV = 'Enter Valid Email';
    } else if (lang === 'ar') {
      tooltipContentV = 'أدخل بريدًا إلكترونيًا صالحًا';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myEmail', {
      content: tooltipContentV,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    
    })
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
        environment.assetsurl + "assets/js/mstepper.min.js",
        environment.assetsurl + "assets/js/pages/UserRegistrationmstepper.js"
      ];
      //dont comment this below line FROM :Aquib Shahbaz
      // var dynamicScripts = ["../../../assets/js/mstepper.min.js", "../../../assets/js/pages/UserRegistrationmstepper.js"];

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
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.EnterFirstName  = lang === 'en' ? 'Enter First Name' : 'أدخل الاسم الأول';
    this.EnterMiddleName = lang === 'en' ? 'Enter Middle Name' :  'أدخل الاسم الأوسط';
    this.EnterLastName  = lang === 'en' ? 'Enter Last Name' : 'إدخال اسم آخر';
    this.EnterDisplayName = lang  === 'en' ? 'Enter DisplayName' : 'أدخل اسم العرض';
    this.EnterEmailAddress = lang === 'en' ? 'Enter Email Address' : 'أدخل عنوان البريد الالكتروني';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter Phone Number' : 'أدخل رقم الهاتف';
    this.EnterFullAddress = lang === 'en' ? 'Enter Full Address' : 'أدخل العنوان الكامل';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
    this.EnterPinCode = lang === 'en' ? 'Enter PinCode' : 'أدخل الرمز السري';
    this.EnterTelephone1 = lang === 'en' ? 'Enter Telephone1' : 'أدخل الهاتف1';
    this.EnterTelephone2  = lang === 'en' ? 'Enter Telephone2' : 'أدخل الهاتف2';
    this.selectPosition  = lang === 'en' ? 'select' : 'يختار';
    this.Companyselect = lang === 'en' ? 'select' : 'يختار';
    this.Departmentselect = lang === 'en' ? 'select' : 'يختار';
    this.Roleselect = lang === 'en' ? 'select' : 'يختار'; 
    this.Designationselect  = lang === 'en' ? 'select' : 'يختار'; 
    this.EnterLoginId = lang === 'en' ? 'Enter Login Id' : 'أدخل معرف تسجيل الدخول';
    this.EnterEmployeeId = lang === 'en' ? 'Enter Employee Id' : 'أدخل معرف الموظف';
    this.ReportingUserselect = lang === 'en' ? 'select' : 'يختار'
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.InvalidEmailFormat = true;
    this.MinFirstNameLength = true;
    this.MinLastNameLength = true;
    this.MinPhoneLength = true;
    this.MinAddressLength = true;
    this.MinPinLength = true;
    this.MinLoginLength = true;
    this.MinEmployeeLength = true;
    this.countrycode = '+1';
    this.services.GetCountriesList()
      .subscribe(data => {
        this.ObjgetcountryList = data;
      });
    this.getDropdown();
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Company Area Pincode/Zipcode';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل رمز المنطقة/الرمز البريدي للشركة';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterCompanyArea', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Valid Address';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل عنوانًا صالحًا';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myAddress', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
 

    // Initialize Tippy.js with the appropriate tooltip content
    let tooltipContentn = '';
    if (lang === 'en') {
      tooltipContentn = 'Enter Valid Phone Number';
    } else if (lang === 'ar') {
      tooltipContentn = 'أدخل رقم هاتف صالح';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myPhone', {
      content: tooltipContentn,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  
    let tooltipContentV = '';
    if (lang === 'en') {
      tooltipContentV = 'Enter Valid Email';
    } else if (lang === 'ar') {
      tooltipContentV = 'أدخل بريدًا إلكترونيًا صالحًا';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myEmail', {
      content: tooltipContentV,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    tippy('.tips', {
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      animateFill: true,
      inertia: true,
    });
  }
  onCountryChange(event) {
    // this.ObjCountryCode = "+"+ event.dialCode;
    // this.countrycode =  this.ObjCountryCode.toString();
    this.countrycode = "+" + event.dialCode.toString();
  }

  getcities(CountryId) {
    this._obj.CountryId = CountryId;
    this.services.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
      })
  }
  CheckEmailExist() {

    let email = (<HTMLInputElement>document.getElementById("txtemail")).value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
      this.InvalidEmailFormat = true;
      this.services.CheckUserEmailExist(email)
        .subscribe(data => {
          this._obj = data as UserRegistrationDTO;
          if (this._obj.message != "1") {
            (<HTMLInputElement>document.getElementById("txtemail")).value = "";
            this._snackBar.open('Email Id Already Exits', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['red-snackbar']
            });

          }
        })
    }
    else {
      this.InvalidEmailFormat = false;
      (<HTMLInputElement>document.getElementById("txtemail")).value = "";
    }
  }
  getDropdown() {
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this.services.GetCompanyList(this._obj)
      .subscribe(data => {
        // console.log(data,"gobaldata");
        this._obj = data as UserRegistrationDTO;
        //  Feature filter functionality  
        // this.CompanyDrp = this._obj
        // this.ObjgetCompanyList = this.CompanyDrp.Data["CompanyList"]
        // this.ObjgetCompanyList =this.ObjgetCompanyList.filter(word => word.isChecked == 0)
        // console.log(this.ObjgetCompanyList,"CompanyDrp");
        // this.DepartmentDrp = this._obj
        // this.ObjgetDepartmentList = this.DepartmentDrp.Data["JDepartmentList"]
        // this.ObjgetDepartmentList =this.ObjgetDepartmentList.filter(word => word.isChecked == 0)
        // console.log(this.ObjgetDepartmentList,"DepartmentDrp");
        // this.RoleDrp = this._obj
        // this.ObjgetRoleList = this.RoleDrp.Data["JRoleList"]
        // this.ObjgetRoleList =this.ObjgetRoleList.filter(word => word.isChecked == 0)
        // console.log(this.ObjgetRoleList,"RoleDrp");
        // this.DesignationDrp = this._obj
        // this.ObjgetDesignationList = this.DesignationDrp.Data["JDesignationList"]
        // this.ObjgetDesignationList =this.ObjgetDesignationList.filter(word => word.isChecked == 0)
        // console.log(this.ObjgetDesignationList,"DesignationDrp");
        //  Feature filter functionality  

        this.ObjgetCompanyList = this._obj.Data["CompanyList"]
        // console.log(this.ObjgetCompanyList, "CompanyDrp");
        this.ObjgetDepartmentList = this._obj.Data["JDepartmentList"]
        this.ObjgetRoleList = this._obj.Data["JRoleList"]
        this.ObjgetDesignationList = this._obj.Data["JDesignationList"]
        this.ObjgetGlobalusersList = this._obj.Data["JGlobalUsersList"]
        // console.log(this.ObjgetGlobalusersList ,"ObjgetGlobalusersList")
        // console.log(this.ObjgetDesignationList, "DesignationDrp");
      })
  }
  getReportingDropDown(CompanyId) {

    this._obj.CompanyId = CompanyId;
    this.services.GetReportingUser(this._obj)
      .subscribe(data => {
        this.ObjgetReportingUser = data
      })
  }


  CheckEmployeeIdExist() {

    let text = (<HTMLInputElement>document.getElementById("textempid")).value;
    this.services.CheckUserEmployeeIdExist(text)
      .subscribe(data => {
        this._obj = data as UserRegistrationDTO;
        if (this._obj.message != "1") {
          (<HTMLInputElement>document.getElementById("textempid")).value = "";
          this._snackBar.open('Employee Id Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        }
      })
  }
  ChecLoginIdExist() {

    let text = (<HTMLInputElement>document.getElementById("txtloginid")).value;
    this.services.CheckUserLoginIdExist(text)
      .subscribe(data => {

        this._obj = data as UserRegistrationDTO;

        if (this._obj.message != "1") {
          (<HTMLInputElement>document.getElementById("txtloginid")).value = "";
          this._snackBar.open('Login Id Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        }
      })
  }
  // GetCheckboxvalue(e) {
  // }
  // GetCheckboxvalueinter(e) {
  // }
  // GetCheckboxvalueStatus(e) {
  // }

  OnCreate() {
    try {

      this._obj.FirstName = this.Fname;
      this._obj.lastName = this.lname;
      this._obj.DisplayName = this.Display;
      this._obj.UserEmail = this.email;
      this._obj.UserPhone = this.phnnum;
      this._obj.CountryCode = this.countrycode;
      // if (this.ObjCountryCode == null) {
      //   this.ObjCountryCode = "0";
      // }
      this._obj.UserAddress = this.addrs;
      this._obj.CityId = this.cty;
      this._obj.CountryId = this.cunname;
      this._obj.UserPincode = this.code;
      this._obj.UserName = this.login;
      this._obj.CompanyId = this.Comp;
      this._obj.DepartmentId = this.dept;
      this._obj.RoleId = this.role;
      this._obj.UserId = this.UserId;
      this._obj.ReportingUserId = this.Repuser;
      this._obj.EmployeeId = this.Empid;
      this._obj.DesignationId = this.desig;
      // if(this.ECRStorevalue ==1){
      //   this._obj.PositionId = this.Position;
      // }else if(this.ECRStorevalue ==2){
      //   this._obj.PositionId = 1;
      // }
      this._obj.PositionId = this.Position;
      this._obj.IsInterCompany = this.iner;
      this._obj.IsArchiveApproval = this.IsArchiveApproval;
      this._obj.IsCommunicationDownload = this.IsCommunication
      this._obj.IsGlobalUser = this.global;
      this._obj.IsArchiveDownload = this.ArchiveDownload
      this._obj.IsStreamDownload = this.StreamPlanner;
      this._obj.ToUserIdsStr = this._Globaluser ? this._Globaluser.toString() : "";
      // this._obj.ToUserIdsStr = this._Globaluser.toString();
      // console.log(this._Globaluser.toString(),"drpvalue");
      // this._obj.ToUserIdsStr = this._Globaluser?.toString();
      // alert(this._Globaluser.toString());
      // alert(this.global);
      this._obj.UserIsActive = true;

      const fd = new FormData();
      if (this.mname == null) {
        this.mname = "";
      }
      if (this.tele1 == null) {
        this.tele1 = 0;
      }
      if (this.tele2 == null) {
        this.tele2 = 0;
      }
      this._obj.MiddleName = this.mname;
      this._obj.Telephone1 = this.tele1;
      this._obj.Telephone2 = this.tele2;

      this.services.InsertUpdateUserRegistration(this._obj)
        .subscribe(data => {
          // console.log(data, 'userregistration')
          this._obj = data as UserRegistrationDTO;

          if (this._obj.message == "1") {
            (<HTMLInputElement>document.getElementById("txtloginid")).value = "";
            this._snackBar.open('User Registered SucessFully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['blue-snackbar']
            });
          }
          this.reset();
        })
    } catch (error) {
      alert(error)
    }
  }
  TriggerLengthValidation() {
    if (this.Fname.trim().length < 1)
      this.MinFirstNameLength = false;
    else
      this.MinFirstNameLength = true;
  }
  LastLengthValidation() {
    if (this.lname.trim().length < 3) this.MinLastNameLength = false;
    else this.MinLastNameLength = true;
  }
  LastLengthValidation11() {
    if (this.Display.trim().length < 3) this.MinLastNameLength = false;
    else this.MinLastNameLength = true;
  }
  PhoneLengthValidation() {
    if (this.phnnum.toString().trim().length < 8) this.MinPhoneLength = false;
    else this.MinPhoneLength = true;
    // alert(this.phnnum.toString().trim().length);
  }
  AddressLengthValidation() {
    if (this.addrs.trim().length < 3) this.MinAddressLength = false;
    else this.MinAddressLength = true;
  }
  PinLengthValidation() {
    if (this.code.toString().trim().length < 3)
      this.MinPinLength = false;
    else this.MinPinLength = true;
  }
  LoginLengthValidation() {
    if (this.login.trim().length < 3) this.MinLoginLength = false;
    else this.MinLoginLength = true;
  }
  EmployeeLengthValidation() {
    if (this.Empid.toString().trim().length < 3) this.MinEmployeeLength = false;
    else this.MinEmployeeLength = true;
  }
  reset() {
    this.Fname = "";
    this.lname = "";
    this.Display = "";
    this.phnnum = null;
    this.code = null;
    this.cunname = null;
    this.cty = null;
    this.addrs = "";
    this.role = null;
    this.dept = null;
    this.email = "";
    this.desig = null;
    this.Empid = null;
    this.Comp = null;
    this.Position = null;
    this.Repuser = null;
    this.login = "";
    this.tele1 = null;
    this.tele2 = null;
    this.countrycode = "";
    this.global = null;
    this.iner = null;
    this.IsArchiveApproval = null;
    this.IsCommunication = null;
    this.ArchiveDownload = null;
    this.StreamPlanner = null;
    this._Globaluser = []
  }
  exportAsXLSX(): void {
    this.services.exportAsExcelFile(this.UserRegistration, this.Positions, this.ObjgetCompanyList, this.ObjgetDepartmentList, this.ObjgetRoleList, this.ObjgetDesignationList, 'UserRegistrationlist');
    document.getElementById("bulk-note").classList.add("view");
  }
  isLoading = false;
  ReportingManager:boolean = true;
  progressPercentage = 0; // Track progress percentage
  onFileChange(ev) {
    // this.isLoading = true;
    // let workBook = null;
    // let jsonData = null;
    // const reader = new FileReader();
    // const file = ev.target.files[0];
    // reader.onload = (event) => {
    //   const data = reader.result;
    //   workBook = XLSX.read(data, { type: 'binary' });
    //   jsonData = workBook.SheetNames.reduce((initial, UserRegistration) => {
    //     const sheet = workBook.Sheets["UserRegistration"];
    //     return XLSX.utils.sheet_to_json(sheet);
    //   }, {});
    //   this._excelJsonArray = jsonData;
    //   this.BulkUploadList(this._excelJsonArray);
    // }
    // reader.readAsBinaryString(file);
    this.isLoading = true;
    this.ReportingManager=false;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = (event) => {
      const data = reader.result;
      const workBook = XLSX.read(data, { type: 'binary' });
      const jsonData = workBook.SheetNames.reduce((initial, UserRegistration) => {
        const sheet = workBook.Sheets[UserRegistration];
        return XLSX.utils.sheet_to_json(sheet);
      }, {});
      this._excelJsonArray = jsonData;
      this.BulkUploadList(this._excelJsonArray);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.isLoading = false;
    };

    reader.readAsBinaryString(file);
  }

  // setDownload(data) {
  //   this.willDownload = true;
  //   setTimeout(() => {
  //     const el = document.querySelector("#download");
  //     el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
  //     el.setAttribute("download", 'xlsxtojson.json');
  //   }, 1000)
  // }

  opnblkupd() {
    document.getElementById("blkupd").classList.remove("d-none");
    document.getElementById("stppr").classList.add("d-none");
    document.getElementById("blk-btn").classList.add("d-none");
    document.getElementById("stp-btn").classList.remove("d-none");
  }
  opnstppr() {
    document.getElementById("blkupd").classList.add("d-none");
    document.getElementById("stppr").classList.remove("d-none");
    document.getElementById("blk-btn").classList.remove("d-none");
    document.getElementById("stp-btn").classList.add("d-none");
  }
  _errorExists: boolean = false;
  BulkUploadList(json: any) {
    this._obj.JSONData = JSON.stringify(json);
    debugger
    this.services.BulkUpload(this._obj)
      .subscribe(data => {
        // console.log(data, "bulkdatalist")
        this.isLoading = false;
        this._message = "User Added Successfully";
        // console.log(data["Data"]["UserList"], "UserList");
        this._excelJsonArray = data["Data"]["UserList"];
        this._errorExists = this._excelJsonArray.some(row => row.Error === 1);
        console.log('Any row with Error = 1:', this._errorExists);
      })
  }
  UpdateReportingUser(ReportingUserId, UserId) {
    this._obj.ReportingUserId = ReportingUserId;
    this._obj.UserId = UserId;
    this.services.UpdatedReportUser(this._obj)
      .subscribe(data => {
        // console.log(data,"reuser")
        if (data["Status"] == true) {
          $('#usr_' + UserId).text('ReportUser Added Successfully');
          // this._message="ReportUser Added Successfully";
        }
        else if (data["Status"] == false) {
          $('#usr_' + UserId).text('something went wrong');
          // this._message="Some Went Worng";
        }
      });
  }

  // ECRStorevalue:number;
  // ChangeTabs(_val){
  //   this.ECRStorevalue = _val;
  //  if(_val== 2){
  //   this._customerregistration = true;
  //  }else if(_val==1){
  //   this._customerregistration = false;
  //  }
  
  // }
}