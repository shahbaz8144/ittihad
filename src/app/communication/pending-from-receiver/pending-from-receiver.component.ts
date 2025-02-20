import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { BehaviorSubject, Observable, Subscription, Subject, interval } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
import Localbase from 'localbase'
import { MatSnackBar } from '@angular/material/snack-bar';
import { InboxfilterService } from 'src/app/_service/inboxfilter.service';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';
//import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
let db = new Localbase('pwa-database')

declare var $: any;
@Component({
  selector: 'app-pending-from-receiver',
  templateUrl: './pending-from-receiver.component.html',
  styleUrls: ['./pending-from-receiver.component.css']
})
export class PendingFromReceiverComponent implements OnInit {
  spinnerStyle = Spinkit;
  _obj: InboxDTO;
  _objds: Dataservicedto;
  _checkedMailIds = [];
  public _LstFilters: any;
  _LstToMemos: any[]=[];
  _dummy: InboxDTO[];
  _LstNewMemos: InboxDTO[];
  _LstUsers: any;
  searchText:string;
  _LstMemoStatus: any;
  _LstTotalRecords: any;
  public _LstRead: any;
  public _LstUnRead: any;
  TotalRecords: number;
  FiltersSelected:boolean;
  activePage: number;
  companyid: number
  fromuserid: number;
  _pageSize: number;
  _all: boolean;
  _Filters: string;
  _OrderType: string;
  _filtervalues: string;
  _Search: string;
  _CurrentpageRecords: number;
  _MemoDetailsJson: any
  _ToUserMemo: any;
  _CCUserMemo: any;
  _MemoDocuments: any;
  _ReplyList: any;
  _Isfilters: boolean
  _MemoIds: any;
  MemoView: boolean = false;
  lastPagerecords:any;
  LastPage:any;
  SearchLabel: string;
  //@Output() bindCompany = new EventEmitter<any>();
  _LstCompaniesTO: any;
  showSpinner: boolean;
  txtSearch: string;
  //exampleChild: string = "Hello Angular Boy...!";
  InboxType:string;
  _filtersMessage:string;
  _filtersMessage2:string;
  _OrderBy:string;
  check: boolean = false;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  subscription: Subscription;
  // pageOfItems: Array<any>;
  items = [];
  intervalId: number;
  checkeduserIDs : any;
  checkedcompanyIDs=[];
  checkedStatus=[];
  keyword = 'name';
  data :any; 
  labelid:number;
  MailId:number;
  PendingformotherSearch:string;
  _ByFilters_Parameter: boolean = true;
  ReloadClearFilters:string;
  Recordsperpage:string;
  selectEvent(item) {
    this.labelid=item.id;
  }
  GetMailId(id:number){
    this.MailId=id;
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(
    private inboxService: InboxService,private cd: ChangeDetectorRef,private ds: DataServiceService,
    private spinnerService: SpinnerService,
    private _snackBar: MatSnackBar,
    private inboxdataloadfilter: InboxfilterService,
    private translate : TranslateService
    ,private renderer: Renderer2
  ) {
     HeaderComponent.languageChanged.subscribe(lang=>{
     localStorage.setItem('language',lang);
     this.translate.use(lang);
    this.PendingformotherSearch = lang === 'en' ? "Search....." : "......يبحث";
    this.SearchLabel = lang === 'en' ? "Search Label...." : "عنوان البحث....";

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      // Access translated title content
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });


     })
    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this._pageSize = 30;
    this._Search = "";
    this._Isfilters = true;
    this._filtervalues = "";
    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;
      this.cd.detectChanges();
    });
  }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.PendingformotherSearch = lang === 'en' ? "Search....." : "......يبحث";
    this.SearchLabel = lang === 'en' ? "Search Label...." : "عنوان البحث....";
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      // Access translated title content
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });
    this.MemoView = false;
    this.activePage=1;
    this.PendingFromOthersMemos(this.activePage,this._Search);
    
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

    const hoverElementPPR = document.querySelector('#Recordsperpage');
    if (hoverElementPPR) {
      // Initialize Tippy.js
      tippy(hoverElementPPR, {
        content: 'Records per page',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementPP = document.querySelector('#previous');
    if (hoverElementPP) {
      // Initialize Tippy.js
      tippy(hoverElementPP, {
        content: 'previous',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementPN = document.querySelector('#Next');
    if (hoverElementPN) {
      // Initialize Tippy.js
      tippy(hoverElementPN, {
        content: 'Next',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }
  }



  ngOnDestroy() {
  }

  AddMemostoLabels(){
    // alert(this.labelid);
    // alert(this.MailId);

    this.inboxService.AddMemoToLabel(this.MailId.toString(),this.labelid.toString(),this.currentUserValue.createdby).subscribe(
      data=>{
        this._obj = data as InboxDTO;
        
        if (this._obj.message == "1") {
          (<HTMLInputElement>document.getElementById("i_"+this.MailId)).classList.remove("d-none");

          this._snackBar.open('Memo Tagged Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          window.close();
        }
        else if (this._obj.message == "2") {
          //(<HTMLInputElement>document.getElementById("i_"+this.MailId)).classList.remove("d-none");
          this._snackBar.open('Memo Already Tagged', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['red-snackbar']
          });
          window.close();
        }
      }
    )
  }
  onFocused(e){
    // do something when input is focused
  }

  // UpdateMailView(MailId: number,_status:boolean){
  //   this.inboxService.UnReadMemo(MailId.toString(),_status,this.currentUserValue.createdby).subscribe(
  //     data=>{
  //       this._obj = data as InboxDTO;
        
  //       if (this._obj.message == "1") {

  //         if(_status==true){
  //           document.getElementById("MemoId_"+MailId).classList.remove("kt-inbox__item--unread");
  //         }
  //         else if(_status==false){
  //           document.getElementById("MemoId_"+MailId).classList.add("kt-inbox__item--unread");
  //         }

  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //         window.close();
  //       }
  //     }
  //   )
  // }
  
  ToMemosFetch() {
    var ud = this.currentUserValue.createdby;
    db.collection('NewMemosList_' + ud).orderBy('MailId', 'desc').get().then((memos: InboxDTO[]) => {
      this._dummy = memos;
      this._LstNewMemos = this._dummy.filter(x => x.NotificationStatus == false && x.IsDeleted == false);
    })
  }
  isCompleted = false;
  InitialLoadFilters(_val: boolean) {
    this._ByFilters_Parameter = _val;
    this.isCompleted = !_val
    this.PendingFromOthersMemos(this.activePage,this._Search);
  }

  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.PendingFromOthersMemos(this.activePage,this._Search);
  }

  
  PendingFromOthersMemos(pageNumber: number, Search: string) {
    
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.Search = Search;
    this._obj.ByFilters = this._ByFilters_Parameter;
    this._obj.PStatusJson='[]';
    this._obj.PCompanyJson='[]';
    this._obj.PUserJson='[]';
    // this._obj.OrderBy= "DESC";
    this._obj.InboxMemosType=this.InboxType;
    this._OrderBy="DESC";
    // this._obj.OrganizationId = this.currentUserValue.organizationid;
    // alert(this.currentUserValue.organizationid);
    this.inboxService.PendingFromOthersMemosBindingWithFilters(this._obj,this.currentUserValue.organizationid)
      .subscribe(data => {
        // console.log(data,"Pendingfromothersdata");
        // Old API Response
        // this._obj = data as InboxDTO;
        // var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        // this._LstToMemos = _TOMemosJson;
        this._LstToMemos = data["Data"]["MemosJSON"];
        // alert(this._LstToMemos.length);
        console.log(this._LstToMemos,"Pending from others Data List");
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        var _totalRecords = data["Data"]["TotalRecordsJSON"];
        
        this.TotalRecords = _totalRecords[0]['TotalRecords'];
        this.totalPages = Math.ceil(this.TotalRecords / this._pageSize); // Total pages
      // console.log(this.TotalRecords,"Total Records");
        this.FiltersSelected = _totalRecords[0]['FiltersSelected'];
        this._CurrentpageRecords=this._LstToMemos.length;
        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;
        // var _statusJson = JSON.parse(this._obj.StatusJSON);
        // this._LstMemoStatus = _statusJson;
        // this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType="All";
        this._objds.ToMemosCount = _totalRecords[0]["TotalRecords"];
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);
        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
        }
        else {
          let _vl = this.TotalRecords / this._pageSize;
          let _vl1 = _vl % 1;
          if (_vl1 > 0.000) {
            this.totalPages = Math.trunc(_vl) + 1;
          }
          else {
            this.totalPages = Math.trunc(_vl);
          }
        }
        this.ds.sendData(this._objds);
        // this.activePage = pageNumber;
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._LstToMemos.length;
        // }
        this.cd.detectChanges();
        // if (this._LstToMemos.length == 0) {
        //   this._filtersMessage = "No more memos matched your search";
        //   this._filtersMessage2 = " Clear the filters & try again";
        // }
        // else if (this._LstToMemos.length > 0) {
        //   this._filtersMessage = "";
        //   this._filtersMessage2 = "";
        // }
      });
  }
  InboxTypeFn(_inboxtype:string){
    this.InboxType=_inboxtype;
    (<HTMLInputElement>document.getElementById("btnAll")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnTO")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnCC")).classList.remove("active");
    
    (<HTMLInputElement>document.getElementById("btn"+_inboxtype)).classList.add("active");

  }

  gotoMemoDetailsV2(name, id,replyid) {
     
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

  storeFilterValue(value: string) {
    if (value == "All") {
      //for ALL Filters
      $('ul li a span.FiltersIcons').removeClass('d-block');
      $('ul li a span.FiltersIcons').removeClass('d-none');
      $('ul li a span.FiltersIcon').removeClass('d-block');
      $('ul li a span.FiltersIcon').removeClass('d-none');
      $('ul li a span.FiltersIcon').addClass('d-none');
      $('#spn_' + value).addClass('d-block');
      $('#hdnFilterText').val(value);
      this._filtervalues = value;
    }
    else {
      $('ul li a span.FiltersIcons').removeClass('d-block');
      $('ul li a span.FiltersIcons').removeClass('d-none');
      $('ul li a span.FiltersIcons').addClass('d-none');

      $('#spn_' + value).addClass('d-block');

      if (this._filtervalues == "All") {
        this._filtervalues = value;
      }
      else {
        this._filtervalues = this._filtervalues + "," + value;
      }
    }
  }
  storeOrderTypeValue(value: string) {
    $('ul li a span.FiltersIconSort').removeClass('d-block');
    $('ul li a span.FiltersIconSort').removeClass('d-none');
    $('ul li a span.FiltersIconSort').addClass('d-none');
    $('#spn_' + value).addClass('d-block');
    $('#hdnFilterOrderType').val(value);
    this._OrderType = value;
  }
  totalPages: number;
  isLastPage(): boolean {
    return this.activePage >= this.totalPages;
  }

  nextPage(): void {
    if (this.activePage < this.totalPages) {
      this.activePage++;
      this.check = false;
      this.PendingFromOthersMemos(this.activePage,this._Search);
    }
  }

  previousPage(): void {
    if (this.activePage > 1) {
      this.activePage--;
      this.check = false
      this.PendingFromOthersMemos(this.activePage,this._Search);
    }
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
    this.PendingFromOthersMemos(this.activePage,this._Search);
  }
  IconSearch(){
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      this.PendingFromOthersMemos(this.activePage,this._Search);
    }
  }
  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.PendingFromOthersMemos(this.activePage,this._Search);
    }
  }
  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }
  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }
  clearSearch(){
    this._Search = '';
    this.PendingFromOthersMemos(this.activePage,this._Search);
  }

  onChangeUser(newValue) {
    this.fromuserid = newValue;
    this.companyid = this.companyid;//previous 65000
    this._all = true;
    this._Isfilters = true; //previous false
    this._filtervalues = "All"; //previous ""
    this.storeFilterValue(this._filtervalues);
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._all, this._Search);
  }


  GetFilters(pageNumber: number, CompanyId: number, FromUserId: number, all: boolean, search: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.Read_F = false;
    this._obj.Conversation_F = false;
    this._obj.All = this._all;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    this._obj.Description = this._OrderType;
    this._obj.Search = search;
    this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = this._Isfilters;
    this._obj.FilterValues = this._filtervalues;
    //alert('All :'+this._all + "----  Filters : "+this._Isfilters);

    this.inboxService.MemosBindingWithFilters(this._obj)
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
        this.FiltersSelected = _totalRecords[0].FiltersSelected;

        this.activePage = pageNumber;

        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._pageSize
        // }

        this._CurrentpageRecords=this._LstToMemos.length;

        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        //this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // this.dbService.add('ToMemos',
        //   {
        //     name: 'PageNumber_' + this.activePage,
        //     ToJSON: JSON.stringify(_TOMemosJson)
        //   }).then(
        //     () => {
        //       //alert(`Page ${this.activePage} added successfully`)
        //       // Do something after the value was added
        //     },
        //     error => {
        //       console.log(error);
        //     }
        //   );

        this.activePage = pageNumber;
        //this.cd.detectChanges();
        //alert('ok')
      });
  }

  FilterUpdate() {
    // var newValue = (<HTMLInputElement>document.getElementById("hdnFilterText")).value;
    // this._filtervalues = newValue;
    this._all = true;
    this._Isfilters = true;
    this.companyid = this.companyid;//previous 65000
    this.fromuserid = this.fromuserid; //previous 0
    this.FilterMemos(this._filtervalues);
    //div_filters
    (<HTMLInputElement>document.getElementById("div_filters")).classList.remove("show");
    //event.startPropagation();
  }
  FilterMemos(filtervalus: string) {
    
    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];
    
    var authorsList = filtervalus.split(",");  
    authorsList.forEach(element => {
       
      var JSONObj = {};
      JSONObj["Status"]=element;
      this.checkedStatus.push(JSONObj);
    });
    
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.ByFilters = true;
    this._obj.PStatusJson=JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson=JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson=JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType=this.InboxType;
    this._obj.OrderBy=this._OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        //alert(this._LstToMemos[0].MemoSource);

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords=this._LstToMemos.length;

        //this._Filters = _totalRecords[0].Filters.toString();
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType="All";

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        
        this.activePage = 1;
        this.cd.detectChanges();

        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        $("#div_filters").removeClass("show");
    });
    
  }

  // deletememo(MailId: number,MemoSource: number) {
  //   this.inboxService.deleteMemo(MailId.toString(),this.currentUserValue.createdby).subscribe(
  //     data => {
  //       this._obj = data as InboxDTO;

  //       if (this._obj.message == "1") {
  //         (<HTMLInputElement>document.getElementById("mailid_" + MailId)).style.display = "none";
  //         var ud = this.currentUserValue.createdby;
  //         // db.collection('NewMemosList_' + ud).doc(MailId.toString()).update({
  //         //   IsDeleted: true
  //         // })
  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //       }
  //     }
  //   )
  // }
  // deletememo(MailId: number) {   // Delete Memos functionality 
  //   const MemoIdsArray = [];

  //   if (MailId != 0) { MemoIdsArray.push(MailId); }
  //   else {
  //     if (this._checkedMailIds.length == 0) {
  //       alert('Please select memo');
  //       return false;
  //     }
  //   }
  //   this._checkedMailIds.forEach(element => {
  //     MemoIdsArray.push(element.MailId);
  //   });
  //   this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
  //     data => {
  //       this._obj = data as InboxDTO;
  //       if (this._obj.message == "1") {
  //         this._checkedMailIds.forEach(element => {
  //           this._LstToMemos.forEach(elementI => {
  //             if (elementI.MailId == element.MailId) {
  //               elementI["checked"] = false;
  //               return true;
  //             }
  //           });
  //         });
  //         this.PendingFromOthersMemos(this.activePage,this._Search);
  //         // this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //         this._checkedMailIds = [];
  //         this.check = false;
  //       }
  //       // if (this._obj.message == "1") {
  //       //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //       //   this._snackBar.open('Updated Successfully', 'End now', {
  //       //     duration: 5000,
  //       //     horizontalPosition: "right",
  //       //     verticalPosition: "bottom",
  //       //   });
  //       // }
  //     }
  //   )
  // }

  // deletememo1(MailId: number) {   // Delete Memos functionality 
  //   const MemoIdsArray = [];

  //   if (MailId != 0) { MemoIdsArray.push(MailId); }
  //   else {
  //     if (this._checkedMailIds.length == 0) {
  //       alert('Please select memo');
  //       return false;
  //     }
  //   }
  //   // this._checkedMailIds.forEach(element => {
  //   //   MemoIdsArray.push(element.MailId);
  //   // });
    
  //   this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
  //     data => {
  //       this._obj = data as InboxDTO;
  //       if (this._obj.message == "1") {
  //         this._checkedMailIds.forEach(element => {
  //           this._LstToMemos.forEach(elementI => {
  //             if (elementI.MailId == element.MailId) {
  //               elementI["checked"] = false;
  //               return true;
  //             }
  //           });
  //         });
  //         this.PendingFromOthersMemos(this.activePage,this._Search);
  //         // this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //         this._checkedMailIds = [];
  //         this.check = false;
  //       }
  //       // if (this._obj.message == "1") {
  //       //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //       //   this._snackBar.open('Updated Successfully', 'End now', {
  //       //     duration: 5000,
  //       //     horizontalPosition: "right",
  //       //     verticalPosition: "bottom",
  //       //   });
  //       // }
  //     }
  //   )
  // }

  ClearFilters(){
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = "";
    this._obj.ByFilters = this._ByFilters_Parameter;
    this._obj.PStatusJson='[]';
    this._obj.PCompanyJson='[]';
    this._obj.PUserJson='[]';
    this._obj.OrderBy="DESC";
    this._obj.InboxMemosType=this.InboxType;
    this.inboxService.PendingFromOthersMemosBindingWithFilters(this._obj,this.currentUserValue.organizationid)
      .subscribe(data => {
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"];
        console.log( this._LstToMemos,"Pending from others");
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        var _totalRecords = data["Data"]["TotalRecordsJSON"];
        
        this.TotalRecords = _totalRecords[0]['TotalRecords'];
        this.FiltersSelected = _totalRecords[0]['FiltersSelected'];
        this._CurrentpageRecords=this._LstToMemos.length;
        this.activePage = 1;
        this._Search = "";
        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;
        // var _statusJson = JSON.parse(this._obj.StatusJSON);
        
        // this._LstMemoStatus = _statusJson;
        // this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType="All";
        this._objds.ToMemosCount = _totalRecords[0]["TotalRecords"];
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);
        // this.activePage = pageNumber;
        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
        }
        else {
          let _vl = this.TotalRecords / this._pageSize;
          let _vl1 = _vl % 1;
          if (_vl1 > 0.000) {
            this.totalPages = Math.trunc(_vl) + 1;
          }
          else {
            this.totalPages = Math.trunc(_vl);
          }
        }
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._LstToMemos.length;
        // }
        this.cd.detectChanges();
        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        
      });

  }


  onuserchange(event)
  {
    
    let a=event.target.value;
    this._LstUsers.forEach(element => {
      if(element.FromUserId==a){
        let chk=element.isChecked;
        if(chk==true){
          element.isChecked=false;
        }
        else if(chk==false){
          element.isChecked=true;
        }
      }
    });
  }
  oncompanychange(event){
    let a=event.target.value;
    this._LstCompaniesTO.forEach(element => {
      if(element.CompanyId==a){
        let chk=element.isChecked;
        if(chk==true){
          element.isChecked=false;
        }
        else if(chk==false){
          element.isChecked=true;
        }
      }
    });
  }
  onstatuschange(event){
    let a=event.target.value;
    this._LstMemoStatus.forEach(element => {
      if(element.Status==a){
        let chk=element.isChecked;
        if(chk==true){
          element.isChecked=false;
        }
        else if(chk==false){
          element.isChecked=true;
        }
      }
    });
  }
  FiltersData(pageNumber:number){
    
    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];

    this._LstUsers.forEach((value, index) => {
      if (value.isChecked) {
        
        var JSONObj = {};
        JSONObj["UserId"]=value.FromUserId;

        this.checkeduserIDs.push(JSONObj);
      }
    });

    this._LstMemoStatus.forEach((value, index) => {
      if (value.isChecked) {
        var JSONObj = {};
        JSONObj["Status"]=value.Status;
        this.checkedStatus.push(JSONObj);
      }
    });
    
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.Search = '';
    this._obj.ByFilters = false;//ByFilters parameter is used in place of ALL in storedProcedure
    this._obj.PStatusJson=JSON.stringify(this.checkedStatus);
    this._obj.PUserJson=JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType=this.InboxType;
    this._obj.OrderBy=this._OrderBy;

    this.inboxService.PendingFromOthersMemosBindingWithFilters(this._obj,this.currentUserValue.organizationid)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        //alert(this._LstToMemos[0].MemoSource);

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this._CurrentpageRecords=this._LstToMemos.length;

        this._OrderType = this._obj.Description;
        // var _UsersJson = JSON.parse(this._obj.UserListJSON);
        // this._LstUsers = _UsersJson;

        // var _statusJson = JSON.parse(this._obj.StatusJSON);
        // this._LstMemoStatus = _statusJson;

        // this._objds.Usersdrp = _UsersJson;
        // this._objds.CompanyId = 0;
        // this._objds.FromUserId = 0;
        // this._objds.FilterRequired = true;

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._LstToMemos.length;
        }
        // this.activePage = pageNumber;
        this.cd.detectChanges();

        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        $("#div_filters").removeClass("show");
    });
  }
  closedataloadSettings(){
    $("#div_filters").removeClass("show");
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
  open_fltrs() {
    document.getElementById("fltrs-drop").classList.add("show-flts");
    document.getElementById("search-grp").classList.add("group-active");
  }
  clse_fltrs() {
    document.getElementById("fltrs-drop").classList.remove("show-flts");
    document.getElementById("search-grp").classList.remove("group-active");
  }
  LablesJson: any = [];
  _checkedLabelIds: any = [];
  SelectLabel: any[];
  rebindinglabel() {
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        // this.data = JSON.parse(this._obj.LablesJson);
        this.LablesJson = data["Data"]["LablesJson"];
        // this.LablesJson = this.LablesJson["LablesJson"]
      });
  }



  labelchange(LabelId) {
    let _value = $("#lbl_" + LabelId).prop('checked');
    if (_value) this._checkedLabelIds.push(LabelId);
    else {
      this._checkedLabelIds = jQuery.grep(this._checkedLabelIds, function (value) {
        return value != LabelId;
      });
    }
    this.SelectLabel = [];
    this._checkedLabelIds.forEach(element => {
      this.LablesJson.forEach(elementI => {
        if (element == elementI.LabelId) {
          this.SelectLabel.push(elementI.LabelName);
        }
      });
    });
  }

  AddMemostoLabels1() {

    if (this._checkedLabelIds.length == 0) {
      alert('Please select label');
      return false;
    }

    if (this._checkedMailIds.length == 0) {
      alert('Please select memo');
      return false;
    }
    const MemoIdsArray = [];
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });

    this.inboxService.AddMemoToLabel(MemoIdsArray.toString(), this._checkedLabelIds.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data["Message"] == "1") {
          this.PendingFromOthersMemos(this.activePage,this._Search);
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم وضع علامة على المذكرة بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Memo Tagged Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }
          // (<HTMLInputElement>document.getElementById("i_" + this.MailId)).classList.remove("d-none")

          window.close();
          $("#div_filters2").removeClass("show");
          this.check = false;
        }
        else if (data["Message"] == "2") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('مذكرة تم وضع علامة عليها بالفعل', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['red-snackbar']
            });
          } else {
            this._snackBar.open('Memo Already Tagged', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['red-snackbar']
            });
          }
          //(<HTMLInputElement>document.getElementById("i_"+this.MailId)).classList.remove("d-none");

          $("#div_filters2").removeClass("show");
          this.check = false;

          // window.close();
          // (<HTMLInputElement>document.getElementById("div_filters2")).classList.remove("show");
        }

        this.SelectLabel = [];
        this._checkedLabelIds = [];
        this._checkedMailIds = [];
      }
    )
  }



  closedataloadSettings1() {
    this._LstToMemos.forEach(elementI => {
      elementI["checked"] = false;
    });
    $("#div_filters").removeClass("show");
    $("#div_filters1").removeClass("show");
    $("#div_filters2").removeClass("show");

    // $('input:input[name="labelckh"]').removeAttr('checked');
    // $('input[name="labelckh"]').each(function () {
    //   this.checked = false;
    // });
    this.SelectLabel = [];
    this._checkedLabelIds = [];
    // this.UserListJSON = [];
    // this.CompanyListJSON =[];
    //     this.StatusJSON = [];


    // $("#checkbox").prop("checked", false);


    // this.checked =""
    // this._checkedMailIds=[];

    // this.UserListJSON.forEach(elementI => {
    //   elementI["isUserChecked"] = false;
    // });
    // this.CompanyListJSON.forEach(elementI => {
    //   elementI["isCompanyChecked"] = false;
    // });
    // this.StatusJSON.forEach(elementI => {
    //   elementI["isChecked"] = false;
    // });



  }


  deletememo(MailId: number) {
    // Delete Memos functionality 
    const MemoIdsArray = [];

    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    } else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    Swal.fire({
      title: this.translate.instant('Communication.title'),
      text: this.translate.instant('Communication.deleteText'),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Communication.confirmButtonText'),
      cancelButtonText: this.translate.instant('Communication.cancelButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
        this._checkedMailIds.forEach(element => {
          MemoIdsArray.push(element.MailId);
        });
        this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
          data => {
            if (data['Message'] == "1") {
              this._checkedMailIds.forEach(element => {
                this._LstToMemos.forEach(elementI => {
                  if (elementI.MailId == element.MailId) {
                    elementI["checked"] = false;
                  }
                });
              });
              this.PendingFromOthersMemos(this.activePage,this._Search);
              this._checkedMailIds = [];
              this.check = false; // Set check to false here
            }
          }
        )
      } else {
        this._checkedMailIds.forEach(element => {
          this._LstToMemos.forEach(elementI => {
            if (elementI.MailId == element.MailId) {
              elementI["checked"] = false;
            }
          });
        });
        this.check = false;
      }
    });
  }



  UpdateMailView(MailId: number, _status: boolean) {  // Read/Unread functionality 
    const MemoIdsArray = [];
    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    }
    else {
      this._checkedMailIds.forEach(element => {
        MemoIdsArray.push(element.ReplyId);
      });
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }

    this.inboxService.UnReadMemo(MemoIdsArray.toString(), _status, this.currentUserValue.createdby).subscribe(
      data => {
        console.log(data, "Unread memo data");
        if (data["Message"] == "1") {
          if (MailId != 0) {
            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == MailId) {
                elementI["checked"] = false;
                elementI["MailView"] = _status == true ? true : false;
                this.cd.detectChanges();
                return true;
              }
            });

          }
          else {
            this._checkedMailIds.forEach(element => {
              // this._LstToMemos.find(value => value.MailId = element.MailId).checked = false;
              this._LstToMemos.forEach(elementI => {
                if (elementI.MailId == element.MailId) {
                  elementI["checked"] = false;
                  elementI["MailView"] = element.MailView == true ? false : true;
                  return true;
                }
              });
            });
            console.log(this._LstToMemos, "Unmemos list data");
          }

          // this._snackBar.open('Updated Successfully', 'End now', {
          //   duration: 5000,
          //   horizontalPosition: "right",
          //   verticalPosition: "bottom",
          // });
          this._checkedMailIds = [];
          this.check = false;

        }
      }
    )
  }


