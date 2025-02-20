import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';


@Component({
  selector: 'app-ccmemos',
  templateUrl: './ccmemos.component.html',
  styleUrls: ['./ccmemos.component.css']
})
export class CCMemosComponent implements OnInit {
  activePage: number;
  companyid: number;
  fromuserid: number;
  TotalRecords: number;
  _Search: string;
  _CurrentpageRecords: number;
  _obj: InboxDTO;
  _pageSize: number;
  _LstToMemos: any;
  _LstUsers: any;
  _LstCompanies: any;
  _objds: Dataservicedto;
  _MemoIds: any;

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  subscription: Subscription;

  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(
    private inboxService: InboxService,
    private cd: ChangeDetectorRef
    , private ds: DataServiceService
  ) {
    


    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();

    this._pageSize = 30;
    this._Search = "";

    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;
      if (this._objds.CompanyId != 0) {
        this.onChangeCompany(this._objds.CompanyId)
      }
      if (this._objds.FromUserId != 0) {
        this.onChangeUser(this._objds.FromUserId)
      }
    });
  }

  ngOnInit(): void {
    this.activePage = 1;
    this.companyid = 65000;
    this.fromuserid = 0;

    this.CCMemos(this.activePage, this.companyid, this.fromuserid, this._Search);

    //CCMemosWithFilters
  }

  CCMemos(pageNumber: number, CompanyId: number, FromUserId: number, Search: string) {

    this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.Read_F = false;
    // this._obj.Conversation_F = false;
    // this._obj.All = false;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    // this._obj.Description = "";
    this._obj.Search = Search;
    this._obj.FromUserId = FromUserId;
    // this._obj.ByFilters = true;
    // this._obj.FilterValues = "";


    this.inboxService.CCMemosWithFilters(this._obj)
      .subscribe(data => {

        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
         
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;

        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._pageSize
        }

        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompanies = _CompaniesJson;
        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired=true;
        this._objds.ToMemosCount=_totalRecords[0].CCTotalMemos;
        this._objds.CCMemosCount=_totalRecords[0].TotalRecords;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        this.activePage = pageNumber;

        this.cd.detectChanges();
      });
  }

  CCMemosFilters(pageNumber: number, CompanyId: number, FromUserId: number, Search: string) {

    this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.Read_F = false;
    // this._obj.Conversation_F = false;
    // this._obj.All = false;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    // this._obj.Description = "";
    this._obj.Search = Search;
    this._obj.FromUserId = FromUserId;
    // this._obj.ByFilters = true;
    // this._obj.FilterValues = "";


    this.inboxService.CCMemosWithFilters(this._obj)
      .subscribe(data => {

        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
         
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;

        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._pageSize
        }

        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;

        // var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        // this._LstCompanies = _CompaniesJson;
        // this._objds.Companiesdrp = _CompaniesJson;
        // this._objds.Usersdrp = _UsersJson;
        // this._objds.CompanyId = 0;
        // this._objds.FromUserId = 0;
        // this._objds.ToMemosCount=_totalRecords[0].CCTotalMemos;
        // this._objds.CCMemosCount=_totalRecords[0].TotalRecords;

        // // send message to subscribers via observable subject
        // this.ds.sendData(this._objds);

        this.activePage = pageNumber;

        this.cd.detectChanges();
      });
  }

  gotoMemoDetailsV2(name, id) {
     
    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id);
    //var myWindow = window.open(myurl);
    myWindow.focus();

    localStorage.setItem('MailId', id);
    // this.router.navigateByUrl(myurl).then(e => {
    //   if (e) {
    //     window.open(myurl, '_blank').focus()
    //     console.log("Navigation is successful!");
    //   } else {
    //     console.log("Navigation has failed!");
    //   }
    // });
  }

  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    //this._all=false;
    //this._Search=newValue;
    this.CCMemosFilters(this.activePage, this.companyid, this.fromuserid, this._Search);
  }
  onChangeCompany(newValue) {
    if(newValue==undefined) newValue=65000;
    this.companyid = newValue;
    this.fromuserid = 0;
    this.CCMemosFilters(this.activePage, this.companyid, this.fromuserid, this._Search);
  }
  onChangeUser(newValue) {
    this.fromuserid = newValue;
    this.companyid = 65000;
    this.CCMemosFilters(this.activePage, this.companyid, this.fromuserid, this._Search);
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.CCMemos(this.activePage, this.companyid, this.fromuserid, this._Search);
  }

  Favorite(val: boolean) {
    alert(val);
  }
}
