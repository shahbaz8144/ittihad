
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { event } from 'jquery';
import { Subject } from 'rxjs';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import tippy from 'node_modules/tippy.js';
import * as $ from 'jquery';
import { UserPolicyMasterDTO } from 'src/app/_models/user-policy-master-dto';
import { UserPolicyMasterServiceService } from 'src/app/_service/user-policy-master-service.service';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  currentUserSubject: any;
  currentUser: any;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  dtTrigger: Subject<any> = new Subject<any>();
  UserList: any[];
  dtOptions: any = {};
  returnUrl: string;
  UserId: number;
  email: string;
  _obj: UserRegistrationDTO;
  UserDetailsarray: [];
  ObjgetCompanyList: any;
  ObjgetDepartmentList: any;
  ObjgetRoleList: any;
  ObjgetDesignationList: any;
  ObjgetReportingUser: any;
  ObjgetcountryList: any;
  ObjCountryCode: string;
  GlobalUsers: any;
  lstCities: any;
  Fname: string;
  mname: string;
  lname: string;
  Display: string;
  phonenum: number;
  address: string;
  cunname: number;
  cty: number;
  code: number;
  tele1: any;
  tele2: any;

  _CurrentpageRecords: number
  countrycode: string = "";
  companyid: number;
  Positionid: number;
  dept: number;
  role: number;
  login: string;
  Empid: number;
  Repuser: number;
  desig: number;
  global: boolean;
  iner: boolean;
  IsArchiveApproval: boolean;
  IsArchiveDownload: boolean;
  IsStreamPlannerDownload:boolean
  IsCommunication: boolean;
  status: boolean;
  SelectedUserId: number;
  String_status: string;
  MinFirstNameLength: boolean;
  MinLastNameLength: boolean;
  MinPhoneLength: boolean;
  MinAddressLength: boolean;
  MinPinLength = true;
  Usersearch: string = '';
  IsActive: any;
  activePage: number;
  FirstPage: number
  TotalrecordsList: any;
  TotalRecords: number;
  PageNumber: number;
  PageSize: number;
  LastPage: number;
  NextPage: Boolean = false;
  _Search: string;
  closeIcon: boolean;
  CompanyId: any;
  ReportingUserId: number;
  IsCommunicationDownload: any;
  _OrderBy: number;
  // _roleid: number;
  lastPagerecords: number;
  _obj1: UserPolicyMasterDTO;
  CompanyDropdownList: any;
  DepartmentDropdownList: any;
  DesignationDropdownList: any;
  CheckCompany = [];
  CheckDepartment = [];
  CheckDesignation = [];
  _globalsers: any[] = [];
  txtSearch: string;
  currentLang:"ar"|"en"="ar";
  UserSearch:string;
  FiltersSelected: boolean;
  FilterSearch:string;
  SelectGlobalUsers:string;
  constructor(public _services: UserRegistrationService
    , private route: ActivatedRoute,
    public service: UserPolicyMasterServiceService,
    private router: Router, private _snackBar: MatSnackBar, private dialog: MatDialog,
    // public services: UserRegistrationService,
    private translate:TranslateService,
    private renderer: Renderer2,
   @Inject(DOCUMENT) private document: Document,
  ) {
    this.UserList = [];
    this._obj = new UserRegistrationDTO();
    this.PageSize = 10;
    this._Search = "";
    this.CompanyDropdownList = [];
    this.DepartmentDropdownList = [];
    this.DesignationDropdownList = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.UserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.FilterSearch = lang === 'en' ? 'Search Company, Department, Designation...' : 'البحث عن الشركة، القسم، المسمى الوظيفي...';
    this.SelectGlobalUsers = lang === 'en' ? 'Select Global Users' : 'حدد المستخدمين العالميين';
    })

  }
  //private currentUserSubject: BehaviorSubject<UserDTO>;

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
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.UserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.FilterSearch = lang === 'en' ? 'Search Company, Department, Designation...' : 'البحث عن الشركة، القسم، المسمى الوظيفي...';
    this.SelectGlobalUsers = lang === 'en' ? 'Select Global Users' : 'حدد المستخدمين العالميين';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this._OrderBy = 2;
    //alert(this.currentUserValue.RoleId);
    // this._roleid = this..RoleId;
    ;
    setTimeout(function () { $("#hideDiv").fadeOut(1500); }, 3000);
    this._CurrentpageRecords = 0;
    this.activePage = 1;
    this.FirstPage = 1;
    this.countrycode = "+1"
    this.MinFirstNameLength = true;
    this.MinPhoneLength = true;
    this.MinAddressLength = true;
    this.MinPinLength = true;
    this.MinLastNameLength = true;
    this.NextPage = false;
    // this.closeIcon=false;
    // this.GetUserList();
    this.GetUserList();
    this.CompanyandDepartmenrandDesignation();
    ;
    tippy('.tips', {
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      animateFill: true,
      inertia: true,
    });

    $(document).on('ready', function () {
      if ($('#option-two').is(":checked")) {
        $('.radio-group').addClass("br-dr");
      } else {
        $('.radio-group').removeClass("br-dr");
      }
    });

    $(document).ready(function () {
      $(".close-icn").hide();
      $("#txtMainSearch").on("keyup", function () {
        $(".close-icn").show();
      });
    });
    // $('.radio-group').on('click', function() {
    //   if ($('#option-two').prop('checked')) {
    //   $('.radio-group').addClass("bg-danger");
    //   }
    //   else{
    //     return;
    //   }
    // });

  }

  getcities(CountryId) {
    this._obj.CountryId = CountryId;
    this._services.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
      })
  }
  CompanyandDepartmenrandDesignation() {
    this.service.GetCompanyList()
      .subscribe(data => {
        this._obj1 = data as UserPolicyMasterDTO;
        this.CompanyDropdownList = this._obj1.Data["CompanyList"];
        this.DepartmentDropdownList = this._obj1.Data["JDepartmentList"];
        this.DesignationDropdownList = this._obj1.Data["JDesignationList"];
      })
  }
  SortUsers(value) {
    this._OrderBy = value;
    this.GetUserList();
  }
  GetUserList() {
    this._obj.message = this.Usersearch
    this._obj.PageSize = this.PageSize;
    this._obj.PageNumber = this.activePage;
    this._obj.Sortby = this._OrderBy;
    this.CheckCompany = [];
    this.CheckDepartment = [];
    this.CheckDesignation = [];
    this.FiltersSelected = false;
    this.CompanyDropdownList.forEach(element => {
      if (element.isChecked) {
        this.FiltersSelected = true;
        this.CheckCompany.push(element.CompanyId)
      }
    });
    this.DepartmentDropdownList.forEach(element => {
      if (element.isChecked) {
        this.FiltersSelected = true;
        this.CheckDepartment.push(element.DepartmentId)
      }
    });
    this.DesignationDropdownList.forEach(element => {
      if (element.isChecked) {
        this.FiltersSelected = true;
        this.CheckDesignation.push(element.DesignationId);
      }
    });
    this._obj.CompanyIds = this.CheckCompany.toString();
    this._obj.DepartmentIds = this.CheckDepartment.toString();
    this._obj.DesignationIds = this.CheckDesignation.toString();
    this._services.GetUserListByPagination(this._obj, this.currentUserValue.createdby, this.currentUserValue.organizationid).subscribe(data => {
      this._obj = data as UserRegistrationDTO;
      this.UserList = this._obj.Data["UserList"];
      console.log(this.UserList, "user list");
      this.TotalrecordsList = this._obj.Data["TotalRecords"];
      this.TotalRecords = this.TotalrecordsList[0].TotalRecords;
      this._CurrentpageRecords = this.UserList.length;
      if (this.activePage == this.LastPage) {
        this.lastPagerecords = 10;
      }
      let _vl = this.TotalRecords / this.PageSize;
      let _vl1 = _vl % 1;
      if (_vl1 > 0.000) {
        this.LastPage = Math.trunc(_vl) + 1;
      }
      else {
        this.LastPage = Math.trunc(_vl);
      }
      this.txtSearch = "";

    });
  }
  OnRest() {
    this.CompanyDropdownList.forEach(element => {
      element.isChecked = false;
    });
    this.DepartmentDropdownList.forEach(element => {
      element.isChecked = false;
    });
    this.DesignationDropdownList.forEach(element => {
      element.isChecked = false;
    });
  }
  ClearFilters() {
    this._obj.Sortby = 2;
    this._obj.message = "";
    this._obj.PageSize = 10;
    this._obj.PageNumber = 1;
    this.CheckCompany = [];
    this.CheckDepartment = [];
    this.CheckDesignation = [];
    this.FiltersSelected = false;
    this.CompanyDropdownList.forEach(element => {
      element.isChecked = false;
    });
    this.DepartmentDropdownList.forEach(element => {
      element.isChecked = false;
    });
    this.DesignationDropdownList.forEach(element => {
      element.isChecked = false;
    });

    this.CompanyDropdownList.forEach(element => {
      if (element.isChecked) {
        this.CheckCompany.push(element.CompanyId)
      }
    });
    this.DepartmentDropdownList.forEach(element => {
      if (element.isChecked) {
        this.CheckDepartment.push(element.DepartmentId)
      }
    });
    this.DesignationDropdownList.forEach(element => {
      if (element.isChecked) {
        this.CheckDesignation.push(element.DesignationId);
      }
    });
    this._obj.CompanyIds = this.CheckCompany.toString();
    this._obj.DepartmentIds = this.CheckDepartment.toString();
    this._obj.DesignationIds = this.CheckDesignation.toString();
    this._services.GetUserListByPagination(this._obj, this.currentUserValue.createdby, this.currentUserValue.organizationid).subscribe(data => {
      this._obj = data as UserRegistrationDTO;
      this.UserList = this._obj.Data["UserList"]
      this.TotalrecordsList = this._obj.Data["TotalRecords"];
      this.TotalRecords = this.TotalrecordsList[0].TotalRecords;

      this._CurrentpageRecords = this.UserList.length;
        this.Usersearch = "";
      if (this.activePage == this.LastPage) {
        this.lastPagerecords = 10;
      }
      let _vl = this.TotalRecords / this.PageSize;
      let _vl1 = _vl % 1;
      if (_vl1 > 0.000) {
        this.LastPage = Math.trunc(_vl) + 1;
      }
      else {
        this.LastPage = Math.trunc(_vl);
      }
    });
  }

  oncompanycheck(event) {
    this.CompanyDropdownList.forEach(element => {
      if (element.CompanyId == event.target.value) {
        element.isChecked = event.target.checked;
      }
    });

  }
  removeCompany(CompanyId) {
    this.CompanyDropdownList.forEach(element => {
      if (element.CompanyId == CompanyId) {
        element.isChecked = false
      }
    });
  }
  onDepartmentcheck(event) {
    this.DepartmentDropdownList.forEach(element => {
      if (element.DepartmentId == event.target.value) {
        element.isChecked = event.target.checked;
      }
    });
  }
  removeDepartment(DepartmentId) {
    this.DepartmentDropdownList.forEach(element => {
      if (element.DepartmentId == DepartmentId) {
        element.isChecked = false;
      }
    });
  }
  onDesignation(event) {

    this.DesignationDropdownList.forEach(element => {
      if (element.DesignationId == event.target.value) {
        element.isChecked = event.target.checked;
      }
    });
  }
  RemoveDesignation(DesignationId) {
    this.DesignationDropdownList.forEach(element => {
      if (element.DesignationId == DesignationId) {
        element.isChecked = false;
      }
    });
  }
  
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.activePage = 1;
    this.GetUserList();
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.Usersearch) {
      this.GetUserList();
    }
  }


  ReBindData() {
    // this.closeIcon=true;
    this.Usersearch = "";
    // this.GetUserList();
    this.GetUserList();

    // console.log(this.GetUserList,'123')
  }

  onCountryChange(event) {
    this.countrycode = "+" + event.dialCode.toString();

  }
  closeInfo() {
    document.getElementById("proview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  editprof() {
    document.getElementById("proset").classList.toggle("pronew");
    document.getElementById("prodetails").classList.toggle("pronew");
    var procla = document.getElementById("proset");
    var data = document.getElementById("editpro");
    if ($(procla).hasClass("pronew")) {
      data.innerHTML = "View Profile";
    }
    else {
      data.innerHTML = "Edit Profile";
    }
    // if (data.innerHTML === "Edit Profile") {
    //   data.innerHTML = "View Profile";
    // } else {
    //   data.innerHTML = "Edit Profile";
    // }
    document.querySelector("tabs_li").classList.toggle("tab_one");


  }
 
  sidev(UserId) {
    document.getElementById("proview").classList.add("kt-quick-panel--on");
    document.getElementById("scrd").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.SelectedUserId = UserId;
    this._obj.UserId = UserId;
    this._services.GetUserProfile(this._obj)
      .subscribe(data => {
        // debugger
        console.log(data, 'userlist');
        this._obj = data as UserRegistrationDTO;
        this.companyid = this._obj.Data["UserDetails"][0].CompanyId;
        this.Repuser = this._obj.Data["UserDetails"][0].ReportingUserId;
        this.UserDetailsarray = this._obj.Data["UserDetails"];
        // console.log( this.UserDetailsarray,"userlistrep");     
        this.IsActive = this._obj.Data["IsActive"];
        this.ObjgetCompanyList = this._obj.Data["Company"];
        this.ObjgetDepartmentList = this._obj.Data["Department"];
        this.ObjgetRoleList = this._obj.Data["Role"]
        this.ObjgetDesignationList = this._obj.Data["Designation"];
        this.ObjgetReportingUser = this._obj.Data["ReportingUsers"];
        this.ObjgetcountryList = this._obj.Data["Country"];
        this.GlobalUsers = this._obj.Data["GlobalUsers"];
        this.lstCities = this._obj.Data["City"];
        this.Fname = this._obj.Data["UserDetails"][0].FirstName;
        this.mname = this._obj.Data["UserDetails"][0].MiddleName;
        this.lname = this._obj.Data["UserDetails"][0].LastName;
        this.Display = this._obj.Data["UserDetails"][0].DisplayName;
        this.email = this._obj.Data["UserDetails"][0].Email;
        // console.log(this.email, "update list");
        this.phonenum = this._obj.Data["UserDetails"][0].Phone;
        this.countrycode = this._obj.Data["UserDetails"][0].CountryCode;
        this.address = this._obj.Data["UserDetails"][0].Address;
        this.cunname = this._obj.Data["UserDetails"][0].CountryId;
        this.cty = this._obj.Data["UserDetails"][0].CityId;
        this.code = this._obj.Data["UserDetails"][0].PinCode;
        this.tele1 = this._obj.Data["UserDetails"][0].Telephone1;
        this.tele2 = this._obj.Data["UserDetails"][0].Telephone2;
        this.status = this._obj.Data["UserDetails"][0].IsActive;
        this.login = this._obj.Data["UserDetails"][0].UserName;
        const outOfNetworkUsersJson = this._obj.Data["UserDetails"][0].OutOfNetworkUsersJson;
        const parsedData = JSON.parse(outOfNetworkUsersJson);
        this._globalsers = [];
        parsedData.forEach(element => {
          this._globalsers.push(parseInt(element.UserId));
        });
        this.Repuser = this._obj.Data["UserDetails"][0].ReportingUserId;
        this.Empid = this._obj.Data["UserDetails"][0].EmployeeId;
        this.Positionid = this._obj.Data["UserDetails"][0].PositionId;
        this.dept = this._obj.Data["UserDetails"][0].DepartmentId;
        this.role = this._obj.Data["UserDetails"][0].RoleId;
        this.desig = this._obj.Data["UserDetails"][0].DesignationId;
        this.global = this._obj.Data["UserDetails"][0].IsGlobalUser;
        this.iner = this._obj.Data["UserDetails"][0].IsInterCompany;
        this.IsArchiveApproval = this._obj.Data["UserDetails"][0].IsArchiveApproval;
        this.IsCommunication = this._obj.Data["UserDetails"][0].IsCommunicationDownload;
        this.IsArchiveDownload = this._obj.Data["UserDetails"][0].IsArchiveDownload;
        this.IsStreamPlannerDownload = this._obj.Data["UserDetails"][0].IsStreamPlannerDownload;
        // this._globalsers = JSON.parse(this._obj.Data["UserDetails"][0].OutOfNetworkUsersJson);
        // let _ary = [];
        // this._globalsers.forEach(element => {
        //   _ary.push(parseInt(element.UserId))
        // });
        // this._globalsers = JSON.parse(this._obj.Data["UserDetails"][0].OutOfNetworkUsersJson);
        // let _ary = [];
        // this._globalsers.forEach(element => {
        //   const parsedUserId = parseInt(element.UserId);
        //   console.log(`UserId: ${element.UserId}, Parsed: ${parsedUserId}`);
        //   _ary.push(parsedUserId);
        // });
        // console.log('_ary:', _ary);
        // this._globalsers = JSON.parse(this._obj.Data["UserDetails"][0].OutOfNetworkUsersJson);
        // let _ary = [];
        // this._globalsers.forEach(element => {
        //   _ary.push(parseInt(element.UserId));
        // });
        
        //     var ids = this._obj.Data["UserDetails"][0].OutOfNetworkUsersJson;
        // this.selected = ids.split(",");
        //     let _ary = [];
        // for (let index = 0; index < this.selected.length; index++) {
        //   const element = this.selected[index];

        // }
        // this._globalsers = _ary
        // alert( this.login);ReportingUserId
        // this.Repuser = this._obj.Data["UserDetails"][0].ReportingUserName;
      
        // this._globalsers = [];
        // this.getReportingDropDown(this.CompanyId);
        // alert(this.UserId);
       
      });
     
    // this.GetUserList();
    document.getElementById("proset").classList.remove("pronew");
    document.getElementById("prodetails").classList.add("pronew");
  }
  // telInputObject(obj) {
  //   console.log(obj);
  //   obj.setCountry('uae');
  // }
  getReportingDropDown(CompanyId) {
    this._obj.CompanyId = CompanyId;
    this._services.GetReportingUser(this._obj)
      .subscribe(data => {
        this.ObjgetReportingUser = data;
        // alert(this.Repuser);
      });
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;

    if (this.activePage == 1) {
      this.NextPage = false;
    } else {
      this.NextPage = true;
    }
    // this.GetUserList();
    this.GetUserList();

  }
  // userglobal() {
  //   this._obj.ToUserIdsStr = this._globalsers.toString();
  //   this._obj.UserId = this.SelectedUserId
  //   this.services.globaluser(this._obj)
  //     .subscribe(data => {
  //     })
  // }
  OnUpdate(I: number) {
    try {
      // debugger
      this._obj.UserId = this.SelectedUserId;
      this._obj.FirstName = this.Fname;
      this._obj.lastName = this.lname;
      this._obj.DisplayName = this.Display;
      this._obj.UserEmail = this.email;
      // console.log(this.email, "slider");
      this._obj.UserPhone = this.phonenum;
      this._obj.CountryCode = this.countrycode;
      this._obj.UserAddress = this.address;
      this._obj.CityId = this.cty;
      this._obj.CountryId = this.cunname;
      this._obj.UserPincode = this.code;
      this._obj.UserIsActive = this.status;
      // this._obj.UserName = this.login;
      this._obj.ReportingUserId = this.Repuser;
      // alert( this._obj.ReportingUserId)
      this._obj.CompanyId = this.companyid;
      this._obj.DepartmentId = this.dept;
      this._obj.RoleId = this.role;
      this._obj.EmployeeId = this.Empid;
      this._obj.DesignationId = this.desig;
      this._obj.PositionId = this.Positionid;
      this._obj.IsInterCompany = this.iner;
      this._obj.IsArchiveApproval = this.IsArchiveApproval;
      this._obj.IsCommunicationDownload = this.IsCommunication;
      this._obj.IsArchiveDownload = this.IsArchiveDownload;
      this._obj.IsStreamDownload = this.IsStreamPlannerDownload;
      this._obj.IsGlobalUser = this.global;
      // alert(this.global);
      this._obj.FlagId = I;

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
     
        this._services.UpdateUserProfile(this._obj, this.currentUserValue.createdby, this.currentUserValue.organizationid)
        .subscribe(data => {
          // console.log(data, 'userslistupdated')
          this._obj = data as UserRegistrationDTO;
          if (this._obj.message == "1" && I == 1) {
            // (<HTMLInputElement>document.getElementById("txtlongitude")).value = "";
            this._snackBar.open('Personal Details Updated SucessFully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['blue-snackbar']
            });
            this.sidev(this.SelectedUserId);
            this.GetUserList();
          }
          if (this._obj.message == "1" && I == 2) {
            // (<HTMLInputElement>document.getElementById("txtlongitude")).value = "";
            this._snackBar.open('Company Details Updated SucessFully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['blue-snackbar']
            });
            this.sidev(this.SelectedUserId);
            this.GetUserList();
          }
        });
     if(this.global == false){
        this._obj.ToUserIdsStr = "";
    this._obj.UserId = this.SelectedUserId
    this._services.globaluser(this._obj)
      .subscribe(data => {
        // console.log(data,"userrggggggggggggggg");
        // this._globaluser = data
      })
      }
      this._obj.ToUserIdsStr = this._globalsers.toString();
      this._obj.UserId = this.SelectedUserId
      this._services.globaluser(this._obj)
        .subscribe(data => {
        })
      // this.getReportingDropDown(this.CompanyId);
    } catch (error) {
      alert(error);
    }
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
        horizontalPosition: 'right',
        panelClass: ['red-snackbar']
      });
    }
  }
  gotoMemoDetailsV2(name, id) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
  // tabchng() {
  //   document.getElementById("ver0").classList.toggle("tab_one");
  //   document.getElementById("ver1").classList.toggle("tab_one");
  // }
  UpdateStatus(Obj_Status: UserRegistrationDTO) {
    if (Obj_Status.UserIsActive === true) {
      this.String_status = "In-Active"
      document.getElementById("toglesta").classList.remove("fase");
    }
    else {
      this.String_status = "Active"
      document.getElementById("toglesta").classList.add("fase");
    }
    this._services.UpDatedialog_Status(Obj_Status).subscribe(data => {
      this.sidev(Obj_Status.UserId);
      this._snackBar.open('Status Successfully', 'End now', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    });
  }
  TriggerLengthValidation() {
    if (this.Fname.trim().length < 1) {
      this.MinFirstNameLength = false;
    }
    else {
      this.MinFirstNameLength = true;
    }
  }
  LastLengthValidation() {
    if (this.lname.trim().length < 3) {
      this.MinLastNameLength = false;
    }
    else {
      this.MinLastNameLength = true;
    }
  }
  LastLengthValidation11() {
    if (this.Display.trim().length < 3) {
      this.MinLastNameLength = false;
    }
    else {
      this.MinLastNameLength = true;
    }
  }
  PhoneLengthValidation() {
    if (this.phonenum.toString().trim().length < 8) {
      this.MinPhoneLength = false;
    }
    else {
      this.MinPhoneLength = true;
    }
  }
  AddressLengthValidation() {
    if (this.address.trim().length < 3) {
      this.MinAddressLength = false;
    }
    else {
      this.MinAddressLength = true;
    }
  }
  PinLengthValidation() {
    if (this.code.toString().trim().length < 3) {
      this.MinPinLength = false;
    }
    else {
      this.MinPinLength = true;
    }
  }
  onRest() {
    this.Fname = "";
    this.mname = "";
    this.Display = "";
    this.email = "";
    this.countrycode = null;
    this.phonenum = null;
    this.address = "";
    this.cunname = null;
    this.cty = null;
    this.code = null;
    this.tele1 = null;
    this.tele2 = null;
    this.status = null;
    this.Positionid = null;
    this.companyid = null;
    this.dept = null;
    this.role = null;
    this.desig = null;
    this.login = null;
    this.Empid = null;
    this.Repuser = null;
    this.global = null;
    this.iner = null;
    this.IsArchiveApproval = null;
    this.IsCommunication = null;
  }

}
