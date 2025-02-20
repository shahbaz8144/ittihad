import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CompanyhierarchyDTO } from 'src/app/_models/companyhierarchy-dto';
import { CompanyhierarchyService } from 'src/app/_service/companyhierarchy.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';



@Component({
  selector: 'app-company-hierarchy',
  templateUrl: './company-hierarchy.component.html',
  styleUrls: ['./company-hierarchy.component.css']
})
export class CompanyHierarchyComponent implements OnInit {
  _obj: CompanyhierarchyDTO;
  _objII: CompanyhierarchyDTO;
  ObjgetCompanyList: any;
  ObjgetDepartmentList: any;
  ObjgetDepartmentList1: any;
  ObjgetDepartmentList2: any;
  ObjgetRoleList: any;
  ObjgetDesignationList: any;
  ObjgetReportingUser: any;
  DepartmentName: string;
  CompanyId: number;
  CompanyName: string;
  DepartmentId: number;
  SelectedCompanyId: any;
  SelectedDepartmentId: any;
  ExistingDepartmentsarray: [];
  ObjGetUserList: any;
  ObjGetUserListII: any;
  ObjGetCompanyList: any;
  IsActive: boolean;
  UserName: string;
  ObjManagerlist: any;
  Objmemberlist: any;
  ObjTeamMemberId: number;
  KeymemberList: any;
  IsDepartmentHead: boolean;
  IsKeyMember: boolean;
  Manager: string;
  Compy: string;
  Member: string;
  ReportingManagerId: number;
  currentLang:"ar"|"en"="ar";
  CompanyHierarchyselect:string;
  // htmlToAdd:string;


