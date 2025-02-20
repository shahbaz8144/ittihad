import { Component, OnInit, ChangeDetectorRef, ViewChild, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { event } from 'jquery';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';
declare var $: any;

@Component({
  selector: 'app-sent-memos',
  templateUrl: './sent-memos.component.html',
  styleUrls: ['./sent-memos.component.css']
})
export class SentMemosComponent implements OnInit {
  @ViewChild('auto') autoComplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwnAddUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnAddUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  SentSearchSubject:any;
  Hasthewords:any;
  activePage: number;
  companyid: number;
  fromuserid: number;
  TotalRecords: number;
  _Search: string;
  _CurrentpageRecords: number;
  _obj: InboxDTO;
  _pageSize: number;
  _LstToMemos: any;
  SentMemoList: any;
  _LstUsers: any;
  _LstCompanies: any;
  _objds: Dataservicedto;
  _LstFilters: any;
  _MemoIds: any;
  txtSearch: string;
  check: boolean = false;
  _LstMemoStatus: any;
  FiltersSelected: boolean;
  Recordsperpage:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  subscription: Subscription;
  ReplyRequired: boolean
  ApprovalPending: boolean
  Expired: boolean
  _Filters: string;
  _checkedMailIds = [];
  MemoView: boolean = false;
  _filtersMessage: string;
  _filtersMessage2: string;
  lastPagerecords: any;
  _All_Parameter: boolean = true;
  LastPage: any;
  Replys: any;
  _UserList: any;
  SentSearch:string;
  ReloadClearFilters:string;
  Nextpage:string;
  Previosepage:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    return this.currentUserSubject.value[0];
  }
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  pipe = new DatePipe('en-US');
  constructor(
    private inboxService: InboxService,
    private cd: ChangeDetectorRef
    , private ds: DataServiceService
    , private _snackBar: MatSnackBar,
    private translate : TranslateService
    ,private renderer: Renderer2
  ) {
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang); 
 this.SentSearch = lang === 'en' ? "Search....." : "......يبحث";
 if(lang == 'ar'){
  this.renderer.addClass(document.body, 'kt-body-arabic');
}else if (lang == 'en'){
  this.renderer.removeClass(document.body, 'kt-body-arabic');
}
 this.translate.getTranslation(lang).subscribe(translations => {
  this.ReloadClearFilters = translations.Communication.tomemotitleReload
});

this.translate.getTranslation(lang).subscribe(translations => {
  this.Nextpage = translations.Communication.tomemotitleNextpage
});

this.translate.getTranslation(lang).subscribe(translations => {
  this.Previosepage = translations.Communication.tomemotitlePreviosepage
});
this.translate.getTranslation(lang).subscribe(translations => {
  this.Recordsperpage = translations.Communication.Recordsperpagetitle;
});
   });
    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this._pageSize = 30;
    this._Search = "";
    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.SentSearch = lang === 'en' ? "Search....." : "يبحث.....";
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Nextpage = translations.Communication.tomemotitleNextpage
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Previosepage = translations.Communication.tomemotitlePreviosepage
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });
    // setTimeout(() => {
    //   this.datesUpdated(event);
    // }, 5000);
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    this.activePage = 1;
    this.companyid = 65000;
    this.fromuserid = 0;
    this.ReplyRequired = false;
    this.ApprovalPending = false;
    this.Expired = false;
    this._Filters = 'All';
    this.SentMemos(this.activePage, this._Search);
    //CCMemosWithFilters
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeTippy()
    }, 2000);
  }

  initializeTippy(){
    const hoverElementIC = document.querySelector('#ReloadClearFilters');
    if (hoverElementIC) {
      // Initialize Tippy.js
      tippy(hoverElementIC, {
        content: 'Clear Filters',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementFRPR = document.querySelector('#Recordsperpage');
    if (hoverElementFRPR) {
      // Initialize Tippy.js
      tippy(hoverElementFRPR, {
        content: 'Records per page',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementSP = document.querySelector('#Previosepage');
    if (hoverElementSP) {
      // Initialize Tippy.js
      tippy(hoverElementSP, {
        content: 'Previosepage',
        placement : 'left-start',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementSN = document.querySelector('#Nextpage');
    if (hoverElementSN) {
      // Initialize Tippy.js
      tippy(hoverElementSN, {
        content: 'Next',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

  }


  Attachment: boolean = false;
  //----- filters_btn actions ----------
  Has_attachment() {
    this.Attachment = !this.Attachment;
    this._obj.HasAttachment = this.Attachment;
    this.SentMemos(this.activePage, this._Search);
    $(".Has_attachment").toggleClass("active");
  }

  select_time() {
    $(".Kt_date_select").toggleClass("active");
  }
  selectedMemoId: string = "0";
  select_User(event) {
    this.selectedMemoId = this._UserList.filter(x => x.ToUserId == event.target.value).map(x => x.MemoIds);
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = "";
    this._obj.All = this._All_Parameter;
    this._obj.Mailids = this.selectedMemoId;
    this._obj.HasAttachment = this.Attachment;
    this.inboxService.SentMemosWithFilters(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"]
        this.SentMemoList = this._LstToMemos.length;
        this.Replys = this._LstToMemos[0]['IsMain'];
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        this.TotalRecords = data["Data"];
        this.TotalRecords = this.TotalRecords["TotalRecordsJSON"]
        this._CurrentpageRecords = this.TotalRecords;
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._LstToMemos.length;
        }
        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        this._objds.Usersdrp = [];
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.ds.sendData(this._objds);
        this.activePage = 1;
        var _FiltersJson = this._obj.FiltersJSON;
        this._LstFilters = _FiltersJson;
        this.cd.detectChanges();
        $(".St_user").addClass("active");
      });

  }

  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }
  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }
  clearSearch() {
    this._Search = '';
    this.SentMemos(this.activePage, this._Search);
  }
  InitialLoadFilters(_val: boolean) {
    this._All_Parameter = _val;
    this.SentMemos(this.activePage, this._Search);
  }
  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      this.SentMemos(this.activePage, this._Search);
    }
  }
  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.SentMemos(this.activePage, this._Search);
    }
  }
  _StartDate: string = '';
  _EndDate: string = '';
  datesUpdated($event) {
    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      //2023-11-01
      this._StartDate = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
    }
  }

  SentMemos(activePage: number, Search: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = activePage;
    this._obj.Search = Search;
    this._obj.All = this._All_Parameter;
    this._obj.Mailids = this.selectedMemoId;
    this._obj.HasAttachment = this.Attachment;
    this._obj.startdate = this._StartDate;
    this._obj.enddate = this._EndDate;

    this.inboxService.SentMemosWithFilters(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"]["MemosJSON"];
        // console.log(this._LstToMemos,"SentMemosData");
        this.SentMemoList = this._LstToMemos.length;
        // console.log(this._LstToMemos, "SentdataJSON");
        this.Replys = this._LstToMemos[0]['IsMain'];
        this._UserList = data["Data"]["UsersJSON"];
        this._UserListSubList = this._UserList;
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        // Old API Response
        // var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        // this.TotalRecords = _totalRecords;

        // this.TotalRecords = data["Data"];
        this.TotalRecords = data["Data"]["TotalRecordsJSON"];
        // this._CurrentpageRecords= _totalRecords.length;
        // this._CurrentpageRecords = this.TotalRecords;

        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._LstToMemos.length;
        }
        // if (this._LstToMemos.length == 0) {
        //   this._filtersMessage = "No more memos matched your search";
        //   this._filtersMessage2 = " Clear the filters & try again";
        // }
        // else if (this._LstToMemos.length > 0) {
        //   this._filtersMessage = "";
        //   this._filtersMessage2 = "";
        // }
        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;

        // var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        // this._LstCompanies = _CompaniesJson;
        // this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = [];
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        // this._objds.ToMemosCount = _totalRecords[0].ToMemosCount;
        // this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // this.activePage = pageNumber;
        var _FiltersJson = this._obj.FiltersJSON;
        this._LstFilters = _FiltersJson;
        this.cd.detectChanges();
      });
  }


  gotoMemoDetailsV2(name, id, replyid) {
    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
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
    this.check = false;
    // this.activePage = pageNumber;
    let _vl = this.TotalRecords / this._pageSize;
    let _vl1 = _vl % 1;
    if (_vl1 > 0.000) {
      this.LastPage = Math.trunc(_vl) + 1;
    }
    else {
      this.LastPage = Math.trunc(_vl);
    }
    if (pageNumber == this.LastPage) {
      this.activePage = this.LastPage;
      this.lastPagerecords = 30;
    }
    else {
      this.activePage = pageNumber;
    }
    this.SentMemos(this.activePage, this._Search);
  }

  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.SentMemos(this.activePage, this._Search);
  }

  FilterUpdate() {
    var newValue = (<HTMLInputElement>document.getElementById("hdnFilterText")).value;
    this._Filters = newValue;
    if (newValue == "Expired") {
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      this.Expired = true;
    }
    else if (newValue == "Reply") {
      this.ReplyRequired = true;
      this.ApprovalPending = false;
      this.Expired = false;
    }
    else if (newValue == "Approval") {
      this.ReplyRequired = false;
      this.ApprovalPending = true;
      this.Expired = false;
    }
    else {
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      this.Expired = false;
    }
    //div_filters
    (<HTMLInputElement>document.getElementById("div_filters")).classList.remove("show");
    //event.startPropagation();
    this.SentMemos(1, this._Search);
  }
  selectAllcheckbox() { // Select All Checkbox functionality 
    for (let value of Object.values(this._LstToMemos)) {
      value['checked'] = this.check;
    }
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });
  }
  Singleselectcheckbox(mailid, value) { // Select single Checkbox functionality 
    if (value == false) this.check = false;
    this._LstToMemos.forEach(element => {
      if (element.MailId == mailid) {
        element["checked"] = value;
        return true;
      }
    });
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });
    let _truecount = 0;
    let _falsecount = 0;
    this._checkedMailIds.forEach(element => {
      if (element.MailView) {
        //click on read memo
        //unread purpose
        _truecount = _truecount + 1;
      }
      else {
        //click on un read memo
        //read purpose
        _falsecount = _falsecount + 1;
      }
    });
    if (_falsecount > 0) {
      this.MemoView = true;
    }
    else {
      this.MemoView = false;
    }
  }

  deletememo(MailId: number) {
    // Delete Memos for multiple selected checkboxes functionality 
    const MemoIdsArray = [];

    if (MailId != 0) { MemoIdsArray.push(MailId); }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });
    this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data['Message'] == "1") {
          this._checkedMailIds.forEach(element => {
            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == element.MailId) {
                elementI["checked"] = false;
                return true;
              }
            });
          });
          this.SentMemos(this.activePage, this._Search);
          this._snackBar.open('Updated Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this._checkedMailIds = [];
          this.check = false;
        }
      }
    )
  }
  deletememo1(MailId: number) {
    // Delete Memos for single selected checkboxes functionality 

    const MemoIdsArray = [];

    if (MailId != 0) { MemoIdsArray.push(MailId); }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    // this._checkedMailIds.forEach(element => {
    //   MemoIdsArray.push(element.MailId);
    // });
    this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data['Message'] == "1") {
          this._checkedMailIds.forEach(element => {
            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == element.MailId) {
                elementI["checked"] = false;
                return true;
              }
            });
          });
          this.SentMemos(this.activePage, this._Search);
          this._snackBar.open('Updated Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this._checkedMailIds = [];
          this.check = false;
        }
      }
    )
  }
  selected:any;
  ClearFilters() {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.All = true;
    this._obj.Mailids = '0';
    this._obj.HasAttachment = false;
    this._obj.startdate = '';
    this._obj.enddate = '';
    this.Attachment = false;
    // this._StartDate = "";
    // this._EndDate = "";
    this.selected = false;
    this.selectedMemoId = '0';
    this.cd.detectChanges();
    // alert(this.selectedMemoId);
    this.inboxService.SentMemosWithFilters(this._obj)
      .subscribe(data => {
        // console.log(data,"sentdata");
        // Old API Response
        // this._obj = data as InboxDTO;
        // var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        // this._LstToMemos = _TOMemosJson;

        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"]
        this.SentMemoList = this._LstToMemos.length;
        // console.log(this._LstToMemos, "SentdataJSON");
        this.Replys = this._LstToMemos[0]['IsMain'];
        this._UserList = data["Data"]["UsersJSON"];
        // console.log(this._UserList, "UserDropDown");
        // console.log(this.Replys,"TRUE")
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        // Old API Response
        // var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        // this.TotalRecords = _totalRecords;

        this.TotalRecords = data["Data"];
        this.TotalRecords = this.TotalRecords["TotalRecordsJSON"]
        // this._CurrentpageRecords= _totalRecords.length;
        this._CurrentpageRecords = this.TotalRecords;

        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._LstToMemos.length;
        }
        // if (this._LstToMemos.length == 0) {
        //   this._filtersMessage = "No more memos matched your search";
        //   this._filtersMessage2 = " Clear the filters & try again";
        // }
        // else if (this._LstToMemos.length > 0) {
        //   this._filtersMessage = "";
        //   this._filtersMessage2 = "";
        // }
        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;

        // var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        // this._LstCompanies = _CompaniesJson;
        // this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = [];
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        // this._objds.ToMemosCount = _totalRecords[0].ToMemosCount;
        // this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        this.activePage = 1;
        var _FiltersJson = this._obj.FiltersJSON;
        this._LstFilters = _FiltersJson;
        this.cd.detectChanges();
      });
    this.check = false;
    $(".Has_attachment").removeClass("active");
    $(".St_user").removeClass("active");
    this._Search = "";
    // alert(this._Search);
    // this._checkedMailIds = [];
    // if (this._pageSize >= this.TotalRecords) {
    //   this._CurrentpageRecords = this.TotalRecords
    // }
    // else {
    //   this._CurrentpageRecords = this._LstToMemos.length;
    // }
    // if (this._LstToMemos.length == 0) {
    //   this._filtersMessage = "No more memos matched your search";
    //   this._filtersMessage2 = " Clear the filters & try again";
    // }
    // else if (this._LstToMemos.length > 0) {
    //   this._filtersMessage = "";
    //   this._filtersMessage2 = "";
    // }
    // $("#div_filters").removeClass("show");
    // $("#txtSearch").val('');

  }
  open_fltrs() {
    document.getElementById("fltrs-drop").classList.add("show-flts");
    document.getElementById("search-grp").classList.add("group-active");
  }
  clse_fltrs() {
      this.SelectedUserIds = [];
    this.SentSearchSubject = "";
    this.Hasthewords = ""
    this.Has_Attachmnet = false;
    this.AddNewUserValues = [];
    this.selected = "";
    document.getElementById("fltrs-drop").classList.remove("show-flts");
    document.getElementById("search-grp").classList.remove("group-active");
  }
  AddNewUserValues: any = [];
  SelectedUserIds: any = [] = [];
  _UserListSubList: any = [];
  isSelection_AddUsers: boolean = false;
  isSelectionAddUser: boolean = false;
  Has_Attachmnet:boolean;
  _AddNewUsers(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = this._UserList.find((user) => user.ToUserId === event.option.value);
    if (selectedEmployee) {
      const index = this.AddNewUserValues.findIndex((_user) => _user.ToUserId === selectedEmployee.ToUserId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.AddNewUserValues.push(selectedEmployee);
        this.SelectedUserIds.push(selectedEmployee.ToUserId);
      } else {
        // User found in the selected array, remove it
        this.AddNewUserValues.splice(index, 1);
        this.SelectedUserIds.splice(index, 1);
      }
    }
    // console.log(this.SelectedUserIds, "SelectValue");

    this._UserListSubList = this._UserList;
    this.isSelection_AddUsers = false;
    // this.AddUserErrorLog = false;
  }
  
  isSelectedAddusers(_User: any): boolean {
    return this.AddNewUserValues.some((usr) => usr.ToUserId === _User.ToUserId);
  }
  filterAddUsers(input: string): void {
    this.isSelectionAddUser = true;
    this._UserListSubList = this._UserList.filter((User) =>
      User.UserName.toLowerCase().includes(input.toLowerCase())
    );
  }
  RemoveAddUser(Users) {
    const index = this.AddNewUserValues.findIndex((usr) => usr.CreatedBy === Users.CreatedBy);
    this.isSelectionAddUser = false;
    if (index !== -1) {
      this.AddNewUserValues.splice(index, 1);
      this.SelectedUserIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }
  OpenAddUsers() {
    this._UserListSubList = this._UserList;
    this.isSelection_AddUsers = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).focus()
  }
  closePanelAddusers() {
    this.isSelectionAddUser = false;
    this.isSelection_AddUsers = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  onNgModelChangeAttachment(e){
    if (e) {
      this._obj.Reply = false;
      this.Has_Attachmnet = false;
    }
  }
  SentFilters(){
    // this.SelectedUserIds
    // this.SentSearchSubject
    // this.Hasthewords
    // this.Has_Attachmnet
    this.inboxService.SentMemosWithFilters(this._obj)
    .subscribe(data => {

    })
  }

  ChangeFavoriteValue(val: boolean, _mailId: number) {
    this.inboxService.FavStatus(_mailId, val,this.currentUserValue.createdby)
      .subscribe(data => {
        if (data['Message'] != "1") {
          alert('Please try again')
        }
        else{
          this.SentMemos(this.activePage, this._Search);
        }
      });
  }
}
