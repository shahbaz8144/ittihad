import { Component, OnInit, ChangeDetectorRef, TemplateRef, Input, ViewChild, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
import Localbase from 'localbase'
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasicsnackbarComponent } from '../basicsnackbar/basicsnackbar.component';
import { BackgroundNewMailsService } from 'src/app/_service/background-new-mails.service';
import { InboxfilterService } from 'src/app/_service/inboxfilter.service';
import { InboxComponent } from '../inbox/inbox.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
let db = new Localbase('pwa-database')
declare var $: any;
// import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { LoaderService } from 'src/app/_service/loader.service';
import { MatRadioButton } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';

@Component({
  selector: 'app-to-memos',
  templateUrl: './to-memos.component.html',
  styleUrls: ['./to-memos.component.css']
})
export class ToMemosComponent implements OnInit {
  @ViewChild('auto') autoComplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  @ViewChild('radio1') radio1: MatRadioButton;
  @ViewChild('radio2') radio2: MatRadioButton;
  @ViewChild('radio3') radio3: MatRadioButton;
  openAutocompleteDrpDwnFrom(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnFrom(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  openAutocompleteDrpDwnComapnyUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCompanyUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  pipe = new DatePipe('en-US');
  HideFilterIcon:boolean = false;
  
  UserListJSON: any;
  isSelectionCompanyUser: boolean = false;
  Company_Values: any = [];
  SelectedCompanyIds: any = [] = [];
  isSelection_CompanyUser: boolean = false;
  CompanuUserSubList: any = [];
  isSelection_Form: boolean = false;
  isSelectionAddForm: boolean = false;
  _Sourcetype: string = '';
  FormValues: any = [];
  SelectedFormIds: any = [] = [];
  _FormListSubList: any = []
  CompanyListJSON: any;
  searchText: string;
  SelectLabel: any[];
  MailIds: any;
  objArray: any = []
  spinnerStyle = Spinkit;
  _obj: InboxDTO;
  FormList: any[] = [];
  Company_List: any[] = [];
  _objds: Dataservicedto;
  check: boolean = false;
  MemoIdsArray: any[];
  public _LstFilters: any;
  HideAnnocument: number = 0;
  Pincount: number;
  _LstToMemos: InboxDTO[] = [];
  _LstTotalMemos: InboxDTO[] = [];
  _LstAutoCompleteMemos: InboxDTO[] = [];
  _LstToPinMemos: InboxDTO[] = [];
  _LstToPinMemos2: InboxDTO[] = [];
  _LstToAnnouncement: InboxDTO[];
  _dummy: InboxDTO[];
  _LstNewMemos: InboxDTO[];
  _LstUsers: any;
  _LstMemoStatus: any;
  _LstTotalRecords: any;
  public _LstRead: any;
  public _LstUnRead: any;
  TotalRecords: number;
  StatusJSON: any;
  FiltersSelected: boolean;
  activePage: number;
  companyid: number
  fromuserid: number;
  Pinmemoshide: boolean = false;
  _pageSize: number;
  _all: boolean;
  _Filters: string;
  _OrderType: string;
  _filtervalues: string;
  _Search: string = '';
  _CurrentpageRecords: number;
  _MemoDetailsJson: any
  _ToUserMemo: any;
  _CCUserMemo: any;
  _MemoDocuments: any;
  _ReplyList: any;
  _Isfilters: boolean
  _MemoIds: any;
  _PinMemoIds: any;
  Has_Attachmnet: boolean = false;
  _IsConfidential: boolean = false;
  Has_All: boolean = false;
  Has_To: boolean = false;
  Has_CC: boolean = false;
  Has_ApprovalPending: boolean = false;
  Has_ReplyRequired: boolean = false;
  Has_Expired: boolean = false;
  Hasthewords: string = "";
  // UnRead: boolean = true;
  MemoView: boolean = false;
  All: boolean = true;
  To: boolean = false;
  CC: boolean = false;
  //@Output() bindCompany = new EventEmitter<any>();
  _LstCompaniesTO: any;
  showSpinner: boolean;
  txtSearch: string;
  //exampleChild: string = "Hello Angular Boy...!";
  InboxType: string;
  _filtersMessage: string;
  _filtersMessage2: string;
  _OrderBy: string;
  LastPage: number;
  lastPagerecords: number;
  PageSize: number;
  LabelSelect: []
  _Lstlabels: any;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  subscription: Subscription;
  CheckLabel: any;
  // pageOfItems: Array<any>;
  items = [];
  intervalId: number;
  checkeduserIDs: any;
  checkedcompanyIDs: any;
  checkedStatus: any;
  _checkedMailIds = [];
  checked: any;
  _UnRead_Parameter: boolean = false;
  keyword = 'name';
  LablesJson: any = [];
  labelid: number;
  MailId: number;
  cancalsearchText: string;
  _StartDate: string = '';
  _EndDate: string = '';
  selected: any;
  DataFromV2: number;
  Recordsperpage: string;
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
  // @ViewChild(InboxComponent) _inbox:any;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  _checkedLabelIds: any = [];
  htmldata: any;
  ToMemoSearch: string;
  SelectCompanyfromhere: string;
  SelectFormfromhere: string;
  Dateselectionrange: string;
  SearchLabel: string;
  Labels: string;
  Delete: string;
  UnRead: string;
  Read: string;
  Addlabel: string;
  Markasunread: string;
  Markasread: string;
  Favorite: string;
  Pinnote: string;
  ReloadClearFilters: string;
  private hubConnectionBuilder!: HubConnection;
  offers: any[] = [];
  readonly signalUrl = this.commonUrl.Signalurl;
  constructor(
    private inboxService: InboxService,
    private cd: ChangeDetectorRef
    , private ds: DataServiceService
    , private spinnerService: SpinnerService
    , private _snackBar: MatSnackBar
    , private newMailService: BackgroundNewMailsService
    , private inboxdataloadfilter: InboxfilterService
    , private commonUrl: ApiurlService
    , public loaderService: LoaderService
    , private translate: TranslateService
    , private renderer: Renderer2,
  ) {
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.ToMemoSearch = lang === 'en' ? "Search....." : "يبحث.....";
      this.SelectCompanyfromhere = lang === 'en' ? "Select Company from here" : "اختر الشركة من هنا";
      this.SelectFormfromhere = lang === 'en' ? "Select User from here" : "حدد النموذج من هنا";
      this.Dateselectionrange = lang === 'en' ? "Date selection range" : "نطاق اختيار التاريخ";
      this.SearchLabel = lang === 'en' ? "Search Label...." : "عنوان البحث...."
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.translate.getTranslation(lang).subscribe(translations => {
        this.Labels = translations.Communication.tomemotitleLabels
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Delete = translations.Communication.tomemotitleDelete
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.UnRead = translations.Communication.titleUnRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Read = translations.Communication.tomemotitleRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Addlabel = translations.Communication.tomemotitleAddlabel
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasunread = translations.Communication.tomemotitleMarkasunread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasread = translations.Communication.tomemotitleMarkasread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Favorite = translations.Communication.tomemotitleFavorite
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Pinnote = translations.Communication.tomemotitlePin
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.ReloadClearFilters = translations.Communication.tomemotitleReload
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        // Access translated title content
        this.Recordsperpage = translations.Communication.Recordsperpagetitle;
      });
    });
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
  NewmemoDataTrigger: any = [];
  ngOnInit(): void {
    const lang: any = localStorage.getItem('language')
    this.translate.use(lang);
    this.ToMemoSearch = lang === 'en' ? "Search....." : "يبحث.....";
    this.SelectCompanyfromhere = lang === 'en' ? "Select Company from here" : "اختر الشركة من هنا";
    this.SelectFormfromhere = lang === 'en' ? "Select User from here" : "حدد النموذج من هنا";
    this.Dateselectionrange = lang === 'en' ? "Date selection range" : "نطاق اختيار التاريخ";
    this.SearchLabel = lang === 'en' ? "Search Label...." : "عنوان البحث...."
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Labels = translations.Communication.tomemotitleLabels
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Delete = translations.Communication.tomemotitleDelete
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.UnRead = translations.Communication.titleUnRead
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Read = translations.Communication.tomemotitleRead
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Addlabel = translations.Communication.tomemotitleAddlabel
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Markasunread = translations.Communication.tomemotitleMarkasunread
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Markasread = translations.Communication.tomemotitleMarkasread
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      // Access translated title content
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });
    this.All = true;
    this.To = false;
    this.CC = false;
    this._Sourcetype = '1';
    this.InboxAnnouncementV2();
    this.htmldata = '<div class="toast show active"><div class="toast-content"><div class=""><div class="d-flex align-items-start flex-1"><div class="ts-pin"><i class="fas fa-thumbtack"></i></div><div class="message flex-1 pr-2"><div class="text text-1">Pin Conversations</div><span class="text text-2">Keep Your Pin Memos at the top of your Memos List</span></div></div></div></div></div>';
    if (this.currentUserValue.PinConversationCount < 6) {
      this._snackBar.openFromComponent(BasicsnackbarComponent, {
        data: this.htmldata,
        duration: 10000000,
        panelClass: 'greensnackbar',
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    this.activePage = 1;
    this.companyid = 65000;
    this.fromuserid = 0;
    this._all = true;
    const Dashboard_FilterValue = localStorage.getItem('Dashboard_FilterValue');
    localStorage.removeItem('Dashboard_FilterValue');
    this._OrderBy = "DESC";
    this.InboxType = "All";
    if (Dashboard_FilterValue != null) {
      console.log(Dashboard_FilterValue, "Dashboard_FilterValue")
      if (Dashboard_FilterValue == 'Approval Pending') {
        this.Has_ApprovalPending = true;
        this.SearchFiltersDataV2(1);
      }
      else if (Dashboard_FilterValue == 'Reply Required') {
        this.Has_ReplyRequired = true;
        this.SearchFiltersDataV2(1);
      } else if (Dashboard_FilterValue == 'UnRead') {
        this.InitialLoadFilters(true);
      }
    }
    else {
      this._UnRead_Parameter = false;
      this.checkeduserIDs = JSON.parse(this.currentUserValue.UserJson);
      this.checkedcompanyIDs = JSON.parse(this.currentUserValue.CompanyJson);
      this.checkedStatus = JSON.parse(this.currentUserValue.StatusJson);
      // this.FilterTypeText = "All";
      this.InboxMailV2(this._OrderBy, this.activePage,);
    }
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    $('.btn-act').on('click', function () {
      $('.btn-act').removeClass('btn-active');
      $(this).addClass('btn-active');
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".btn-act") === false) {
        $(".btn-act").removeClass("btn-active");
      }
    });
    $(document).mouseup(function (e) {
      const myDiv = $('#fltrs-drop');
      const serchgrp = $('#search-grp');

      if (!myDiv.is(e.target) && myDiv.has(e.target).length === 0) {
        if (myDiv.hasClass('show-flts')) {
          myDiv.addClass('show-flts');
          // document.getElementById("fltrs-drop").classList.remove("show-flts"); 
          document.getElementById("search-grp").classList.remove("group-active");
          document.getElementById("filtr-btn").classList.remove("invisible");
          document.getElementById("filtr-btn").classList.remove("srch-btns-active");
          serchgrp.removeClass('group-active');
          document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
        }
      }

      if (!serchgrp.is(e.target) && serchgrp.has(e.target).length === 0) {
        if (serchgrp.hasClass('group-active')) {
          serchgrp.removeClass('group-active');
          document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
        }
      }
    });
    // this.SearchAutoComplete();
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl("http://localhost:5049/offers")
    //   .build();

    // this.hubConnection.start()
    //   .then(() => console.log('Connection started'))
    //   .catch(err => console.error('Error while starting connection: ' + err));

    // this.hubConnection.on('ReceiveMessage', (data) => {
    //   // Handle the received message here
    //   console.log(data);
    // });
    // alert(this.signalUrl);
    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'offers?userId=' + this.currentUserValue.createdby)
      //.configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch(err => console.log('Error while connect with server'));
    this.hubConnectionBuilder.on("ReceiveOffer", (offers) => {

      if (!this.NewmemoDataTrigger) {
        this.NewmemoDataTrigger = [];
      }

      // console.log(this.NewmemoDataTrigger, "To Memos Trigger");

      // // Assuming 'offers' is a JSON string containing an array of records
      // const newOffers = JSON.parse(offers);
      // debugger
      console.log("offers", offers);
      // // Utility function to extract date (YYYY-MM-DD) from a datetime string
      // const getDateOnly = (datetime: string): string => {
      //   return new Date(datetime).toISOString().split('T')[0]; // Extract the date part only
      // };

      // // Iterate over each new offer
      // newOffers.forEach((newOffer: any) => {

      //   // Extract the date (without time) from the new offer
      //   const newOfferDate = getDateOnly(newOffer.MemoDateTime);

      //   // Find the record with the same mailId and date (ignoring time) in the existing NewmemoDataTrigger array
      //   const existingRecord = this.NewmemoDataTrigger.find((existing: any) => {
      //     const existingRecordDate = getDateOnly(existing.MemoDateTime); // Extract the date from the existing record
      //     return existing.MailId === newOffer.MailId && existingRecordDate === newOfferDate;
      //   });

      //   // If a record exists, merge and update count
      //   if (existingRecord) {
      //     existingRecord.ReplyCount = existingRecord.ReplyCount + 1; // Increment count, default to 1 if not present
      //     Object.assign(existingRecord, newOffer); // Merge the newOffer with the existingRecord (you can customize how you merge)
      //   } else {
      //     // If no existing record is found, add a new record with an initial count of 1
      //     newOffer.ReplyCount = 0;
      //     this.NewmemoDataTrigger.push(newOffer);
      //   }
      // });
      // try {


      //   const offers = `{
      //   "Replied": true,
      //   "CustomisedNote": "Memo Initiate",
      //   "LastReplyId": 828150,
      //   "ReplyDate": "2024-09-13T16:21:56.903",
      //   "ReplyCount": 0,
      //   "MailId": 278758,
      //   "MailView": false,
      //   "MemoDateTime": "2024-09-13T13:21:56.903",
      //   "MemoDate": "Sep 13 2024  6:51PM",
      //   "FromUserId": 31,
      //   "Status": "N/A",
      //   "Favorite": false,
      //   "IsConfidential": false,
      //   "Attachment": false,
      //   "Title": "vvvvvvvvvvvv",
      //   "CompanyId": 0,
      //   "DisplayName": "Administrator",
      //   "FromUser": "Administrator(Admin)",
      //   "UserProfile": "Users/31/thumbs/298200_Thumbnail.jpeg",
      //   "UserIcons": [],
      //   "IsPin": false,
      //   "Note": "<p>hiii</p>",
      //   "UserId": 44,
      //   "ParentId": 0,
      //   "IsPolicyDocument": false
      // }`;
      //   // Parse offers data - handling both array and single object case
      //   const parsedOffers = Array.isArray(offers) ? JSON.parse(offers) : [JSON.parse(offers)];
      //   // Utility function to extract date (YYYY-MM-DD) from a datetime string
      //   const getDateOnly = (datetime: string): string => {
      //     return new Date(datetime).toISOString().split('T')[0]; // Extract the date part only
      //   };
      //   // Iterate over each new offer
      //   parsedOffers.forEach((newOffer: any) => {
      //     // Extract the date (without time) from the new offer
      //     const newOfferDate = getDateOnly(newOffer.MemoDateTime);
      //     // Find the record with the same mailId and date (ignoring time) in the existing NewmemoDataTrigger array
      //     const existingRecord = this.NewmemoDataTrigger.find((existing: any) => {
      //       const existingRecordDate = getDateOnly(existing.MemoDateTime); // Extract the date from the existing record
      //       return existing.MailId === newOffer.MailId && existingRecordDate === newOfferDate;
      //     });
      //     // If a record exists, merge and update count
      //     if (existingRecord) {
      //       existingRecord.ReplyCount = (existingRecord.ReplyCount || 0) + 1; // Increment count, default to 0 if not present
      //       Object.assign(existingRecord, newOffer); // Merge the newOffer with the existingRecord (you can customize how you merge)
      //     } else {
      //       // If no existing record is found, add a new record with an initial count of 1
      //       newOffer.ReplyCount = 1;
      //       this.NewmemoDataTrigger.push(newOffer);
      //     }
      //   });
      // } catch (error) {
      //   console.log("error",error);
      // }
      this.NewmemoDataTrigger = this.NewmemoDataTrigger.concat(JSON.parse(offers));
      this.NewmemoDataTrigger = this.NewmemoDataTrigger.sort((a, b) => new Date(b.MemoDateTime).getTime() - new Date(a.MemoDateTime).getTime());
    });
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.initializeTippy()
    }, 2000);
  }

  initializeTippy() {
    const hoverElementIC = document.querySelector('#ReloadClearFilters');
    if (hoverElementIC) {
      // Initialize Tippy.js
      tippy(hoverElementIC, {
        content: 'Clear search',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementEP = document.querySelector('#filtr-btn');
    if (hoverElementEP) {
      // Initialize Tippy.js
      tippy(hoverElementEP, {
        content: 'Show search options',
        placement: 'left-start',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIL = document.querySelector('#dropdownlabel');
    if (hoverElementIL) {
      // Initialize Tippy.js
      tippy(hoverElementIL, {
        content: 'Mark as label(s)',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementID = document.querySelector('#Delete');
    if (hoverElementID) {
      // Initialize Tippy.js
      tippy(hoverElementID, {
        content: 'Move to trash',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIU = document.querySelector('#UnRead');
    if (hoverElementIU) {
      // Initialize Tippy.js
      tippy(hoverElementIU, {
        content: 'Mark as unread',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });


    }

    const hoverElementIR = document.querySelector('#ReadMemo');
    if (hoverElementIR) {
      // Initialize Tippy.js
      tippy(hoverElementIR, {
        content: 'Mark as read',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementIP = document.querySelector('#previous');
    if (hoverElementIP) {
      // Initialize Tippy.js
      tippy(hoverElementIP, {
        content: 'Previous',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementIN = document.querySelector('#Next');
    if (hoverElementIN) {
      // Initialize Tippy.js
      tippy(hoverElementIN, {
        content: 'Next',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementIF = document.querySelector('#Favorite');
    if (hoverElementIF) {
      // Initialize Tippy.js
      tippy(hoverElementIF, {
        content: 'Mark as favorite',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIPM = document.querySelector('#Pinnote');
    if (hoverElementIPM) {
      // Initialize Tippy.js
      tippy(hoverElementIPM, {
        content: 'Mark as pin',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIMP = document.querySelector('#MarkasPin');
    if (hoverElementIMP) {
      // Initialize Tippy.js
      tippy(hoverElementIMP, {
        content: 'Mark as Pin',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIAL = document.querySelector('#Addlabel');
    if (hoverElementIAL) {
      // Initialize Tippy.js
      tippy(hoverElementIAL, {
        content: 'Add Label',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIMAU = document.querySelector('#Markasunread');
    if (hoverElementIMAU) {
      // Initialize Tippy.js
      tippy(hoverElementIMAU, {
        content: 'Mark as unread',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIMAR = document.querySelector('#Markasread');
    if (hoverElementIMAR) {
      // Initialize Tippy.js
      tippy(hoverElementIMAR, {
        content: 'Mark as read',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIRPR = document.querySelector('#Recordsperpage');
    if (hoverElementIRPR) {
      // Initialize Tippy.js
      tippy(hoverElementIRPR, {
        content: 'Records per page',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    // Initialize tooltips for 'Pin Memo Favorite'
    const hoverElementsPF = document.querySelectorAll('.tippy_PinFavorite');
    hoverElementsPF.forEach(hoverElementINMPF => {
      tippy(hoverElementINMPF, {
        content: 'Mark as favorite',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Pin Memo Pin'
    const hoverElementsPP = document.querySelectorAll('.tippy_PinMemoPin');
    hoverElementsPP.forEach(hoverElementINMPP => {
      tippy(hoverElementINMPP, {
        content: 'Remove pin',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Favorite'
    const hoverElementsF = document.querySelectorAll('.tippy_Favorite');
    hoverElementsF.forEach(hoverElementINMF => {
      tippy(hoverElementINMF, {
        content: 'Mark as favorite',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Pin'
    const hoverElementsP = document.querySelectorAll('.tippy_Pin');
    hoverElementsP.forEach(hoverElementINMP => {
      tippy(hoverElementINMP, {
        content: 'Mark as pin',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Label'
    const hoverElementsL = document.querySelectorAll('.tippy_Label');
    hoverElementsL.forEach(hoverElementINML => {
      tippy(hoverElementINML, {
        content: 'Mark as label',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Delete'
    const hoverElementsd = document.querySelectorAll('.tippy_Delete');
    hoverElementsd.forEach(hoverElementINMD => {
      tippy(hoverElementINMD, {
        content: 'Move to trash',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'UnRead'
    const hoverElementsU = document.querySelectorAll('.tippy_Unread');
    hoverElementsU.forEach(hoverElementINMU => {
      tippy(hoverElementINMU, {
        content: 'Mark as unread',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    // Initialize tooltips for 'Read'
    const hoverElementsR = document.querySelectorAll('.tippy_Read');
    hoverElementsR.forEach(hoverElementINMR => {
      tippy(hoverElementINMR, {
        content: 'Mark as read',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

  }

  totalPages: number;
  nextPage(): void {
    if (this.activePage < this.totalPages) {
      this.activePage++;
      this.check = false;
      this.NewmemoDataTrigger = [];
      if (this.DataFromV2 == 1) {
        this.InboxMailV2(this._OrderBy, this.activePage);
      } else if (this.DataFromV2 == 2) {
        this.SearchV2(this._OrderBy, this.activePage);
      } else if (this.DataFromV2 == 3) {
        this.SearchFiltersDataV2(this.activePage);
      }
      document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    }
  }

  previousPage(): void {
    if (this.activePage > 1) {
      this.activePage--;
      this.check = false;
      this.NewmemoDataTrigger = [];
      if (this.DataFromV2 == 1) {
        this.InboxMailV2(this._OrderBy, this.activePage);
      } else if (this.DataFromV2 == 2) {
        this.SearchV2(this._OrderBy, this.activePage);
      } else if (this.DataFromV2 == 3) {
        this.SearchFiltersDataV2(this.activePage);
      }
      document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    }
  }

  // totalPages() {
  //   return Math.ceil(this.TotalRecords / this._pageSize);
  // }
  // Check if the current page is the last page
  isLastPage(): boolean {
    return this.activePage >= this.totalPages;
  }

  onClickPage(pageNumber: number) {
    this.check = false;
    this.NewmemoDataTrigger = [];
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
    if (this.DataFromV2 == 1) {
      this.InboxMailV2(this._OrderBy, this.activePage);
    } else if (this.DataFromV2 == 2) {
      this.SearchV2(this._OrderBy, this.activePage);
    } else if (this.DataFromV2 == 3) {
      this.SearchFiltersDataV2(this.activePage);
    }
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
  }
  datesUpdated($event) {
    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      this._StartDate = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
    }
  }
  fetchData() {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this.newMailService.fetchData(this._obj).subscribe(
      (response) => {
        this._LstNewMemos = JSON.parse(response["NewMemosJSON"]);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  toggleFull() {
    const list = document.getElementById('anc-list');
    if (list) {
      list.classList.toggle('full');
    }
  }

  InitialLoadFilters(_val: boolean) {
    this._UnRead_Parameter = _val;
    this.check = false;
    this.activePage = 1;
    this._pageSize = 30;
    this._Search = "";
    // this.FilterTypeText = _val == false ? "All" : "Unread";
    // $('#btn1').removeClass('active1');
    // $('#btn2').removeClass('active1');
    // $('#btn3').removeClass('active1');
    // $('#btn4').removeClass('active1');
    // $('#' + (_val == true ? 'btn2' : 'btn1')).addClass('active1');
    // this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
    this.InboxMailV2(this._OrderBy, this.activePage);
  }
  SearchAutoComplete() {
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this.inboxService.SearchAutoCompleteService(this._obj)
      .subscribe(data => {
        var _AutoCompleteMemosJson = data["Data"]["SearchAutoCompleteJson"];
        this._LstTotalMemos = _AutoCompleteMemosJson;
        //FilterTypeTextValue
      });
  }

  InboxAnnouncementV2() {
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this.inboxService.InboxAnnouncementV2(this._obj)
      .subscribe(data => {
        this._LstToAnnouncement = data["Data"]["AnnoucementJson"];
        this.HideAnnocument = this._LstToAnnouncement.length;
      });
  }

  InboxMailV2(OrderBy: string, activePage: number) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.pageSize = this._pageSize;
    this._obj.pageNumber = activePage;
    this._obj.OrderBy = OrderBy;
    this._OrderBy = OrderBy;
    this._obj.UnRead = this._UnRead_Parameter;
    if (this._LstToMemos.length > 0 && activePage != 1) {
      // Sort the array in ascending order based on someProperty
      const sortedArray = this._LstToMemos.slice().sort((a, b) => new Date(a.MemoDateTime).getTime() - new Date(b.MemoDateTime).getTime());
      // Get the top 1 item (the first item after sorting)
      const topItem = sortedArray[0].MemoDateTime;
      this._obj.lastCreatedDate = activePage == 1 ? null : topItem;
    }
    this.inboxService.MemoV2(this._obj)
      .subscribe(data => {

        this._LstToMemos = data["Data"]["InboxMails"];
        console.log(this._LstToMemos, "Normal List Data");

        this._LstToPinMemos = data["Data"]["PinMemosJson"];
        console.log(this._LstToPinMemos, "Pin Memos List Data");
        this.Pincount = this._LstToPinMemos.length;
        if (this.activePage === 1 && this.Pincount > 3) {
          this._LstToPinMemos = data["Data"]["PinMemosJson"];
          this._LstToPinMemos2 = [...this._LstToPinMemos];
        }

        let unpinnedMemoDates = this._LstToMemos.map((record: any) =>
          moment(record.MemoDate, 'MMM D YYYY h:mmA').toDate()
        );

        let pinnedIndexesToRemove: number[] = [];

        // Insert pinned memos into _LstToMemos based on their date order
        this._LstToPinMemos2.forEach((pinnedMemo: any, index: number) => {
          const pinnedDate = moment(pinnedMemo.MemoDate, 'MMM D YYYY h:mmA').toDate();
          const position = unpinnedMemoDates.findIndex((unpinnedDate: Date) => pinnedDate > unpinnedDate);

          if (position > -1) {
            this._LstToMemos.splice(position, 0, pinnedMemo);
            pinnedIndexesToRemove.push(index);
          }
        });

        // Remove inserted pinned memos from _LstToPinMemos2
        pinnedIndexesToRemove.reverse().forEach((index) => {
          this._LstToPinMemos2.splice(index, 1);
        });


        this.Pincount = this._LstToPinMemos.length;
        this.TotalRecords = parseInt(data["Data"]["TotalRecords"]);

        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
          this.totalPages = 1;
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

        this._MemoIds = [];

        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = (element.Replied == true || element.IsPolicyDocument == true) ? element.LastReplyId : element.ParentId;
          //element.LastReplyId;
          this._MemoIds.push(_Obj);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        this.DataFromV2 = 1;

        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = (element.Replied == true || element.IsPolicyDocument == true) ? element.LastReplyId : element.ParentId;
          //element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });

        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });
        // alert(this.LastPage);
      });
  }


  _Hideandshown: boolean = false;

  Pinrecordsonoff() {

    this._Hideandshown = !this._Hideandshown;

    if (this._Hideandshown == false) {
      // Remove any previously added pinned memos to avoid duplicates
      this._LstToMemos = this._LstToMemos.filter(
        (memo: any) => !this._LstToPinMemos.some((pinned: any) => pinned.MailId === memo.MailId)
      );

      // Convert the unpinned memo dates for comparison
      let unpinned_memo_dates = this._LstToMemos.map((record: any) => {
        return moment(record.MemoDate, 'MMM D YYYY h:mmA').toDate();
      });

      // Insert each pinned memo into the correct position
      this._LstToPinMemos.forEach((pinnedmemo: any) => {
        const d1 = moment(pinnedmemo.MemoDate, 'MMM D YYYY h:mmA').toDate();
        let position = unpinned_memo_dates.findIndex((d2: any) => d1 > d2);
        if (position > -1) {
          this._LstToMemos.splice(position, 0, pinnedmemo);
        }
      });
    } else {
      // Remove pinned records from _LstToMemos to hide them
      this._LstToPinMemos.forEach((pinnedmemo: any) => {
        let position = this._LstToMemos.findIndex(
          (_memo: any) => _memo.MailId == pinnedmemo.MailId
        );
        if (position > -1) {
          this._LstToMemos.splice(position, 1); // Remove the pinned record
        }
      });
    }
  }


  //   _Hideandshown: boolean = false;
  // Pinrecordsonoff() {
  //   debugger
  //     this._Hideandshown = !this._Hideandshown;
  //     if(this._Hideandshown==false){
  //            let unpinned_memo_dates = this._LstToMemos.map((record: any) =>{
  //              return moment(record.MemoDate, 'MMM D YYYY h:mmA').toDate();
  //            });
  //            this._LstToPinMemos.forEach((pinnedmemo:any)=>{  
  //             const d1=moment(pinnedmemo.MemoDate, 'MMM D YYYY h:mmA').toDate();
  //             let position=unpinned_memo_dates.findIndex((d2:any)=>{  
  //                   const result=d1>d2;
  //                   return result;
  //             })
  //             if(position>-1){
  //               this._LstToMemos.splice(position,0,pinnedmemo);
  //             }
  //            });   
  //     }
  //     else{
  //        this._LstToPinMemos.forEach((pinnedmemo:any)=>{
  //         let position=this._LstToMemos.findIndex((_memo:any)=>_memo.MailId==pinnedmemo.MailId);
  //         if(position>-1){
  //           this._LstToMemos.splice(position,0);
  //         }
  //        });
  //     }

  // }

  // Function to parse date string to a Date object
  parseDate(dateString: string): Date {
    const dateParts = dateString.split(' ');
    const month = dateParts[0];
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const timePart = dateParts[3];

    // Create a new date object based on the parsed components
    const date = new Date(`${month} ${day}, ${year} ${timePart}`); // Comma added for proper parsing
    return date;
  }


  //   _Hideandshown: boolean = false;

  //   Pinrecordsonoff() {
  //     // Toggle _Hideandshown between true and false
  //     this._Hideandshown = !this._Hideandshown;

  //     if (this._Hideandshown == false) {
  //     debugger
  //       // Assuming _LstToMemos and _LstToPinMemos are defined with MemoDate properties
  //       const memoDates = this._LstToMemos.map((record: any) => record.MemoDate);
  //       const memoDatesString = memoDates.join(', ');
  //       console.log("Normal Memo Dates String:", memoDatesString);
  //       const memopinDates = this._LstToPinMemos.map((record: any) => record.MemoDate);
  //       const memoDatesPinString = memopinDates.join(', ');
  //       console.log("Memo Pin Dates String:", memoDatesPinString)
  //       console.log(this._LstToMemos, " finial Normal List");

  //       // const memoDates = this._LstToMemos.map((record: any) => new Date(record.MemoDate));
  //       // const memoDatesPin = this._LstToPinMemos.map((record: any) => new Date(record.MemoDate));

  //       // Get the first and last dates from the normal date list
  //       const firstDate = memoDates[0]; // First record
  //       const lastDate = memoDates[memoDates.length - 1]; // Last record

  //       // Prepare an array to hold the records that fall within the range
  //       const recordsInRange = [];

  //     // Check for pinned dates that fall between the first and last dates
  // for (const pinDate of memopinDates) { // Use the array of pinned dates
  //   const pinDateObj = parseDate(pinDate); // Parse the string to Date object
  //   if (!isNaN(pinDateObj.getTime())) { // Check if the date is valid
  //       if (pinDateObj >= firstDate && pinDateObj <= lastDate) {
  //           recordsInRange.push(pinDate); // Push the pin date into the new array
  //       }
  //   } else {
  //       console.warn(`Invalid date for pinDate: ${pinDate}`); // Log invalid date
  //   }
  // }

  //       // Log the results
  //       console.log("Records in Range:", recordsInRange);


  //       console.log(this._LstToMemos, " final Normal List");
  //     }
  //   }

  // // Function to parse date string to a Date object
  //  parseDate(dateString: string): Date {
  //   const dateParts = dateString.split(' ');
  //   const month = dateParts[0];
  //   const day = parseInt(dateParts[1], 10);
  //   const year = parseInt(dateParts[2], 10);
  //   const timePart = dateParts[3];

  //   // Create a new date object based on the parsed components
  //   const date = new Date(`${month} ${day} ${year} ${timePart}`);
  //   return date;
  // }

  ClearFiltersV2() {
    this._Search = "";
    this.activePage = 1;
    this._pageSize = 30;
    this.HideFilterIcon = false;
    this.InboxMailV2(this._OrderBy, this.activePage);
    this.clse_fltrs_Inbox();
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    document.getElementById("fltrs-drop").classList.remove("show-flts");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("filtr-btn").classList.remove("srch-btns-active");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
  }

  InboxMailLoad(pageNumber: number, _Search: string, OrderBy: string) {
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.OrderBy = OrderBy;
    this._OrderBy = OrderBy;
    this._obj.UnRead = this._UnRead_Parameter;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this.inboxService.MemoLoad(this._obj)
      .subscribe(data => {
        this._obj = data["Data"] as InboxDTO;
        var _TOMemosJson = data["Data"]["MemosJSON"];//JSON.parse(this._obj.MemosJSON.toString());
        this.FiltersSelected = data["Data"]["IsFiltered"];//this._obj.IsFiltered;
        if (this.FiltersSelected == true)
          this.Pinmemoshide = true;
        else
          this.Pinmemoshide = false;
        this._LstToMemos = _TOMemosJson;
        this._LstToPinMemos = data["Data"]["PinMemosJson"];//JSON.parse(this._obj.PinMemosJson);
        this.Pincount = this._LstToPinMemos.length;
        console.log(this.Pincount, "Pincounts");
        this._LstToAnnouncement = data["Data"]["AnnouncementJson"];// JSON.parse(this._obj.AnnoucementJson);
        this.HideAnnocument = this._LstToAnnouncement.length;
        this._LstToAnnouncement.forEach(element => {
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });

        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });

        this._LstToMemos.sort(function (a, b) { return b.MemoDateTime - a.MemoDateTime });
        var _totalRecords = data["Data"]["TotalRecordsJSON"]; //JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = parseInt(_totalRecords);//_totalRecords[0].TotalRecords;
        this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        this._OrderType = this._obj.Description;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // var _FiltersJson = JSON.parse(this._obj.FiltersJSON);
        // this._LstFilters = _FiltersJson;
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords;
        }
        else {
          this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
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
      });

  }


  MailTypes(_Val) {
    this._Sourcetype = _Val.toString();
    if (_Val == 1) {
      this.All = true;
      this.To = false;
      this.CC = false;
    } else if (_Val == 2) {
      this.All = false;
      this.To = true;
      this.CC = false;
    } else if (_Val == 3) {
      this.All = false;
      this.To = false;
      this.CC = true;
    }
  }

  InboxFiltersV2() {
    // this._Sourcetype = '1';
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.InboxFiltersV2(this._obj)
      .subscribe(data => {
        // console.log(data, "SearchV2");
        this.Company_List = data["Data"]["CompanyJson"];
        this.FormList = data["Data"]["FromUsersJson"];
        // console.log(this.FormList, "FromUsersJson");
        // console.log(this.Company_List, "Company");
        // setTimeout(() => {
        //   this.radio1.checked = true;
        //   this.radio2.checked = false;
        //   this.radio3.checked = false;
        // });
      });
  }

  SelectedcompanyArray: any = [];
  SelectedFormUserArray: any = [];
  SubjectText: string = '';
  // SourceType: any;
  SearchFiltersDataV2(activePage: number) {
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid
    this._obj.CompanyIds = this.SelectedCompanyIds.toString();
    this.SelectedcompanyArray = this.Company_List.filter(company => this.SelectedCompanyIds.includes(company.CompanyId));
    this._obj.FromUserIds = this.SelectedFormIds.toString();
    this.SelectedFormUserArray = this.FormList.filter(User => this.SelectedFormIds.includes(User.UserId));
    this._obj.Source = this._Sourcetype;
    this._obj.Subject = this._Search;
    this.SubjectText = this._Search;
    this._obj.IsApprovalPending = this.Has_ApprovalPending === undefined ? false : this.Has_ApprovalPending;
    this._obj.IsReplyRequired = this.Has_ReplyRequired === undefined ? false : this.Has_ReplyRequired;
    this._obj.IsExpired = this.Has_Expired === undefined ? false : this.Has_Expired;
    this._obj.startdate = this._StartDate;
    this._obj.enddate = this._EndDate;
    this._obj.HasAttachment = this.Has_Attachmnet === undefined ? false : this.Has_Attachmnet;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = activePage;
    // this._obj.lastCreatedDate = null;
    if (this._LstToMemos.length > 0 && activePage != 1) {
      const sortedArray = this._LstToMemos.slice().sort((a, b) => new Date(a.MemoDateTime).getTime() - new Date(b.MemoDateTime).getTime());
      const topItem = sortedArray[0].MemoDateTime;
      this._obj.lastCreatedDate = activePage == 1 ? null : topItem;
    }
    this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;
    this.inboxService.SearchFiltersInboxV2(this._obj)
      .subscribe(data => {
        // console.log(data, 'SearchFiltersInboxV2');
        this._LstToMemos = data["Data"]["InboxMails"];
        this.TotalRecords = parseInt(data["Data"]["TotalRecords"]);
        this.totalPages = Math.ceil(this.TotalRecords / this._pageSize);
        this.DataFromV2 = 3;
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        this.HideFilterIcon = false;
        // console.log(this._LstToMemos, "_LstToMemos");
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords;
        // }
        // else {
        //   this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        // }
        // if (this.TotalRecords < 30) {
        //   this.LastPage = this.activePage;
        // }
        // else {
        //   let _vl = this.TotalRecords / this._pageSize;
        //   let _vl1 = _vl % 1;
        //   if (_vl1 > 0.000) {
        //     this.LastPage = Math.trunc(_vl) + 1;
        //   }
        //   else {
        //     this.LastPage = Math.trunc(_vl);
        //   }
        // }
        // this.clse_fltrs();
      });

    // this.clse_fltrs();
    document.getElementById("fltrs-drop").classList.remove("show-flts");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("filtr-btn").classList.remove("srch-btns-active");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
  }
 
  open_fltrs() {
    this.HideFilterIcon = true;
    document.getElementById("fltrs-drop").classList.add("show-flts");
    document.getElementById("search-grp").classList.add("group-active");
    document.getElementById("filtr-btn").classList.add("srch-btns-active");
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    // document.getElementById("filtr-btn").classList.add("invisible");
  }

  clse_fltrs() {
    this.HideFilterIcon = false;
    // this.FormValues = [];
    // this.Company_Values = [];
    // this._Search = "";
    // this.Hasthewords = "";
    // this.Has_Attachmnet = false;
    // this._IsConfidential = false;
    // this.Has_ApprovalPending = false;
    // this.Has_ReplyRequired = false;
    // this.Has_Expired = false;
    // this.selected = "";
    // $('#radio_1').prop('checked', true);
    // $('#radio_2').prop('checked', false);
    // $('#radio_3').prop('checked', false);

    document.getElementById("fltrs-drop").classList.remove("show-flts");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("filtr-btn").classList.remove("srch-btns-active");
    document.getElementById("search-grp").classList.remove("group-active");
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    // document.getElementById("filtr-btn").classList.remove("invisible");
  }

  clse_fltrs_Inbox() {
    this.SelectedCompanyIds = [];
    this.Company_Values = [];
    this.FormValues = [];
    this.SelectedFormIds = [];
    this._Sourcetype = "1";
    this._Search = "";
    this.Hasthewords = "";
    this.Has_Attachmnet = false;
    this._IsConfidential = false;
    this.Has_ApprovalPending = false;
    this.Has_ReplyRequired = false;
    this.Has_Expired = false;
    this.selected = "";
    setTimeout(() => {
      this.radio1.checked = true;
      this.radio2.checked = false;
      this.radio3.checked = false;
    });
  }

  FiltersData() {
    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];

    // this.UserListJSON.forEach((value, index) => {
    //   if (value.isUserChecked) {
    //     var JSONObj = {};
    //     JSONObj["UserId"] = value.UserId;
    //     this.checkeduserIDs.push(JSONObj);
    //   }
    // });

    // alert(this.checkeduserIDs.length);
    // this.CompanyListJSON.forEach((value, index) => {
    //   if (value.isCompanyChecked) {
    //     var JSONObj = {};
    //     JSONObj["CompanyId"] = value.CompanyId;
    //     this.checkedcompanyIDs.push(JSONObj);
    //   }
    // });

    this.StatusJSON.forEach((value, index) => {
      if (value.isChecked) {
        var JSONObj = {};
        JSONObj["Status"] = value.Status;
        this.checkedStatus.push(JSONObj);
      }
    });
    this._UnRead_Parameter = false;
    var dataII = localStorage.getItem('currentUser');
    if (dataII != null) {
      let cart = JSON.parse(dataII);
      // cart[0].UserJson = JSON.stringify(this.checkeduserIDs);
      // cart[0].CompanyJson = JSON.stringify(this.checkedcompanyIDs);
      cart[0].StatusJson = JSON.stringify(this.checkedStatus);
      localStorage.setItem('currentUser', JSON.stringify(cart));
    }
    // this.InboxMailLoad(1, "", "DESC");
    this.InboxMailV2(this._OrderBy, this.activePage);
    this.Pinmemoshide = true;
    document.getElementById("data-fltrs-drop").classList.remove("show-flts");
    document.getElementById("data-btn").classList.remove("btn-act");
    // (<HTMLInputElement>document.getElementById("div_filters")).classList.remove("show");
  }
  ngOnDestroy() {
    //this.subscription && this.subscription.unsubscribe();
    // this._subscription.unsubscribe();
  }
  selectEvent(item) {
    this.labelid = item.id;
    // do something with selected item
  }
  Labeldata: any
  rebindinglabel() {
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        // this.data = JSON.parse(this._obj.LablesJson);
        this.LablesJson = data["Data"];
        this.LablesJson = this.LablesJson["LablesJson"]
      });
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
  AddMemostoLabels() {
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
          // this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
          this.InboxMailV2(this._OrderBy, this.activePage);
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

  onFocused(e) {
    // do something when input is focused
  }

  UnReadSelect(MailIds) {
    const MemoIdsArray = [];
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });
    this.MemoIdsArray = MailIds
  }
  ToMemosFetch() {
    var ud = this.currentUserValue.createdby;
    db.collection('NewMemosList_' + ud).orderBy('MailId', 'desc').get().then((memos: InboxDTO[]) => {
      this._dummy = memos;
      this._LstNewMemos = this._dummy.filter(x => x.NotificationStatus == false && x.IsDeleted == false);
    })
  }
  // PinCount = 0; // Counter for "true" (pin)
  UnpinCount = 0; // Counter for "false" (unpin)
  MaxLimit = 3; // Maximum allowed actions for each
  MemoPin(MailId, status) {
    if (status === true && this.Pincount >= this.MaxLimit) {
      // Swal.fire({
      //   icon: 'warning', 
      //   title: 'Limit Reached',
      //   text: 'You have already pinned the maximum number of times.',
      //   confirmButtonColor: '#3085d6',
      //   confirmButtonText: 'OK',
      // });
      Swal.fire({
        title: 'Limit Reached',
        text: 'You have already pinned the maximum(3) number of time(s).',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }
    // Update counters based on the status
    if (status === true) {
      this.Pincount++;
    }
    // else {
    //   this.UnpinCount++;
    // }
    $('#MemoId_' + MailId).hide();
    this.inboxService.UpdateMemoPin(MailId, status, this.currentUserValue.createdby, this.currentUserValue.organizationid).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data["Message"] == "1") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم التحديث بنجاح', 'End now', {
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

          // this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
          this.InboxMailV2(this._OrderBy, this.activePage);
        }
      }
    )
  }

  ToMemos(pageNumber: number, Search: string, OrderBy: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.Read_F = false;
    // this._obj.Conversation_F = false;
    // this._obj.All = this._all;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    // this._obj.FlagId = CompanyId;
    // this._obj.Description = "DESC";
    this._obj.Search = Search;
    //this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = false;
    // this._obj.FilterValues = "";
    this._obj.PStatusJson = '[]';
    this._obj.PCompanyJson = '[]';
    this._obj.PUserJson = '[]';
    this._obj.OrderBy = OrderBy;
    this._obj.InboxMemosType = this.InboxType;
    this._OrderBy = OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;
        this._LstToPinMemos = JSON.parse(this._obj.PinMemosJson);
        this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        this._LstToAnnouncement.forEach(element => {
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });


        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });

        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });


        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = parseInt(_totalRecords[0].TotalRecords);
        this.FiltersSelected = _totalRecords[0].FiltersSelected;

        this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _LabelsJson = JSON.parse(this._obj.LablesJson);
        this.LablesJson = _LabelsJson;
        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType = "All";
        // this.Pinmemoshide = true;
        // alert(this.Pinmemoshide);
        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        //this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);
        // $('.kt-pin-v').addClass('pinnedv');
        // var _FiltersJson = JSON.parse(this._obj.FiltersJSON);
        // this._LstFilters = _FiltersJson;
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords;
        }
        else {
          this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
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
      });
  }

  InboxTypeFn(_inboxtype: string) {
    this.InboxType = _inboxtype;
    (<HTMLInputElement>document.getElementById("btnAll")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnTO")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnCC")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btn" + _inboxtype)).classList.add("active");
  }
  gotoMemoDetailsV2(name: any, id: any, replyid: any) {

    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
  }

  NavigateToMemoDetails(name: any, id: any, replyid: any, Replied: any, IsPolicyDocument: any, ParentId: any,CustomisedNote:any) {
     
    var url = document.baseURI + name;
    replyid = (Replied == true || IsPolicyDocument == true) ? replyid :
    ((Replied == false && (CustomisedNote == 'User Removed' || CustomisedNote == 'User Restore')) ? replyid :ParentId);
    
    var myurl = `${url}/${id}/${replyid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
  }

  gotoAnnoucementDetailsV2(name, id) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
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



  onChangeCompany(newValue) {
    if (newValue == undefined) newValue = 65000;
    this.companyid = newValue;
    this.fromuserid = this.fromuserid;
    this._all = true;
    this._Isfilters = true; //previous false
    this._filtervalues = "All"; //previous ""
    this.storeFilterValue(this._filtervalues)
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._all, this._Search);
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

  SearchV2(OrderBy: string, activePage: number) {
    this.activePage = activePage;
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.pageSize = this._pageSize;
    this._obj.pageNumber = activePage;
    this._obj.OrderBy = OrderBy;
    this._OrderBy = OrderBy;
    this._obj.Searchtxt = this._Search;
    if (this._LstToMemos.length > 0 && activePage != 1) {
      // Sort the array in ascending order based on someProperty
      const sortedArray = this._LstToMemos.slice().sort((a, b) => new Date(a.MemoDateTime).getTime() - new Date(b.MemoDateTime).getTime());
      // Get the top 1 item (the first item after sorting)
      const topItem = sortedArray[0].MemoDateTime;
      this._obj.lastCreatedDate = activePage == 1 ? null : topItem;
    }
    this.inboxService.InboxSearchV2(this._obj)
      .subscribe(data => {
        console.log(data, "Search Data");
        this._obj = data["Data"] as InboxDTO;
        this._LstToMemos = data["Data"]["InboxMails"];
        console.log(this._LstToMemos, "Serach");
        this.TotalRecords = parseInt(data["Data"]["TotalRecords"]);
        // console.log(this.TotalRecords,"Seeach V2");
        // this.totalPages = Math.ceil(this.TotalRecords / this._pageSize);
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        this.DataFromV2 = 2;
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords;
        // }
        // else {
        //   this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        // }
        // this.lastPagerecords = parseInt(this._LstToMemos.length.toString());

        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
          this.totalPages = 1;
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

      });
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
    //this.ToMemos(this.activePage, this._Search, this._OrderBy);
    // this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
  }

  searhKeydown(event: KeyboardEvent) {
   
    document.getElementById("div_search_autocomplete").classList.add("show-search-filter");
    // if (event.key === "Backspace" && this._Search === "") {
    //   this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
    // }
  }


  // handleKeyUp(event: KeyboardEvent): void {
  //   if (event.key === 'Backspace' && !this._Search) {
  //     this.SearchV2(this._OrderBy, this.activePage);
  //   }
  // }

  onPaste(event: ClipboardEvent) {
    document.getElementById("div_search_autocomplete").classList.add("show-search-filter");
    const _search = event.clipboardData?.getData('text/plain');
    // this._LstAutoCompleteMemos = this._LstTotalMemos
    //   .filter(item =>
    //     (item.Subject && item.Subject.toLowerCase().includes(_search.toLowerCase())) ||
    //     (item.FromUser && item.FromUser.toLowerCase().includes(_search.toLowerCase()))
    //   )
    //   //.sort((a, b) => b.MemoDateTime.localeCompare(a.MemoDateTime))
    //   .slice(0, 5);
  }

  searhKeyup() {
    if (this._Search.replace(/^\s+/, '').length != 0) {
      const _search = this._Search.replace(/^\s+/, '');

      // this._LstAutoCompleteMemos = this._LstTotalMemos
      //   .filter(item =>
      //     (item.Subject && item.Subject.toLowerCase().includes(_search.toLowerCase())) ||
      //     (item.FromUser && item.FromUser.toLowerCase().includes(_search.toLowerCase()))
      //   )
      //   .sort((a, b) => b.MemoDateTime.localeCompare(a.MemoDateTime))
      //   .slice(0, 5);

      // document.getElementById("div_search_autocomplete").classList.add("show-search-filter");
      // document.getElementById("search-grp").classList.add("group-active");
    }
    else if (this._Search.replace(/\s+/g, '').length == 0)
      document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");
  }

  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      // this.ToMemos(this.activePage, this._Search, this._OrderBy);
      this.SearchV2(this._OrderBy, this.activePage);
    }
  }

  ocrSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("ocrtxtSearch")).focus();
      document.getElementById("ocr-search-grp").classList.add("group-active");
    } else {
      this.ToMemos(this.activePage, this._Search, this._OrderBy);
    }
  }

  clearSearch() {
    this._Search = '';
    this.ClearFiltersV2();
    document.getElementById("div_search_autocomplete").classList.remove("show-search-filter");

  }

  Searchighlight() {
    this.HideFilterIcon = false;
    document.getElementById("div_search_autocomplete").classList.add("show-search-filter");
    document.getElementById("search-grp").classList.add("group-active");
    document.getElementById("fltrs-drop").classList.remove("show-flts");
  }
  Ocrsearchighlight() {
    document.getElementById("ocr-search-grp").classList.add("group-active");
  }
  clearhide() {
    document.getElementById("clrr-btn").classList.add("d-none");
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
        this._LstToPinMemos = JSON.parse(this._obj.PinMemosJson);
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });

        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });


        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = parseInt(_totalRecords[0].TotalRecords);
        this.FiltersSelected = _totalRecords[0].FiltersSelected;

        this.activePage = pageNumber;

        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._pageSize
        // }

        this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());

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
        //     }
        //   );
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords;
        }
        else {
          this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        }
        // this.activePage = pageNumber;
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
      if (element == "UnRead") {
        this._UnRead_Parameter = true;
      }
      else {
        JSONObj["Status"] = element;
        this.checkedStatus.push(JSONObj);
      }

    });
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.OrderBy = "DESC";
    this._OrderBy = "DESC";
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.UnRead = this._UnRead_Parameter;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this.inboxService.MemoLoad(this._obj)
      .subscribe(data => {

        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this.FiltersSelected = this._obj.IsFiltered;
        this._LstToMemos = _TOMemosJson;
        this._LstToPinMemos = JSON.parse(this._obj.PinMemosJson);
        this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        this._LstToAnnouncement.forEach(element => {
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });
        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });
        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = parseInt(_totalRecords);//_totalRecords[0].TotalRecords;

        this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        this._OrderType = this._obj.Description;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // var _FiltersJson = JSON.parse(this._obj.FiltersJSON);
        // this._LstFilters = _FiltersJson;
        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords;
        }
        else {
          this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
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
      });

  }

  UpdateMailView(MailId: number, _status: boolean) {  // Read/Unread functionality 
    const MemoIdsArray = [];
    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    }
    else {
      this._checkedMailIds.forEach(element => {
        MemoIdsArray.push(element.LastReplyId);
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

  //   deletememo(MailId: number) {
  //     // Delete Memos for multiple selected checkboxes functionality 
  //     const MemoIdsArray = [];
  //     if (MailId != 0) {
  //       MemoIdsArray.push(MailId);
  //     }
  //     else {
  //       if (this._checkedMailIds.length == 0) {
  //         alert('Please select memo');
  //         return false;
  //       }
  //     }
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: " Do you want to proceed with deleting this memo",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //     this._checkedMailIds.forEach(element => {
  //       MemoIdsArray.push(element.MailId);
  //     });
  //     this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
  //       data => {
  //         this._obj = data as InboxDTO;
  //         if (data["Message"] == "1") {
  //           this._checkedMailIds.forEach(element => {
  //             this._LstToMemos.forEach(elementI => {
  //               if (elementI.MailId == element.MailId) {
  //                 elementI["checked"] = false;
  //                 return true;
  //               }
  //             });
  //           });
  //           // this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //           // this.InboxMailLoad(this.activePage, this._Search, this._OrderBy);
  //           this.InboxMailV2(this._OrderBy, this.activePage);
  //           // this._snackBar.open('Updated Successfully', 'End now', {
  //           //   duration: 5000,
  //           //   horizontalPosition: "right",
  //           //   verticalPosition: "bottom",
  //           // });
  //           this._checkedMailIds = [];
  //           this.check = false;
  //         }
  //         // if (this._obj.message == "1") {
  //         //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //         //   this._snackBar.open('Updated Successfully', 'End now', {
  //         //     duration: 5000,
  //         //     horizontalPosition: "right",
  //         //     verticalPosition: "bottom",
  //         //   });
  //         // }
  //       }
  //     )
  //   }
  // });
  //   }

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
              this.InboxMailV2(this._OrderBy, this.activePage);
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
        this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
          data => {
            this._obj = data as InboxDTO;
            if (data["Message"] == "1") {
              this._checkedMailIds.forEach(element => {
                this._LstToMemos.forEach(elementI => {
                  if (elementI.MailId == element.MailId) {
                    elementI["checked"] = false;
                    return true;
                  }
                });
              });
              this.InboxMailV2(this._OrderBy, this.activePage);
              // this._snackBar.open('Updated Successfully', 'End now', {
              //   duration: 5000,
              //   horizontalPosition: "right",
              //   verticalPosition: "bottom",
              // });
              this._checkedMailIds = [];
              this.check = false;
            }
            // if (this._obj.message == "1") {
            //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
            //   this._snackBar.open('Updated Successfully', 'End now', {
            //     duration: 5000,
            //     horizontalPosition: "right",
            //     verticalPosition: "bottom",
            //   });
            // }
          }
        )
      }
    });

  }



  ClearFilters() {
    // this.Pinmemoshide = false;
    if (this.StatusJSON != undefined) {
      this.UserListJSON.forEach(elementI => {
        elementI["isUserChecked"] = false;
      });
      this.CompanyListJSON.forEach(elementI => {
        elementI["isCompanyChecked"] = false;
      });
      this.StatusJSON.forEach(elementI => {
        elementI["isChecked"] = false;
      });
    }

    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];
    this._UnRead_Parameter = false;
    var dataII = localStorage.getItem('currentUser');
    if (dataII != null) {
      let cart = JSON.parse(dataII);
      cart[0].UserJson = JSON.stringify(this.checkeduserIDs);
      cart[0].CompanyJson = JSON.stringify(this.checkedcompanyIDs);
      cart[0].StatusJson = JSON.stringify(this.checkedStatus);
      localStorage.setItem('currentUser', JSON.stringify(cart));
    }
    this.activePage = 1;
    this._Search = "";
    this.InboxMailV2(this._OrderBy, this.activePage);
    //
    // this.checkeduserIDs = [];
    // this.checkedcompanyIDs = [];
    // this.checkedStatus = [];
    // this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.PageSize = this._pageSize;
    // this._obj.PageNumber = 1;
    // this._obj.Search = '';
    // this._obj.ByFilters = true;
    // this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    // this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    // this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    // this._obj.InboxMemosType = this.InboxType;
    // this._obj.OrderBy = this._OrderBy;

    // this.inboxService.MemosBindingWithFilters(this._obj)
    //   .subscribe(data => {
    //     this._obj = data as InboxDTO;
    //     var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
    //     this._LstToMemos = _TOMemosJson;
    //     this._LstToPinMemos = JSON.parse(this._obj.PinMemosJson);
    //     this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
    //     this._LstToAnnouncement.forEach(element => {
    //       element.Description = element.Description.replace(/<[^>]+>/g, '');
    //     });
    //     this._MemoIds = [];
    //     this._LstToMemos.forEach(element => {
    //       this._MemoIds.push(element.MailId);
    //     });

    //     this._LstToMemos.forEach(element => {
    //       localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
    //     });

    //     var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
    //     this.TotalRecords = _totalRecords[0].TotalRecords;
    //     this.FiltersSelected = _totalRecords[0].FiltersSelected;
    //     this._CurrentpageRecords = this._LstToMemos.length;

    //     //this._Filters = _totalRecords[0].Filters.toString();
    //     this._OrderType = this._obj.Description;
    //     var _UsersJson = JSON.parse(this._obj.UserListJSON);
    //     this._LstUsers = _UsersJson;

    //     var _statusJson = JSON.parse(this._obj.StatusJSON);
    //     this._LstMemoStatus = _statusJson;

    //     var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
    //     this._LstCompaniesTO = _CompaniesJson;

    //     this._objds.Companiesdrp = _CompaniesJson;
    //     this._objds.Usersdrp = _UsersJson;
    //     this._objds.CompanyId = 0;
    //     this._objds.FromUserId = 0;
    //     this._objds.FilterRequired = true;
    //     this.InboxType = "All";

    //     this._objds.ToMemosCount = _totalRecords[0].TotalRecords;

    //     this.activePage = 1;
    //     this.cd.detectChanges();

    //     if (this._LstToMemos.length == 0) {
    //       this._filtersMessage = "No more memos matched your search";
    //       this._filtersMessage2 = " Clear the filters & try again";
    //     }
    //     else if (this._LstToMemos.length > 0) {
    //       this._filtersMessage = "";
    //       this._filtersMessage2 = "";
    //     }
    //     this.check = false;
    //     this._checkedMailIds = [];
    //     $("#div_filters").removeClass("show");
    //     $("#txtSearch").val('');
    //   });

  }
  onuserchange(event) {
    let a = event.target.value;
    this.UserListJSON.forEach(element => {
      if (element.UserId == a) {
        let chk = element.isUserChecked;
        if (chk == true) {
          element.isUserChecked = false;
        }
        else if (chk == false) {
          element.isUserChecked = true;
        }
      }
    });
  }
  removeUser(UserId, event) {
    this.UserListJSON.forEach(element => {
      if (element.UserId == UserId) {
        element.isUserChecked = false;
      }
    });
    // event.target.value = this._LstMemoStatus.filter(x => x.isChecked == true);
  }
  oncompanychange(event) {
    let a = event.target.value;
    this.CompanyListJSON.forEach(element => {
      if (element.CompanyId == a) {
        let chk = element.isCompanyChecked;
        if (chk == true) {
          element.isCompanyChecked = false;
        }
        else if (chk == false) {
          element.isCompanyChecked = true;
        }
      }
    });
  }
  removeCompany(CompanyId, event) {
    this.CompanyListJSON.forEach(element => {
      if (element.CompanyId == CompanyId) {
        element.isCompanyChecked = false;
      }
    });
    // event.target.value = this._LstMemoStatus.filter(x => x.isChecked == true);
  }
  Unreadbutton: any
  onstatuschange(event) {
    let a = event.target.value;
    this.StatusJSON.forEach(element => {
      if (element.Status == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
      this.Unreadbutton = a;
    });
  }
  removeStatus(Status, event) {
    this.StatusJSON.forEach(element => {
      if (element.Status == Status) {
        element.isChecked = false;
      }
    });
    event.target.value = this.StatusJSON.filter(x => x.isChecked == true);

  }
  Unread() {
    var JSONObj = {};
    JSONObj["Status"] = "UnRead";
    this.checkedStatus.push(JSONObj);

    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];

    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.ByFilters = true;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType = this.InboxType;
    this._obj.OrderBy = this._OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;
        this._LstToPinMemos = JSON.parse(this._obj.PinMemosJson);
        this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        this._LstToAnnouncement.forEach(element => {
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._MemoIds.push(_Obj);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        this._PinMemoIds = [];
        this._LstToPinMemos.forEach(element => {
          var _Obj = {}
          _Obj["MailId"] = element.MailId;
          _Obj["ReplyId"] = element.LastReplyId;
          this._PinMemoIds.push(_Obj);
        });

        this._LstToPinMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._PinMemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = parseInt(_totalRecords[0].TotalRecords);
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());

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
        this.InboxType = "All";

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
        this.check = false;
        this._checkedMailIds = [];
        $("#div_filters").removeClass("show");
        $("#txtSearch").val('');

      });

  }

  closedataloadSettings() {
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

    this.UserListJSON.forEach(elementI => {
      elementI["isUserChecked"] = false;
    });
    this.CompanyListJSON.forEach(elementI => {
      elementI["isCompanyChecked"] = false;
    });
    this.StatusJSON.forEach(elementI => {
      elementI["isChecked"] = false;
    });



  }

  selectAllcheckbox() { // Select All Checkbox functionality 
    for (let value of Object.values(this._LstToMemos)) {
      value['checked'] = this.check;
    }
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });


    // for (let value of Object.values(this._LstToPinMemos)) {
    //   value['checked'] = this.check;
    // }
    // this._checkedMailIds = this._LstToPinMemos.filter((value, index) => {
    //   return value['checked'] == true;
    // });
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

    console.log(this._checkedMailIds, "single values");
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
    setTimeout(() => {
      this.initializeTippy()
    }, 500);

  }
 



  open_data_fltrs() {
    document.getElementById("data-fltrs-drop").classList.add("show-flts");
    document.getElementById("data-btn").classList.add("btn-act");
  }
  clse_data_fltrs() {
    document.getElementById("data-fltrs-drop").classList.remove("show-flts");
    document.getElementById("data-btn").classList.remove("btn-act");
  }

  Dataloadfilter() {
    this.inboxdataloadfilter.inboxFilters(this.currentUserValue.createdby)
      .subscribe(data => {
        this.CompanyListJSON = data["Data"];
        this.CompanyListJSON = this.CompanyListJSON["CompanyJson"];

        this.StatusJSON = data["Data"];
        this.StatusJSON = this.StatusJSON["StatusJson"];

        this.UserListJSON = data["Data"];
        this.UserListJSON = this.UserListJSON["UsersJson"];
      })
  }

  ocr_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("ocr_add").style.display = "none";
    document.getElementById("editrck").innerHTML = "Add";

    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  document_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  closeInfo() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  Rebinding() {
    this.txtSearch = "";
    this.Dataloadfilter();
  }
  ViewMergeDiv() {
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // this._inbox.TestMethod();
  }
  ClosemergePanel() {
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  trackByFn(index: number, item: any): number {
    return item.MailId; // Return a unique identifier for each item
  }
  //   isAnyChecked(): boolean {
  //     const isStatusChecked = this.StatusJSON ? this.StatusJSON.some(ss => ss.isChecked) : false;
  //     const isCompanyChecked = this.CompanyListJSON ? this.CompanyListJSON.some(ss => ss.isChecked) : false;
  //     const isUserChecked = this.UserListJSON ? this.UserListJSON.some(ss => ss.isChecked) : false;
  //     return isStatusChecked || isCompanyChecked || isUserChecked;
  // }
  //   getCountOfChecked(): number {
  //     let count = 0;
  //     count += this.StatusJSON.filter(ss => ss.isChecked).length;
  //     count += this.CompanyListJSON.filter(ss => ss.isChecked).length;
  //     count += this.UserListJSON.filter(ss => ss.isChecked).length;
  //     return count;
  //   }


  _AddForm(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = this.FormList.find((user) => user.UserId === event.option.value);
    if (selectedEmployee) {
      const index = this.FormValues.findIndex((_user) => _user.UserId === selectedEmployee.UserId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.FormValues.push(selectedEmployee);
        this.SelectedFormIds.push(selectedEmployee.UserId);
      } else {
        // User found in the selected array, remove it
        this.FormValues.splice(index, 1);
        this.SelectedFormIds.splice(index, 1);
      }
    }
    this._FormListSubList = this.FormList;
    this.isSelection_Form = false;
    // this.AddUserErrorLog = false;

    // this.openAutocompleteDrpDwnFrom("From_Dropdown");
  }

  isSelectedForm(_User: any): boolean {
    return this.FormValues.some((usr) => usr.UserId === _User.UserId);
  }
  filterForm(input: string): void {
    this.isSelectionAddForm = true;
    this._FormListSubList = this.FormList.filter((User) =>
      User.UserName.toLowerCase().includes(input.toLowerCase())
    );
  }
  RemoveForm(Users) {
    const index = this.FormValues.findIndex((usr) => usr.UserId === Users.UserId);
    this.isSelectionAddForm = false;
    if (index !== -1) {
      this.FormValues.splice(index, 1);
      this.SelectedFormIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }
  OpenForm() {
    this._FormListSubList = this.FormList;
    this.isSelection_Form = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).focus()
  }
  closePanelForm() {
    this.isSelectionAddForm = false;
    this.isSelection_Form = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }


  // To_CC Mat Dropdown start
  _AddCompanyUser(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = this.Company_List.find((user) => user.CompanyId === event.option.value);
    if (selectedEmployee) {
      const index = this.Company_Values.findIndex((_user) => _user.CompanyId === selectedEmployee.CompanyId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.Company_Values.push(selectedEmployee);
        this.SelectedCompanyIds.push(selectedEmployee.CompanyId);
      } else {
        // User found in the selected array, remove it
        this.Company_Values.splice(index, 1);
        this.SelectedCompanyIds.splice(index, 1);
      }
    }
    this.CompanuUserSubList = this.Company_List;
    this.isSelectionCompanyUser = false;
    // this.AddUserErrorLog = false;
  }

  isSelectedCompanyUser(_User: any): boolean {
    return this.Company_Values.some((usr) => usr.CompanyId === _User.CompanyId);
  }

  filterCompanyUser(input: string): void {
    this.isSelection_CompanyUser = true;
    this.CompanuUserSubList = this.Company_List.filter((User) =>
      User.UserName.toLowerCase().includes(input.toLowerCase())
    );
  }

  RemoveCompanyUser(Users) {
    const index = this.Company_Values.findIndex((usr) => usr.CompanyId === Users.CompanyId);
    this.isSelection_CompanyUser = false;
    if (index !== -1) {
      this.Company_Values.splice(index, 1);
      this.SelectedCompanyIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }
  OpenCompany() {
    this.CompanuUserSubList = this.Company_List;
    this.isSelectionCompanyUser = true;
    (<HTMLInputElement>document.getElementById("txtsearchcompany")).focus()
  }
  closePanelCompany() {
    this.isSelection_CompanyUser = false;
    this.isSelectionCompanyUser = false;
    (<HTMLInputElement>document.getElementById("txtsearchcompany")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchcompany")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  onNgModelChangeAttachment(e) {
    if (e) {
      this._obj.HasAttachment = false;
      this.Has_Attachmnet = false;
    }
  }

  onNgModelChangeIsConfidential(e) {
    if (e) {
      this._obj.IsConfidential = false;
      this._IsConfidential = false;
    }
  }
  onNgModelChangeApprovalPending(e) {
    if (e) {
      this._obj.IsApprovalPending = false;
      this.Has_ApprovalPending = false;
    }
  }

  onNgModelChangeReplyRequired(e) {
    if (e) {
      this._obj.IsReplyRequired = false;
      this.Has_ReplyRequired = false;
    }
  }

  onNgModelChangeExpired(e) {
    if (e) {
      this._obj.IsExpired = false;
      this.Has_Expired = false;
    }
  }

  ChangeFavoriteValue(val: boolean, _mailId: number) {
    // alert(1);
    this.inboxService.FavStatus(_mailId, val, this.currentUserValue.createdby)
      .subscribe(data => {
        if (data['Message'] != "1") {
          alert('Please try again')
        }
        else {
          this.InboxMailV2(this._OrderBy, this.activePage);
        }
      });
  }
}