  constructor(public services: CompanyhierarchyService,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this._obj = new CompanyhierarchyDTO;
    this._objII = new CompanyhierarchyDTO;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.CompanyHierarchyselect = lang === 'en' ? 'select' : "يختار";
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
     })
  }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.CompanyHierarchyselect = lang === 'en' ? 'select' : "يختار"
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.GetDropdown();
    this.ObjGetUserList = [];
    this.ObjGetUserListII=[];
    this.ObjGetCompanyList = [];
    this.ObjManagerlist = [];
    this.Objmemberlist = [];
    this.KeymemberList = [];
    // this.htmlToAdd='';
    this.ObjTeamMemberId = 0;
  }
  GetDropdown() { 
    this.services.GetCompanyList()
      .subscribe(data => { 
        this._obj = data as CompanyhierarchyDTO;
        this.ObjgetCompanyList = this._obj.Data["CompanyList"]; 
      })
  }
 
  GetDeptList(CompanyId) {
    this.SelectedCompanyId = CompanyId;
    this._obj.CompanyId = CompanyId; 
    this.services.GetDepartmentList(this._obj)
      .subscribe(data => {
        debugger
        this._obj = data as CompanyhierarchyDTO;
        console.log("extdept:" + this._obj.Data["ExistingDepartments"]);
        this.ObjgetDepartmentList = this._obj.Data["ExistingDepartments"];
        this.ObjgetDepartmentList1 = this._obj.Data["MandatoryDepartments"];
        this.ObjgetDepartmentList2 = this._obj.Data["OptionalDepartments"];
      })
  }
  GetDetailsList(DepartmentId) {
    this.SelectedDepartmentId = DepartmentId;
    this._obj.DepartmentId = DepartmentId;
    this._obj.CompanyId = this.SelectedCompanyId;

    this.services.GetDetailsList(this._obj)
      .subscribe(data => {

        document.getElementById("proview").classList.add("kt-quick-panel--on");
        document.getElementById("scrd").classList.add("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
        this._obj = data as CompanyhierarchyDTO;

        this.CompanyName = this._obj.Data["CompanyName"];
        this.DepartmentName = this._obj.Data["DepartmentName"];
        this.ObjGetUserList = this._obj.Data["UserList"];
        this.ObjGetCompanyList = this._obj.Data["CompanyList"]; 
      })
  }
  GetKeyManager(CompanyId) {
    try {
      this._obj.CompanyId = CompanyId;
      this._obj.SelectedCompanyId = this.SelectedCompanyId;
      this._obj.DepartmentId = this.SelectedDepartmentId;
      this._obj.FlagId = 0;

      this.services.GetKeyList(this._obj)
        .subscribe(data => {
          this._obj = data as CompanyhierarchyDTO;
          this.ObjManagerlist = this._obj.Data["UserList"];

        })
    } catch (error) {
      alert(error)
    }
  }
  GetKeyMembers(CompanyId) {
    try {
       
      this._obj.CompanyId = CompanyId;
      this._obj.SelectedCompanyId = this.SelectedCompanyId;
      this._obj.DepartmentId = this.SelectedDepartmentId;
      this._obj.FlagId = 1;

      this.services.GetKeyList(this._obj)
        .subscribe(data => {
          this._obj = data as CompanyhierarchyDTO;
          this.Objmemberlist = this._obj.Data["UserList"];
        })
    } catch (error) {
      alert(error)
    }
  }
  GetManagerId(managerId) {
    this.Manager = managerId;
  }
  GetMemberId(MemberId) {

    this.Member = MemberId;
  }
  GetselectedUserId(UserId) {
    let ary = [];
    this.ObjTeamMemberId = UserId;

    this.ObjGetUserList.forEach(element => {

      if (UserId == element.ReportingUserId && element.IsDepartmentHead == false) {

        var jsondata = {}
        jsondata["DisplayName"] = element.DisplayName;
        jsondata["Email"] = element.Email;
        jsondata["Phone"] = element.Phone;
        jsondata["EmployeeId"] = element.EmployeeId;
        jsondata["OutsourceId"] = element.OutsourceId;
        ary.push(jsondata);
      }
    });

    this.KeymemberList = ary;
    $('.kt-widget__item').removeClass('selected-div');
    $('#Managerdiv_' + UserId).addClass('selected-div');
  }
  Delete(OutsourceId) {
    this._obj.OutsourceId = OutsourceId;
    this.services.DeleteActingManager(this._obj).subscribe(data => {
      this._objII = data as CompanyhierarchyDTO;
      this.GetDetailsList(this.SelectedDepartmentId);
    })
  }
  DeleteMember(OutsourceId) {
    this._obj.OutsourceId = OutsourceId;
    this.services.DeleteKeymembers(this._obj).subscribe(data => {
      this._obj = data as CompanyhierarchyDTO;
      this._obj.DepartmentId = this.SelectedDepartmentId;
      this._obj.CompanyId = this.SelectedCompanyId;
      this.services.GetDetailsList(this._obj)
        .subscribe(data => {
          this._objII = data as CompanyhierarchyDTO;
          this.ObjGetUserListII = this._objII.Data["UserList"];
          let ary = [];
          this.ObjGetUserListII.forEach(element => {
            if (this.ObjTeamMemberId == element.ReportingUserId && element.IsDepartmentHead == false) {
              var jsondata = {}
              jsondata["DisplayName"] = element.DisplayName;
              jsondata["Email"] = element.Email;
              jsondata["Phone"] = element.Phone;
              jsondata["EmployeeId"] = element.EmployeeId;
              jsondata["OutsourceId"] = element.OutsourceId;
              ary.push(jsondata);
            }
          });
          this.KeymemberList = ary;
        });
    })
    // $('.kt-widget__item').removeClass('selected-div');
    // $('#Managerdiv_' + this.ObjTeamMemberId).addClass('selected-div');
  }
  OnSaveManager(IsDepartmentHead, IsKeyMember) {
    let ids: Array<string>;
    ids = [this.Manager];
    this._obj.UserIds = ids;
    this._obj.CompanyId = this.SelectedCompanyId;
    this._obj.DepartmentId = this.SelectedDepartmentId;
    this._obj.IsDepartmentHead = true;
    this._obj.IsKeyMember = false;
    this.services.SaveManager(this._obj).subscribe(data => {
      this._obj = data as CompanyhierarchyDTO;
      this.GetDetailsList(this.SelectedDepartmentId);
    });
  }
  OnSavekeyMember(IsDepartmentHead, IsKeyMember) {
    let ids: Array<string>;
    ids = [this.Member];
    this._obj.UserIds = ids;
    this._obj.CompanyId = this.SelectedCompanyId;
    this._obj.DepartmentId = this.SelectedDepartmentId;
    this._obj.ReportingManagerId = this.ObjTeamMemberId;
    this._obj.IsDepartmentHead = false;
    this._obj.IsKeyMember = true;
    this.services.SaveManager(this._obj).subscribe(data => {
      this._obj = data as CompanyhierarchyDTO;
      this._obj.DepartmentId = this.SelectedDepartmentId;
      this._obj.CompanyId = this.SelectedCompanyId;
      this.services.GetDetailsList(this._obj)
        .subscribe(data => {
          this._obj = data as CompanyhierarchyDTO;
          this.ObjGetUserListII = this._obj.Data["UserList"];
          let ary = [];
          this.ObjGetUserListII.forEach(element => {
            if (this.ObjTeamMemberId == element.ReportingUserId && element.IsDepartmentHead == false) {
              var jsondata = {}
              jsondata["DisplayName"] = element.DisplayName;
              jsondata["Email"] = element.Email;
              jsondata["Phone"] = element.Phone;
              jsondata["EmployeeId"] = element.EmployeeId;
              jsondata["OutsourceId"] = element.OutsourceId;
              ary.push(jsondata);
            }
          });
          this.KeymemberList = ary;

        })
      $('#add_key_mem').toggle();
      // $('.kt-widget__item').removeClass('selected-div');
      $('#Managerdiv_' + this.ObjTeamMemberId).addClass('selected-div');
    });

  }
  toggleAddKeyMembersdiv() {
    $('#add_key_mem').toggle();
  }
  AddDepartment(DepartmentId, DepartmentName) {
    // this.htmlToAdd=this.htmlToAdd+'<ul class="menu_ul">'
    // +'<li class="list-item menu_li existcrd" (click)="GetDetailsList('+DepartmentId+')">'
    // +'<span class="menu_text" data-toggle="tab">'+DepartmentName+'</span>'
    // +'<span class="material-icons fs-6 mr-1 icn">check</span>'
    // +'</li>'
    // +'</ul>';

    // $('#ExistingDept_ul').append('<ul class="menu_ul"><li class="list-item menu_li existcrd" (click)="GetDetailsList('+DepartmentId+')">'
    // +'<span class="menu_text" data-toggle="tab">'+DepartmentName+'</span>'
    // +'<span class="material-icons fs-6 mr-1 icn">check</span>'
    // +'</li></ul>' );
  }

  closeInfo() {
    document.getElementById("proview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    this.ObjGetUserList = [];
    this.ObjGetCompanyList = [];
    this.ObjManagerlist = [];
    this.Objmemberlist = [];
    this.KeymemberList = [];
  }
  // editprof() {
  //   document.getElementById("proset").classList.toggle("pronew");
  //   document.getElementById("prodetails").classList.toggle("pronew");
  //   document.querySelector("tabs_li").classList.toggle("tab_one");   
  // }
  sidept(DepartmentId) {
    document.getElementById("proview").classList.add("kt-quick-panel--on");
    document.getElementById("scrd").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.GetDetailsList(DepartmentId);
  }
}

