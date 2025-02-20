import { Component, OnInit, Injectable, ViewChild, ChangeDetectorRef, ElementRef, Inject, Renderer2 } from '@angular/core';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Router, ActivatedRoute } from '@angular/router';
import { InboxService } from 'src/app/_service/inbox.service';
import { Spinkit } from 'ng-http-loader';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { UUID } from 'angular2-uuid';
import { UserDTO } from 'src/app/_models/user-dto';
import * as introJs from 'intro.js/intro.js';
import { OutsourceService } from 'src/app/_service/outsource.service';
import { Outsourcedto } from 'src/app/_models/outsourcedto';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
declare var $;

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
  //host:{'class':'someclass'}
})
@Injectable({
  providedIn: 'root'
})
export class InboxComponent implements OnInit {
  // @ViewChild('aForm') aForm: ElementRef;
  // @ViewChild('f') f: NgForm;
  // @ViewChild(ToMemosComponent) _ToMemoReference;
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '220px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  spinnerStyle = Spinkit;
  _obj: InboxDTO;
  _outsourceobj: Outsourcedto;
  public _LstCompanies: any;
  public _Lstlabels: any = [];
  public _LstFilters: any;
  _LstToMemos: any;
  _LstUsers: any;
  _LstTotalRecords: any;
  public _LstRead: any;
  public _LstUnRead: any;
  TotalRecords: number;
  activePage: number;
  companyid: number
  fromuserid: number;
  _pageSize: number;
  _all: boolean;
  _Filters: string;
  _filtervalues: string;
  _Search: string;
  LabelCount: number;
  _CurrentpageRecords: number;
  _MemoDetailsJson: any
  _EPProjects: any = [];
  EpProjectCount: any;
  _ToUserMemo: any;
  _CCUserMemo: any;
  _MemoDocuments: any;
  _ReplyList: any;
  _objds: Dataservicedto;
  dataPassed: any;
  subscription: Subscription;
  ToMemosCount: number
  CCMemosCount: number
  FilterRequired: boolean
  showSpinner: boolean;
  uuidValue: string;
  // _MailId:number;
  DraftId: number;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  // htmlcontent:string;
  // label: string = "";
  DMSCount: any;
  currentLang: "ar" | "en" = "ar";
  // @ViewChild(ToMemosComponent) _tomemos: any;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  introJS = introJs();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inboxService: InboxService,
    private outsourceService: OutsourceService,
    private cd: ChangeDetectorRef
    //, private dbService: NgxIndexedDBService
    , private ds: DataServiceService
    , public spinnerService: SpinnerService
    , public newmemoService: NewMemoService
    // , private _MemoDetails: MemoDetailsComponent
    , private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);

    });
    // alert('inbox constructor');
    this.uuidValue = UUID.UUID();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    translate.setDefaultLang('en');
    this._obj = new InboxDTO();
    this._outsourceobj = new Outsourcedto();
    this._pageSize = 30;
    this._Search = "";
    this.DraftId = 0;
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    // this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // alert('inbox ngOnInit');
    this.DMSMemoCount();
    introJs().start();
    this.getLables();
    this.bindEPPeojects();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'backend/Inbox/ToMemos';
    // this.router.navigate([this.returnUrl]);
    // this.cd.detectChanges();
  }

  DMSMemoCount() {
    this.inboxService.CountFromDMS(this.currentUserValue.createdby).subscribe(data => {
      this.DMSCount = data["Data"]["PendingCount"];
    });
  }
  
  LoadLabelMemos(labelid: number) {
    $(".LabelsClass").removeClass("active")
    // $( "li" ).last().removeClass(function() {
    //   return $( this ).prev().attr( "class" );
    // });
    //  $('.kt-nav__item li.active').removeClass('active');
    // $('li_'+labelid).addClass('active');

    //document.getElementsByClassName("labels kt-nav__item li.active")
    //.classList.remove("active");
    document.getElementById("li_" + labelid).classList.add("active");

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'backend/Inbox/LabelMemos';

    // this.router.navigate([this.returnUrl]);
    // var url = document.baseURI + name;
    var myurl = `${this.returnUrl}/${labelid}`;
    this.router.navigate([myurl]);
  }

  getLables() {
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj)
      .subscribe(data => {
        this._Lstlabels = data["Data"];
        this._Lstlabels = this._Lstlabels["LablesJson"];
        // Old API Response
        // this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        // this._Lstlabels = _labelsJson;
        this.LabelCount = this._Lstlabels.length
        // send message to subscribers via observable subject
        1//this.ds.sendData(this._objds);
        this.cd.detectChanges();
        // this._MemoDetails.AddMemostoLabels(); 
      });
  }
  AddLabels() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtlabels")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelName = __labelname;
    this._obj.LabelId = 0;
    this._obj.FlagId = 1;

    this.inboxService.AddLabels(this._obj)
      .subscribe(data => {
        // console.log(data,"Add Label in the tomemos");
        // this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        //this._objds.labelsdrp = _labelsJson;
        this._Lstlabels = data["Data"]["LablesJson"];
        // send message to subscribers via observable subject
        //this.ds.sendData(this._objds);
        this.cd.detectChanges();
        // this.label = ""
        (<HTMLInputElement>document.getElementById("txtlabels")).value = "";
        this.getLables();
      });
  }
  CreateNewLabel() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelName = __labelname;
    this._obj.LabelId = 0;
    this._obj.FlagId = 1;

    this.inboxService.AddLabels(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        2//this._objds.labelsdrp = _labelsJson;
        this._Lstlabels = data["Data"]["LablesJson"];
        // send message to subscribers via observable subject
        1//this.ds.sendData(this._objds);
        this.cd.detectChanges();
        // this.label = ""
        (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value = "";
        this.getLables();
      });
  }
  UpdateLabel(labelid: number) {

    var __labelname = (<HTMLInputElement>document.getElementById("txteditlabels_" + labelid)).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelName = __labelname;
    this._obj.LabelId = labelid;
    this._obj.FlagId = 2;

    this.inboxService.AddLabels(this._obj)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        2//this._objds.labelsdrp = _labelsJson;
        this._Lstlabels = data["Data"]["LablesJson"]
        // send message to subscribers via observable subject
        1//this.ds.sendData(this._objds);
        this.cd.detectChanges();
      });
  }
  // backgroundSync() {
  //   navigator.serviceWorker.ready
  //     .then(
  //       (SwRegistration) => SwRegistration.sync.register('post-data')
  //     ).catch(console.log);
  // }
  onChangeCompany(newValue) {
    this.companyid = newValue;
    this.fromuserid = 0;
    this._all = true;
    this._objds.CompanyId = newValue;
    this._objds.FromUserId = 0;
    this.ds.sendData(this._objds);
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._Search);
  }
  onChangeUser(newValue) {
    this.fromuserid = newValue;
    this.companyid = 65000;
    this._all = true;
    this._objds.CompanyId = 0;
    this._objds.FromUserId = newValue;
    this.ds.sendData(this._objds);
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._Search);
  }
  GetFilters(pageNumber: number, CompanyId: number, FromUserId: number, search: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.Read_F = false;
    this._obj.Conversation_F = false;
    this._obj.All = true;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    this._obj.Description = "";
    this._obj.Search = search;
    this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = false;
    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;

        this.activePage = pageNumber;

        if (this._pageSize >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords
        }
        else {
          this._CurrentpageRecords = this._pageSize
        }

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

        this.activePage = pageNumber;
        this.cd.detectChanges();
        //alert('ok')
      });
  }
  backtoMemoList() {
    this.cd.detectChanges();
  }
  CloseReplyPanel() {
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
  }
  MemoDetails(MailId: number) {
    //alert(MailId);
    // this._MemoListView = false;
    // this._MemoDetailsView = true;
    this.cd.detectChanges();
    //alert(MailId);
    this.inboxService.MemoDetails(MailId)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _MemoDtlsJson = JSON.parse(this._obj.MemoDetailsJson);
        this._MemoDetailsJson = _MemoDtlsJson;

        this._ToUserMemo = this._MemoDetailsJson[0].TOUsers;
        this._CCUserMemo = this._MemoDetailsJson[0].CCUsers;
        this._MemoDocuments = this._MemoDetailsJson[0].DocumentsJson;

        this._ReplyList = JSON.parse(this._obj.ReplyListJson);

        this.cd.detectChanges();
      })
  }
  HideAndShowDivReplies(replyid: number) {
    var newValue = (<HTMLInputElement>document.getElementById("hdnReplyId_" + replyid)).value;
    if (newValue == "0") {
      (<HTMLInputElement>document.getElementById("div_ReplyId_" + replyid)).classList.add("kt-inbox__message--expanded");
      (<HTMLInputElement>document.getElementById("hdnReplyId_" + replyid)).value = "1";
    }
    else if (newValue == "1") {
      (<HTMLInputElement>document.getElementById("div_ReplyId_" + replyid)).classList.remove("kt-inbox__message--expanded");
      (<HTMLInputElement>document.getElementById("hdnReplyId_" + replyid)).value = "0";
    }

  }
  ViewChatDiv(memoid: number) {
    var newValue = (<HTMLInputElement>document.getElementById("hdnChatId_" + memoid)).value;
    if (newValue == "0") {
      (<HTMLInputElement>document.getElementById("kt_quick_panel")).classList.add("kt-quick-panel--on");
      (<HTMLInputElement>document.getElementById("hdnChatId_" + memoid)).value = "1";
    }
    else if (newValue == "1") {
      (<HTMLInputElement>document.getElementById("kt_quick_panel")).classList.remove("kt-quick-panel--on");
      (<HTMLInputElement>document.getElementById("hdnChatId_" + memoid)).value = "0";
    }
    // (<HTMLInputElement>document.getElementById("kt_quick_panel")).classList.add("kt-quick-panel--on");

  }
  CloseQuickPanel() {
    (<HTMLInputElement>document.getElementById("kt_quick_panel")).classList.remove("kt-quick-panel--on");
  }
  ViewReplyDiv() {
    this.uuidValue = UUID.UUID();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    // var newValue = (<HTMLInputElement>document.getElementById("hdnMailId")).value;
    // if (newValue == "0") {
    //   (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.add("kt-quick-panel--on");
    //   (<HTMLInputElement>document.getElementById("hdnMailId")).value = "1";
    // }
    // else if (newValue == "1") {
    //   (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    //   (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    // }
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  parentValue = '';
  ViewReplyDiv1() {

    this.uuidValue = UUID.UUID();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    this.newmemoService._NewMemoobj.DraftId = "";
    const lang: any = localStorage.getItem('language');
    this.parentValue = lang == 'en' ? "New Memo" : "مذكرة جديدة";
    this.translate.use(lang); 
    this.currentLang = lang ? lang : 'en';
    // var newValue = (<HTMLInputElement>document.getElementById("hdnMailId")).value;
    // if (newValue == "0") {
    //   (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.add("kt-quick-panel--on");
    //   (<HTMLInputElement>document.getElementById("hdnMailId")).value = "1";
    // }
    // else if (newValue == "1") {
    //   (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    //   (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    // }

    (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
     

  }
  ViewNewMemoDiv(_htmlContent: string, draftid: number, Subject: string) {
    
    // alert(_htmlContent);
    // alert(draftid);
    // alert(Subject);
    this.uuidValue = UUID.UUID();
    this.DraftId = draftid;
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    this.newmemoService._NewMemoobj.Purpose = _htmlContent;
    this.newmemoService._NewMemoobj.DraftId = draftid.toString();
    this.newmemoService._NewMemoobj.Subject = Subject;
    const lang: any = localStorage.getItem('language');
    this.parentValue = lang == 'en' ? "New Memo" : "مذكرة جديدة";
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    // this._newmemo.htmlContent=_htmlContent;

    var newValue = (<HTMLInputElement>document.getElementById("hdnMailId")).value;
    if (newValue == "0") {
      (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.add("kt-quick-panel--on");
      document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
      (<HTMLInputElement>document.getElementById("hdnMailId")).value = "1";
    }
    else if (newValue == "1") {
      (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.add("kt-quick-panel--on");
      document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
      (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    }
  }

  bindEPPeojects() {
    this.outsourceService.EP_ProjectList(this.currentUserValue.EmployeeCode)
      .subscribe(data => {
        this._outsourceobj = data as Outsourcedto;
        var _epProjects = JSON.parse(this._outsourceobj[0].JsonData);
        this._EPProjects = _epProjects;
        this.EpProjectCount = this._EPProjects.length;
      })
  }


  LoadEPMemos(Project_Code: number) {
    $(".LabelsClass").removeClass("active")
    document.getElementById("li_" + Project_Code).classList.add("active");
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'backend/Inbox/ExecutionPlanner';
    var myurl = `${this.returnUrl}/${Project_Code}`;
    this.router.navigate([myurl]);
  }
  closeInfo() {
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");


    document.getElementById("plus_div").classList.add("d-none");
    document.getElementById("plus_div").classList.remove("d-flex");
    // return true;

  }


  openinbmenu() {
    $('#kt_inbox_aside').addClass('menu--on');
    $('.kt-aside-menu-overlay1').addClass('d-block');
  };
  closeInfo1() {
    $('#kt_inbox_aside').removeClass('menu--on');
    $('.kt-aside-menu-overlay1').removeClass('d-block');
  }
  ClosemergePanel() {
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  More() {
    $('.kt-nav__item').removeClass('d-none');
    $('.kt-db-vm').addClass('d-none');
  }
  LabelActivaleclass() {
    $('.kt-cnt-v').addClass('d-none');
    $('.label-height').addClass('active');
  }
  EPActivaleclass() {
    $('.kt-prg-v').addClass('d-none');
    $('.kt-projects-v').addClass('active');
  }
  labelid: number
  fordelete(lblid) {
    this.labelid = lblid;
  }
  LabelsRemove() {
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelId = this.labelid;
    this.inboxService.DeleteUserLabels(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        // 2//this._objds.labelsdrp = _labelsJson;
        // // this._MailId = this._obj.MailId
        this._Lstlabels = data["Data"]["LablesJson"];
        console.log(this._Lstlabels, "Remove Label");
        this.LabelCount = this._Lstlabels.length
        // // send message to subscribers via observable subject
        // 1//this.ds.sendData(this._objds);
        this.cd.detectChanges();
      });
  }

  //   $('.kt-aside-menu-overlay').click(function() {
  //     $('#kt_inbox_aside').removeClass('menu--on');            
  //     $('.kt-aside-menu-overlay').removeClass('d-block');

  // });
}