SingleMemoLabel(id: number) {
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj)
      .subscribe(data => {
        this.LablesJson = data["Data"];
        this.LablesJson = this.LablesJson["LablesJson"]
        $("#div_filters2").addClass("show");
        $("#btngroup_label").addClass("show");
        this.LablesJson.forEach(_label => {
          $('#lbl_' + _label.id).prop('checked', false);
          _label.checked = false;
        });


        this.MailId = id;

        this._LstToMemos.forEach(elementI => {
          if (elementI.MailId === id) {
            elementI["checked"] = true;
            this._checkedMailIds.push(elementI);

            if (elementI.SelectedLabels) {
              const _val = elementI.SelectedLabels.split(',');

              if (elementI.IsTag) {
                this.LablesJson.forEach(_label => {
                  _val.forEach(_sel => {
                    if (_label.LabelId == _sel) {
                      $('#lbl_' + _sel).prop('checked', true);
                      _label.checked = true;
                    }
                  });
                });
              }
            }
          } else {
            elementI["checked"] = false;
          }
        });



        // this.MailId = id;
        // this._LstToMemos.forEach(elementI => {
        //   if (elementI.MailId == id) {
        //     elementI["checked"] = true;
        //     this._checkedMailIds.push(elementI);
        //     // alert(elementI.IsTag)
        //     const _val = elementI.SelectedLabels.split(',');
        //     if (elementI.IsTag) {
        //       this.LablesJson.forEach(_label => {
        //         _val.forEach(_sel => {
        //           if (_label.LabelId == _sel) {
        //             $('#lbl_' + _sel).prop('checked', true);
        //             _label.checked = true;
        //           }
        //         });
        //       });
        //     }
        //   }
        //   else {
        //     elementI["checked"] = false;
        //   }
        // });
      });     //single select label

  }



  ChangeFavoriteValue(val: boolean, _mailId: number) {
    // alert(1);
    this.inboxService.FavStatus(_mailId, val, this.currentUserValue.createdby)
      .subscribe(data => {
        if (data['Message'] != "1") {
          alert('Please try again')
        }
        else {
          this.PendingFromOthersMemos(this.activePage,this._Search);
        }
      });
  }





  // CompanyListJSON: any;
  // StatusJSON: any;
  // UserListJSON: any;
  // Dataloadfilter() {
  //   this.inboxdataloadfilter.inboxFilters(this.currentUserValue.createdby)
  //     .subscribe(data => {
  //       this._obj = data as InboxDTO;
  //       this.CompanyListJSON = JSON.parse(this._obj.CompanyListJSON);
  //       this.StatusJSON = JSON.parse(this._obj.StatusJSON);
  //       this.UserListJSON = JSON.parse(this._obj.UserListJSON);
  //     })
  // }
}
