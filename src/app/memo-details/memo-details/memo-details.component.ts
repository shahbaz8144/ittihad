import { Component, OnInit, ViewChild, ChangeDetectorRef, Renderer2, NgZone, ElementRef, ViewChildren, QueryList, EventEmitter, Output, Inject } from '@angular/core';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { MemoReplyService } from 'src/app/_service/memo-reply.service';
import { NgForm } from '@angular/forms';
import { Outsourcedto } from 'src/app/_models/outsourcedto';
import { OutsourceService } from 'src/app/_service/outsource.service';
import { MatDialog } from '@angular/material/dialog';
import { DailogComponent } from '../dailog/dailog.component';
import { DateAdapter } from '@angular/material/core';
import { GuidedTourService } from 'ngx-guided-tour';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { MatMenuTrigger, transformMenu } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import Localbase from 'localbase'
// import 'moment/locale/pt-br';
import Swal from 'sweetalert2';
// import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { interval, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
declare var $: any;
// import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import * as  Editor from 'ckeditor5-custom-build/build/ckeditor';
// import { HeaderComponent } from 'src/app/shared/header/header.component';
// import { AlertService } from 'src/app/_service/alert.service';
let db = new Localbase('pwa-database')
declare const annyang: any;

interface ICustomUpload {
  CategoryName: string;
  CategoryId: number;
  isChecked: boolean;
}

interface AngularEditorConfig {
  toolbar: string[] | { items: string[] };
  fontSize: {
    options: string[];
  };
  alignment: {
    options: string[];
  };
}


// interface ReplyItem {
//   CreatedDate: string;  // Assuming CreatedDate is a string representing a date
// }

// interface MemoReply {
//   enddatetime: string;  // Assuming enddatetime is a string representing a date
//   ReplyDataList: ReplyItem[];
// }

@Component({
  selector: 'app-memo-details',
  templateUrl: './memo-details.component.html',
  styleUrls: ['./memo-details.component.css', '../../../assets/css/tourguide.css']
})

export class MemoDetailsComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: ElementRef;
  @ViewChild('editor', { static: false }) editorComponent: CKEditorComponent;
  @ViewChild('draftSpan', { static: true }) draftSpan: ElementRef;
  @ViewChild('auto') autoComplete: MatAutocomplete;
  @ViewChild('autoCC') autoCompleteCC: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) customTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) customTriggerCC!: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) customTriggers!: QueryList<MatAutocompleteTrigger>;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTriggerCC: MatAutocompleteTrigger;
  @ViewChild('inputField1', { read: MatAutocompleteTrigger }) autoCompleteTrigger1: MatAutocompleteTrigger;
  @ViewChild('inputField2', { read: MatAutocompleteTrigger }) autoCompleteTrigger2: MatAutocompleteTrigger;
  @ViewChild('inputField3', { read: MatAutocompleteTrigger }) autoCompleteTrigger3: MatAutocompleteTrigger;
  @ViewChild('inputField4', { read: MatAutocompleteTrigger }) autoCompleteTrigger4: MatAutocompleteTrigger;
  @ViewChild('inputField5', { read: MatAutocompleteTrigger }) autoCompleteTrigger5: MatAutocompleteTrigger;
  @ViewChild('fruitInput') fruitInput: ElementRef;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwn(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwn(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  @ViewChildren(MatAutocompleteTrigger) autocompletesTO: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwnTO(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnTO(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  @ViewChildren(MatAutocompleteTrigger) autocompletesCC: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  @ViewChildren(MatAutocompleteTrigger) autocompletesCat: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwnCategory(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCategory(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  openAutocompleteDrpDwnAddUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  openAutocompleteDrpDwnAddUserReply(OpenAdduserReply: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduserReply);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnAddUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  closeAutocompleteDrpDwnAddUserReply(CloseOpenAdduserReply: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduserReply);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  openAutocompleteDrpDwnAddLabel(OpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnAddLabel(CloseOpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  public dropDownListObject: MemoDetailsComponent;
  UserSearch: string;
  menuTopLeftPosition = { x: 0, y: 0 }
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  i: {}
  TotalSelectedReplies: number = 0;
  userIds: any;
  ReplyRequired: boolean;
  Attachment: boolean;
  Description: string;
  searchTOfromhere: string;
  searchCCfromhere: string;
  ApprovalPending: boolean;
  _IsConfidential: boolean;
  Replybutton: boolean = false;
  isHistoryVisible: boolean = true;
  ViewMorethreadshide: boolean = false;
  DocumentsHistoryList:any;
  AddedUsersJson:any;
  SubjectHistoryJson:any;
  CCUserCount: number;
  maxVisibleRecipients = 4; // Adjust based on your needs
  showAllRecipients = false;
  _MinutesDifference: number;
  _SecondsDifference: number;
  _replyDataCount: number = 0;
  _DraftId: number = 0;
  initialIsConfidential: boolean = false;
  MemoAdminId: number = 0;
  _IsActiveExistinguser = [];
  Removevaluearray = [];
  selectedUsers = [];
  Addlabel: string = "";
  _Twoletter: any;
  FeatureButton: number;
  AttachmentsErrorlog: boolean = false;
  _TempToUsers: any[] = [];
  _TempCCUsers: any[] = [];
  AprrovewithCommentsList: any[] = [];
  _SentDateAng: string;
  showButton: boolean = true;
  AddUserReplyAdmin: boolean = true;
  IsToUsers: boolean = true;
  ReplyToUsers: boolean = true;
  Selected_And_All = true;
  Usericon: boolean = false;
  _ExistingUsersMemo: any[];
  _ReplyJson: any = [];
  _ReplyJsonBinding: any = [];
  selectallreply: boolean = true;
  _objInb: InboxDTO;
  Accessuser: any;
  selectedmerge = [];
  _Comments: string;
  Aftersendmessage: boolean = false;
  DeadlineDatecheck: boolean = false;
  selectedUserDisplayName: string = '';
  Dropdowntopsubject: any;
  Usersearch: string;
  IsConfidential: any;
  DisplayOptions: boolean = false;
  SelectLabel: any = [];
  LeftDropdownCount: any;
  Attachementcount: number = 0;
  SelectedSubject: string;
  AddUsers: any;
  UserComments: string;
  _DraftColour: boolean = false;
  _Drafttext: string;
  DMSRequestJson: any = [];
  DMSPendingCount: number = 0;
  CategoryErrorlog: boolean = false;
  AddUserErrorLog: boolean = false;
  AddUserReplyErrorLog: boolean = false;
  LabelUserErrorLog: boolean = false;
  ToErrorlog: boolean = false;
  SubjectErrorlog: boolean = false;
  AttachmentErrorlog: boolean = false;
  SortType: number;
  UserId: number
  Date: Boolean = true;
  Users: Boolean = false;
  Subject: Boolean = false;
  Byme: Boolean = false;
  showSendAnywayAndCancelButtons: boolean = true
  CustomAttachment: Boolean = false;
  Usercomment: string;
  SearchTxt: string;
  _MemoId: number;
  _ParentDisplayName: any;
  htmlContent = '';
  CategoryArray: any = [];
  Catarry: any = [];
  Catarry2: any = [];
  CategoryArrays: any = [];
  isSelectionuser: boolean = false;
  isSelectionAddUser: boolean = false;
  isSelectionAddUserReply: boolean = false;
  isSelectionAddLabel: boolean = false;
  isSelection_Users: boolean = false;
  isSelection_AddUsers: boolean = false;
  isSelection_AddUsersReply: boolean = false;
  isSelection_AddLabel: boolean = false
  isSelectionCat: boolean = false;
  isSelectionCatAry: boolean = false;
  _ReplyUserDropdown: any;
  AttachmentFileuplod: any;
  _ExistingUser: any = [];
  _SubjectLeftList: any[];
  _SubjectRightList: any[];
  _AllSubjectList: any[] = [];
  LeftSubjectSelected: string;
  RightSubjectSelected: string;
  txtSearch: string;
  _ExistingUsersDropdown: any
  _obj: InboxDTO;
  _MemoDetailsJson: any
  _ReplyDetailsJson: any;
  _ReplyParentDetailsJson: any = [];
  _ReplyHistoryArray: any;
  _ToUserMemo: any[] = [];
  _CCUserMemo: any[] = [];
  _ToUsers: any;
  _CCUsers: any;
  _ToUserListDetails: any[] = [];
  _CCUserListDetails: any[] = [];
  TotalUserListDetails:any;
  TotalCCUserListDetails:any
  _MemoDocuments: any;
  _ForwardMemoDocuments: any;
  _ReplyList: any[] = [];
  _AllUsersList: any[] = [];
  _AllUsersToList: any[] = [];
  _AllUsersCCList: any[] = [];
  _ReplyFilteredDataList: any[] = [];
  _LoginUserId: number;
  _LoginUserName: string;
  _Details: any[] = [];
  _IsPdf: boolean;
  _ApprovalMemoId: number
  _ApprovalReplyId; number
  _MemoDocumentsCount: number = 0;
  _UsersList: any;
  _UserListSubList: any = [];
  _UserListReplySubList: any = [];
  SubLabelList: any = [];
  isFormDisabled: boolean;
  _ReplyId: number;
  SelectedReplyId: number;
  FirstReplyId: number;
  selectedToUser: any;
  selectedCCUser: any;
  _TotalUsers: any;
  _UsersAction: any;
  _tableRequired: boolean;
  _IsDeleted: boolean
  _Bookmark: boolean;
  _BookMarkicon: boolean;
  _EPProjects: any;
  _UserExistInMemo: boolean = true;
  ConversationJson: any[]
  DocumentList: any[];
  AttachmentList: any[];
  daysJson: any
  TotalConversationRecords: number
  activePageConversation: number
  NextMemoId: number
  PreviousMemoId: number
  NextReplyId: number
  PreviousReplyId: number
  _MemoIds: any
  _CurrentpageNo: number
  _TotalRecords: number
  _ChatCount: number
  LabelCount: number = 0;
  _subject: string
  _UpdatedReplyId: number
  _outsourceobj: Outsourcedto;
  MemoCreatedUserId: number;
  MemoCreatedUserName: any;
  _LoginUser: string;
  MemoCreatedUserCompanyName: string;
  MemoCreatedUserDesignationName: string;
  MemoCreatedUserProfile: string;
  _lstMultipleFiales: any;
  myFiles: string[] = [];
  myFilesAtt: string[] = [];
  progress: number = 0;
  progressbar: number = 0;
  closeResult: string;
  FavoriteVal: boolean;
  Pinval: boolean
  _ProjectCode: string;
  _ProjectList: string;
  disablePreviousDate = new Date();
  _ExpiryDate: Date | null = null;
  LabelsJsondata: any;
  labelid: number;
  label: string;
  MailId: number
  voiceText: any;
  isEP: boolean;
  MergeData: boolean = false
  Attachmentshide: boolean = true;
  voiceActiveSectionDisabled: boolean = true;
  voiceActiveSectionError: boolean = false;
  voiceActiveSectionSuccess: boolean = false;
  voiceActiveSectionListening: boolean = false;
  Pg_ReplyFilter_AllMain: boolean = true;
  Pg_ReplyFilter_Unread: boolean = false;
  Pg_ReplyFilter_Approval: boolean = false;
  Pg_ReplyFilter_ReplyRrquired: boolean = false;
  Pg_ReplyFilter_ByMe: boolean = false;
  Pg_ReplyFilter_Attachment: boolean = false;
  ReplyFilter_ByMeWithActions: boolean = false;
  Pg_ReplyFilter_Date: boolean = true;
  Pg_ReplyFilter_Subject: boolean = false;
  Pg_ReplyFilter_From: boolean = false;
  ReplyFilter_Bookmarks: boolean = false;
  _Memosource: any;
  InternalJsonData: any[];
  Rejectcomments: any;
  Approvecomments: any;
  TourName: string;
  InternalLoadTour: number;
  _userdto: UserDTO;
  _FromUserId: number;
  AddNewUserValues: any = [];
  ReplyAddUsers: any = [];
  AddLabelList: any = [];
  selectedCategory = "";
  selectedCategoryArry = [];
  selectedEmpIds: any = [];
  SelectedUserIds: any = [] = [];
  SelectReplyUserIds: any = [] = [];
  SelectedLabelIds: any = [] = [];
  selectedCategoryIds: any = [];
  ReplyIds: any[] = [];
  ReplyType: string;
  Reply_sort_exists: boolean = false;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  Mergeiconhide: any;
  Requestbutton: boolean;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  // The boolean value representing the toggle state
  isChecked: boolean = false;
  public Editor = Editor;
  
  emojiFallback = (emoji: any, props: any) => emoji ? `:${emoji.shortNames[0]}:` : props.emoji;
  message = '';
  set = 'apple';
  showEmojiPicker = false;
  sets = ['native', 'google', 'twitter', 'facebook', 'emojione', 'apple', 'messenger'];
  toggleEmojiPicker() { this.showEmojiPicker = !this.showEmojiPicker; }
  addEmoji(event) { const { message } = this; const text = `${message}${event.emoji.native}`; this.message = text; }
  onFocus() { this.showEmojiPicker = false; }
  onBlur() {
  }
  _IsExists: boolean;
  selectedToEmpIds: any = [];
  selectedCCEmpIds: any = [];
  selectedToEmployees: any = [];
  selectedCCEmployees: any = [];
  isSelection: boolean = false;
  isSelectionCatarry: boolean = false;
  isSelectionCatarryArry: boolean = false;
  isSelectionCC: boolean = false;
  _disabledUsers: number[] = [];
  _CurrectionSelectionIsHIstory: boolean = false;
  _IsHistory: any;
  IsPolicyDocument: boolean = false;
  pipe = new DatePipe('en-US');
_StartDate: string = '';
  _EndDate: string = '';
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
  editorConfig = {
    toolbar: [
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '-', // break point
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'code',
      'codeBlock',
      '|',
      'insertTable',
      '|',
      'imageInsert',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        // 'Popins'
      ],
    },
  };
  ICustomUpload: ICustomUpload[] = [];
  private hubConnectionBuilder!: HubConnection;
  private progressConnectionBuilder!: HubConnection;
  private replylistConnectionBuilder!: HubConnection;
  offers: any[] = [];
  readonly signalUrl = this.commonUrl.Signalurl;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private inboxService: InboxService,
    private outsourceService: OutsourceService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public newmemoService: NewMemoService,
    public memoreplyService: MemoReplyService,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private dateAdapter: DateAdapter<Date>,
    private ngZone: NgZone,
    private guidedTourService: GuidedTourService,
    private _apiService: AuthenticationService,
    private elementRef: ElementRef,
    private el: ElementRef, private renderer: Renderer2,
    private commonUrl: ApiurlService,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en'); // Set initial language
    this._userdto = new UserDTO();
    this._obj = new InboxDTO();
    this._objInb = new InboxDTO();
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this._MemoId = this.route.snapshot.params['id'];
    this._ReplyId = this.route.snapshot.params['replyid'];
    this._LoginUserId = this.currentUserValue.createdby;
    this._LoginUserName = this.currentUserValue.UserName;
    this._disabledUsers = [this._LoginUserId];
    this.ReplyRequired = false; // Initialize ReplyRequired
    this._ChatCount = 0;
    this._lstMultipleFiales = [];
    this.AttachmentFileuplod = [];
    this.myFiles = [];
    this.myFilesAtt = [];
    this._MemoIds = JSON.parse(localStorage.getItem('MemoIds_' + this._MemoId));
    if (this._MemoIds != null) {
      var l = this._MemoIds.length;
      this._TotalRecords = l;
      this._MemoIds[-1] = this._MemoIds[l - 1]; // this is legal
      this._MemoIds[l] = this._MemoIds[0];
      var current = 0;
      for (var i = 0; i < l; i++) {
        current = this._MemoIds[i].MailId;
        if (current == this._MemoId) {
          this._CurrentpageNo = i + 1;
          this.PreviousMemoId = this._MemoIds[i - 1].MailId;
          this.NextMemoId = this._MemoIds[i + 1].MailId;
          this.PreviousReplyId = this._MemoIds[i - 1].ReplyId;
          this.NextReplyId = this._MemoIds[i + 1].ReplyId;
        }
      }
      // restore the this._MemoIds
      this._MemoIds.pop();
      this._MemoIds[-1] = null;
    }
    else {
      this._CurrentpageNo = 1;
      this.PreviousMemoId = 0;
      this.NextMemoId = 0;
    }
    this.TourName = this.currentUserValue.TourId;
    var ud = this.currentUserValue.createdby;
    db.collection('NewMemosList_' + ud).doc(this._MemoId.toString()).update({
      MailView: true
    })
    db.collection('NewMemosList_' + ud).doc(this._MemoId.toString()).update({
      NotificationStatus: true
    })

  }

  timer: Subscription;
  minutes: number;
  seconds: number;
  currentLang: "ar" | "en" = "ar";
  placeholderlabel: string;
  placeholderText: string;
  ListofuserSearch: string;
  SelectUsersfromhere: string;
  SelectUsersfromheres: string;
  SelectCategoryfromhere: string;
  AddYourcomment: string;
  labelsTitle: string;
  Favoritetitle: string;
  DeleteMemo: string;
  RestoreMemo: string;
  MemoStatuss: string;
  PinMemo: string;
  Merge: string;
  History: string;
  ListofAttachmnets: string;
  FeaturesNew: string;
  ExecutionPlanner: string;
  ReloadClearFilters: string;
  Previose: string;
  Next: string;
  selectItemToReadTranslation: string;
  nothingIsSelectedTranslation: string;
  _UserExistsInMain:any;
  // translationsLoaded: boolean = false;

  async languageValuesAssign() {
    let lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.placeholderText = lang === 'en' ? 'Search....' : 'البحث....';
    this.placeholderlabel = lang === 'en' ? 'Select Labels from here' : 'حدد التسميات من هنا';
    this.AddYourcomment = lang === 'en' ? 'Add Your comment' : 'أضف تعليقك';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    localStorage.setItem('language', lang);
    if (this.currentLang === 'ar') {
      const cssFilePath = 'assets/i18n/arabic.css';
      // Create a link element for the CSS file
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssFilePath;

      // Set an id attribute to identify the link element
      link.id = 'arabicCssLink';

      // Append the link element to the document head
      this.renderer.appendChild(document.head, link);
    } else if (this.currentLang === 'en') {
      // alert(lang);
      const linkElement = document.getElementById('arabicCssLink');
      if (linkElement && linkElement.parentNode) {
        console.log('Removing Arabic styles');
        this.renderer.removeChild(document.head, linkElement);
      } else {
        console.log('Link element not found or already removed');
      }
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      // Access translated title content
      this.labelsTitle = translations.Memodeatils.Labeltitle;
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Favoritetitle = translations.Memodeatils.titleFavorite
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.DeleteMemo = translations.Memodeatils.MemoDelete
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.RestoreMemo = translations.Memodeatils.MemoRestore
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.MemoStatuss = translations.Memodeatils.StatusMemo
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.PinMemo = translations.Memodeatils.MemoPin
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Users = translations.Memodeatils.titleUsers
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Merge = translations.Memodeatils.titleMerge
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.History = translations.Memodeatils.titleHistory
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ListofAttachmnets = translations.Memodeatils.titleListofAttachmnets
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.FeaturesNew = translations.Memodeatils.NewFeatures
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ExecutionPlanner = translations.Memodeatils.PlannerExecution
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Memodeatils.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Previose = translations.Memodeatils.tomemotitlePreviose
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Next = translations.Memodeatils.tomemotitleNext
    });

    if (this._ReplyFilteredDataList.length === 0) {
      this.translate.get('Memodeatils.Selectanitemtoread').subscribe((translation: string) => {
        this.selectItemToReadTranslation = translation;
        this.cd.detectChanges();
      });

      this.translate.get('Memodeatils.Nothingisselected').subscribe((translation: string) => {
        this.nothingIsSelectedTranslation = translation;
        this.cd.detectChanges();
      });
    }
  }

  async SignalRMethods() {
    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'memodetailsreply?userId=' + this.currentUserValue.createdby)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch(err => console.log('Error while connect with server'));
    this.hubConnectionBuilder.on("ReceiveReply", (offers) => {
      console.log("Memo details", offers);
    });

    //Creation Connection of Progress bar for file upload
    //start here
    this.progressConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'progressHub?userId=' + this.currentUserValue.createdby)
      .build();
    //End here
  }

  async ngOnInit(): Promise<void> {
    this._Details = [];
    (await this.languageValuesAssign());
    window.addEventListener('scroll', () => {
      this.autocompletes.forEach((ac) => {
        if (ac.panelOpen)
          ac.updatePosition();
      });
    }, true);
    this.progress = 0;
    this._IsExists = true;
    this._UpdatedReplyId = 0;
    this.resetForm();
    this.InternalLoadTour = 0;
    this.SortType = 1;
    (await this.SignalRMethods());
    (await this.ReplyListMemoDetailsV2(this._MemoId));
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe(); // Unsubscribe from the timer observable to prevent memory leaks
  }
  public startConnection(): void {
    
    this.replylistConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'receiveReplyList?userId=' + (this.currentUserValue.createdby.toString() + this._MemoId.toString()))
      .build();

    this.replylistConnectionBuilder.on("ReceiveReply", (replydata) => {
      const jsonData = JSON.parse(replydata);
      if (jsonData.TotalPages == jsonData.PageNumber) {
        document.getElementById("replylist_div_spinner").style.display = "none";
      }
      else {
        document.getElementById("replylist_div_spinner").style.display = "block";
      }
      jsonData.MemoReplyList.forEach((incomingMemo) => {
        // Find an existing memo with the same 'Value'
        const existingMemo = this._ReplyFilteredDataList.find(memo => memo.Value === incomingMemo.Value);
        if (existingMemo) {
          // Create a map with ReplyId as the key for existing ReplyDataList items
          const replyMap = new Map(existingMemo.ReplyDataList.map(reply => [reply.ReplyId, reply]));

          // Merge or overwrite existing replies with new replies
          incomingMemo.ReplyDataList.forEach((incomingReply) => {
            replyMap.set(incomingReply.ReplyId, incomingReply); // This will overwrite if the ReplyId exists
          });

          // Convert the map back to array and assign to existingMemo's ReplyDataList
          existingMemo.ReplyDataList = Array.from(replyMap.values());
        } else {
          // If no matching 'Value' was found, add the new MemoReply item to the list
          this._ReplyFilteredDataList.push(incomingMemo);
        }

      });
      // Sorting the main list
      this._ReplyFilteredDataList.sort((a, b) => new Date(b.enddatetime).getTime() - new Date(a.enddatetime).getTime());

      // Sorting nested lists
      this._ReplyFilteredDataList.forEach(element => {
        element.ReplyDataList.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });
    });

    this.replylistConnectionBuilder
      .start()
      .then(() => this.ReplyListSignalR())
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  public stopConnection(): void {
    if (this.replylistConnectionBuilder) {
      this.replylistConnectionBuilder.stop()
        .then(() => console.log('Connection stopped'))
        .catch(err => console.error('Error while stopping connection: ' + err));
    }
  }

  public restartConnection(): void {
    document.getElementById("replylist_div_spinner").style.display = "block";
    this.stopConnection();
    this.startConnection();
  }

  async MemoDetails(MailId: number) {
    this._MemoId = MailId;
    this._obj.MailId = MailId;
    this._obj.ReplyFilter_AllMain = this.Pg_ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = this.Pg_ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = this.Pg_ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = this.Pg_ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = this.Pg_ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = this.Pg_ReplyFilter_Subject;
    this._obj.ReplyFilter_From = this.Pg_ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = this.Pg_ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = this.Pg_ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = this.ReplyFilter_ByMeWithActions;
    this._obj.ReplyId = this._ReplyId;
    this._obj.IsReplyFilter = this.Reply_sort_exists;
    this._obj.ReplyFilter_Bookmarks = this.ReplyFilter_Bookmarks;
    (await this.inboxService.MemoDetailsWithReplyFIlters(this._obj))
      .subscribe(data => {
        // console.log(data, "MemoDetails Data");
        this._LoginUserId = this.currentUserValue.createdby;
        this.Requestbutton = data["Data"].UserRequest;
        var _MemoDtlsJson = data["Data"];
        _MemoDtlsJson = _MemoDtlsJson["MemoDetailsJson"];
        var userexist = data["Data"].UserExists;
        if (userexist == "False") {
          this._UserExistInMemo = false;
          this.Accessuser = data["Data"];
          this.Accessuser = this.Accessuser["BasicMemoDetailsJson"];
        }
        else
          this._UserExistInMemo = true;
        this._ReplyList = data["Data"];
        this._ReplyList = this._ReplyList["ReplyListJson"];
        this._ReplyFilteredDataList = data["Data"];
        this._ReplyFilteredDataList = this._ReplyFilteredDataList["FinalMemoReply"];

        this._replyDataCount = this._ReplyFilteredDataList.length - 1;
        this.Mergeiconhide = 0;
        this._ReplyFilteredDataList.forEach(element => {
          this.Mergeiconhide = this.Mergeiconhide + element.ReplyDataList.filter(x => x.IsHistory == 0).length;
          element.IsHistoryCount = element.ReplyDataList.filter(x => x.IsHistory == 1).length;
          element.IsTotalCount = element.ReplyDataList.length;
        });

        this._ReplyUserDropdown = data["Data"];
        this._ReplyUserDropdown = this._ReplyUserDropdown["ReplyFiltersUsers"];
        if (this._ReplyList.length > 0) {
          this.InternalJsonData = this._ReplyList; //JSON.parse(this._ReplyFilteredDataList[0].JsonData);
          this.InternalJsonData.sort(function (a, b) { return b.ReplyId - a.ReplyId });
        }
        else
          this._Details = [];
        this._AllUsersList = data["Data"]["TotalUsersJson"];
        //Assigning values to to and cc dropdown array, used while replying memo
        //start here
        this._AllUsersToList = data["Data"]["TotalUsersJson"];
        this._AllUsersCCList = data["Data"]["TotalUsersJson"];
        //end here
        this._MemoDetailsJson = _MemoDtlsJson;
        if (_MemoDtlsJson.length > 0) {
          this._CurrectionSelectionIsHIstory = _MemoDtlsJson[0].IsReply;
          // alert(this._CurrectionSelectionIsHIstory);
          this.initialIsConfidential = _MemoDtlsJson[0].InitialReplyIsConfidential;
          this.MemoAdminId = _MemoDtlsJson[0].MemoAdminId;
          this._ChatCount = this._MemoDetailsJson[0].ConversationCount;
          this._ReplyId = this._MemoDetailsJson[0].SelectedReplyId;

          this._DraftId = this._MemoDetailsJson[0].DraftId;
          this._Bookmark = this._MemoDetailsJson[0].IsBookmark;
          this.IsConfidential = this._MemoDetailsJson[0].IsConfidential;
          if (this._MemoDetailsJson[0].IsConfidential) {
            if (this._LoginUserId == this._MemoDetailsJson[0].FromUserId)
              this.DisplayOptions = true;
            else if (this._LoginUserId != this._MemoDetailsJson[0].FromUserId)
              this.DisplayOptions = false;
          }
          else
            this.DisplayOptions = true;
          this.LabelCount = this._MemoDetailsJson[0].LabelCount;
          this.SelectLabel = [];
          this._subject = this._MemoDetailsJson[0].MainSubject;

          if (this._MemoDetailsJson[0].DraftText == "") {
            // this.prependText('Dear User,<br><br><br><br><br>');
            // this.appendText(
            //   this.currentUserValue.SignatureThumbnail,
            //   this.currentUserValue.DisplayName,
            //   this.currentUserValue.DesignationName
            // );
          }
          else {
            this.htmlContent = this._MemoDetailsJson[0].DraftText;
          }
          this.DMSPendingCount = this._MemoDetailsJson[0].DMSPendingCount;
          this.MemoCreatedUserId = this._MemoDetailsJson[0].MemoAdminId;
          // this.MemoCreatedUserName = this._MemoDetailsJson[0].SentUser;
          this.FavoriteVal = this._MemoDetailsJson[0].Favorite;
          this.Pinval = this._MemoDetailsJson[0].isPin;
          this.AprrovewithCommentsList = this._MemoDetailsJson[0]['ActionUsers'];
          this.FirstReplyId = this._MemoDetailsJson[0].FirstReplyId;
          this._IsDeleted = this._MemoDetailsJson[0].IsDeleted;
          this._ApprovalReplyId = this._ReplyId;
          this.Dropdowntopsubject = this._MemoDetailsJson[0].Subject;
          if (this._MemoDetailsJson[0].ReplyRequired == true || this._MemoDetailsJson[0].ApprovalRequired == true) {
            this._tableRequired = true;
          }
          else {
            this._tableRequired = false;
          }
          this._ApprovalMemoId = MailId;
          //this._ApprovalReplyId = 0;
          //below code is used to bind the TO list in left section "this._ToUserListDetails"
          this._ToUserListDetails = this._MemoDetailsJson[0].TOUsers;
          this._CCUserListDetails = this._MemoDetailsJson[0].CCUsers;
          this.selectedToEmpIds = [];
          this.selectedCCEmpIds = [];
          this.selectedToEmployees = [];
          this.selectedCCEmployees = [];
          this._disabledUsers = [];
          this._disabledUsers = [this._LoginUserId];
          //binding selected users of memo in TO and CC dropdowns
          //start here
          this._ToUserListDetails.forEach(element => {
            if (element.IsExist && element.CreatedBy !== this._LoginUserId && element.UserActiveStatus == true) {
              // this.memoreplyService._ReplyMemoobj.selectedToUser.push(element.CreatedBy);
              this._TempToUsers.push(element.CreatedBy);
              //rebinding TO in mat chip "this.selectedToEmployees"
              this.selectedToEmployees.push(element);
              //selected ids to pass on submit in memo reply
              this.selectedToEmpIds.push(element.CreatedBy);
            }
            else {
              this._disabledUsers.push(element.CreatedBy);
            }
          });

          this._CCUserListDetails.forEach(element => {
            if (element.IsExist && element.CreatedBy !== this._LoginUserId && element.UserActiveStatus == true) {
              //rebinding CC in mat chip "this.selectedCCEmployees"
              this.selectedCCEmployees.push(element);
              //selected ids to pass on submit in memo reply
              this.selectedCCEmpIds.push(element.CreatedBy);
            }
            else {
              this._disabledUsers.push(element.CreatedBy);
            }
          });
          //end here

          //disabling New users if memo is confidential
          //start here
          // this._AllUsersToList = data["Data"]["TotalUsersJson"];
          if (this.IsConfidential && (this.MemoAdminId != this._LoginUserId)) {
            this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users"));
            this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users"));
          }
          // else if (this.IsConfidential && (this.MemoAdminId == this._LoginUserId)) {
          //   this._disabledUsers = [this._LoginUserId];
          // }


          // this._AllUsersCCList = data["Data"]["TotalUsersJson"];
          //disabling New users if memo is confidential
          //end here

          //Checking User exists in memo or removed from memo
          //start here
          const foundIsExists = this._ToUserListDetails.some(el => el.CreatedBy === this._LoginUserId && el.IsExist == false);
          if (foundIsExists) this._IsExists = false;
          const foundIsExistsCC = this._CCUserListDetails.some(el => el.CreatedBy === this._LoginUserId && el.IsExist == false);
          if (foundIsExistsCC) this._IsExists = false;
          //end here
          this._MemoDocuments = this._MemoDetailsJson[0].DocumentsJson;
          // console.log(this._MemoDocuments,"_MemoDocuments");
          this._ForwardMemoDocuments = this._MemoDetailsJson[0].DocumentsJson;
          this._MemoDocumentsCount = this._MemoDocuments.length;
          this._UsersAction = this._MemoDetailsJson[0].ActionUsers;
          this._Details = this._MemoDetailsJson;
          // console.log(this._Details, "Rightsection in Memodetails");
          this._IsHistory = this._Details[0].IsHistory;
          this.IsPolicyDocument = this._Details[0].IsPolicyDocument;
          if (this._IsHistory == 1 && this.IsPolicyDocument == false) {
            this.isHistoryVisible = true;
          }
          else {
            this.isHistoryVisible = false;
          }
          if (this._IsHistory == 0) {
            this._CurrectionSelectionIsHIstory = false;
          } else if (this._IsHistory == 1) {
            this._CurrectionSelectionIsHIstory = true;
          }
          this.AprrovewithCommentsList = this._Details[0]['ActionUsers'];

          this.Requestbutton = data["Data"].UserRequest;
          this._Drafttext = this._Details[0]['DraftText'];
          if (this._Drafttext == '') {
            this._DraftColour = false;
          }
          else {
            this._DraftColour = true;
          }
        }
      });
  }

  async ReplyListSignalR() {
    this._obj.MailId = this._MemoId;
    this._obj.ReplyFilter_AllMain = this.Pg_ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = this.Pg_ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = this.Pg_ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = this.Pg_ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = this.Pg_ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = this.Pg_ReplyFilter_Subject;
    this._obj.ReplyFilter_From = this.Pg_ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = this.Pg_ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = this.Pg_ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = this.ReplyFilter_ByMeWithActions;
    this._obj.IsReplyFilter = this.Reply_sort_exists;
    this._obj.ReplyFilter_Bookmarks = this.ReplyFilter_Bookmarks;
    this._obj.ReplyId = this._ReplyId;
    // if (this._obj.TotalReplyRecords == undefined) {
    //   this._obj.TotalReplyRecords = 1000000;
    // }
    (await this.inboxService.ReplyListLoadSignalR(this._obj)).subscribe(
      data => {
        console.log(this._ReplyFilteredDataList, "Reply List Triggered");
        setTimeout(() => {
          const targetElementId = `New_Div_${this._ReplyId}`;
          const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          } else {
          }
        }, 1000);
      }
    );
  }
  async MemoCreativePlannerProjects() {
    //Calling Creative Planner API for Project List
    //Start here
    this.ICustomUpload = [];
    (await this.outsourceService.ProjectListByMemoId(this._MemoId))
      .subscribe(async data => {
        this._outsourceobj = data as Outsourcedto;
        // alert(0)
        var _epProjects = JSON.parse(this._outsourceobj[0].JsonData);
        this._EPProjects = _epProjects;
        // alert(this._EPProjects.length);
        this.addCustomUplpadDTO('Policy', 1, false);
        this.addCustomUplpadDTO('Reference', 2, false);
        this.addCustomUplpadDTO('Guideline', 3, false);
        this.addCustomUplpadDTO('Other', 5, false);
        if (this._EPProjects == null) {
          this.isEP = false;
        }
        else {
          this.isEP = true;
          // this.addCustomUplpadDTO('Project Completed', 4, false);
          this._EPProjects.forEach(element => {
            element._ProjectList = JSON.parse(element.ProjectInfo)
          });
        }
      });
  }
  async ReplyListMemoDetailsV2(MailId: number) {
    this._MemoId = MailId;
    this._obj.MailId = MailId;
    this._obj.ReplyFilter_AllMain = this.Pg_ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = this.Pg_ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = this.Pg_ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = this.Pg_ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = this.Pg_ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = this.Pg_ReplyFilter_Subject;
    this._obj.ReplyFilter_From = this.Pg_ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = this.Pg_ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = this.Pg_ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = this.ReplyFilter_ByMeWithActions;
    this._obj.IsReplyFilter = this.Reply_sort_exists;
    this._obj.ReplyFilter_Bookmarks = this.ReplyFilter_Bookmarks;
    this._obj.ReplyId = this._ReplyId;
    (await this.inboxService.ReplyListMemoDetailsV2(this._obj))
      .subscribe(async data => {
        console.log(data, "memo details");
        this._ReplyFilteredDataList = data["Data"]["MemoReplyList"];
        console.log(this._ReplyFilteredDataList,"Left Section");
        this._obj.TotalReplyRecords = data["Data"]["TotalRecords"];
        this._UserExistsInMain = this._ReplyFilteredDataList[0]["UserExistsInMain"];
        // alert(this._UserExistInMemo);
        // alert(this._UserExistsInMain)
        this.Requestbutton = data["Data"]["UserRequest"];
        if (data["Data"]["UserRequest"] == 'False') {
          this.Aftersendmessage = false;
          this.Requestbutton = false;
        }
        else if (data["Data"]["UserRequest"] == 'True') {
          this.Aftersendmessage = true;
          this.Requestbutton = true;
        }
        var userexist = data["Data"]["UserExists"];
        if (userexist == 0 || userexist == 'False' || userexist == 'false') {
          this._UserExistInMemo = false;
        }
        else if (userexist == 1 || userexist == 'True' || userexist == 'true') {
          this._UserExistInMemo = true;
        }
        if (!this._UserExistInMemo) {
          this.Accessuser = data["Data"]["BasicMemoDetailsJson"];
          // console.log(this.Accessuser,"Accessuser");
        }
        this._ReplyUserDropdown = data["Data"]["ReplyFiltersUsers"];
        this.FeatureButton = data["Data"]["FeatureCount"];
        if (this.FeatureButton <= 2) {
          document.getElementById("newfeatures").style.display = "block";
          document.getElementById("newfeatures").style.overflow = "auto";
          document.getElementById("feature-modal-backdrop").classList.add("show");
        }
        this._AllUsersList = data["Data"]["TotalUsersJson"];
        //Assigning values to to and cc dropdown array, used while replying memo
        //start here
        this._AllUsersToList = data["Data"]["TotalUsersJson"];
        this._AllUsersCCList = data["Data"]["TotalUsersJson"];
        //end here
        if (data["Data"]["IsHistory"] == "True" && data["Data"]["IsPolicyDocument"] == "False") {
          this.isChecked = true;
        }
        const hasReplyIdInHistory = this._ReplyFilteredDataList.some(element =>
          element.ReplyDataList.find(reply =>
            reply.ReplyId == this._ReplyId
          )
        );
        // If hasReplyIdInHistory is true, it means we found a matching record
        if (!hasReplyIdInHistory) {
          if (this.isChecked) {
            const lastElement = this._ReplyFilteredDataList[0];
            const latestReplyId = lastElement.ReplyDataList[0].ReplyId;
            this._ReplyId = latestReplyId;
          }
          else {
            this._ReplyFilteredDataList.forEach(element => {
              // Filter ReplyDataList based on IsHistory == 0
              const filteredReplies = element.ReplyDataList.filter(rep => rep.IsHistory == 0);

              if (filteredReplies.length > 0) {
                // Assuming the last reply in the filtered list is the "latest"
                const lastReply = filteredReplies[0];
                this._ReplyId = lastReply.ReplyId;
              }
            });
          }
        }
        //Calling Reply details API
        //Start here
        await this.ReplyDetailsV2ForInitialLoad(this._ReplyId, this._MemoId);
        //End here
        //Calling SignalR for Reply List binding.
        if (this._obj.TotalReplyRecords > 1) {
          //this.startConnection();
        }
      });

    //Calling  function to Projects from creative planner
    await this.MemoCreativePlannerProjects();


  }

  timerFinished(): void {
    console.log('Timer has finished!');
    // Place your code here that needs to be triggered when the timer is up
  }
 
  async ReplyDetailsV2ForInitialLoad(replyid: number, mailid: number) {
    (await this.inboxService.MemoDetailsInitialLoadV2(replyid, mailid))
      .subscribe(data => {
        this._MemoDetailsJson = data["Data"]["MemoDetailsJson"];
        console.log(this._MemoDetailsJson, "ReplyDetailsV2ForInitialLoad");
        if (this._MemoDetailsJson.length > 0) {
          this._CurrectionSelectionIsHIstory = this._MemoDetailsJson[0].IsReply;
          // alert(this._CurrectionSelectionIsHIstory);
          this.initialIsConfidential = this._MemoDetailsJson[0].InitialReplyIsConfidential;
          this.MemoAdminId = this._MemoDetailsJson[0].MemoAdminId;
          this._ChatCount = this._MemoDetailsJson[0].ConversationCount;
          this._ReplyId = this._MemoDetailsJson[0].SelectedReplyId;
          // alert(this._ReplyId);
          this._DraftId = this._MemoDetailsJson[0].DraftId;
          this._Bookmark = this._MemoDetailsJson[0].IsBookmark;
          this.MemoCreatedUserName = this._MemoDetailsJson[0].SentUser;

          this.IsConfidential = this._MemoDetailsJson[0].IsConfidential;
          if (this._MemoDetailsJson[0].IsConfidential) {
            if (this._LoginUserId == this._MemoDetailsJson[0].FromUserId)
              this.DisplayOptions = true;
            else if (this._LoginUserId != this._MemoDetailsJson[0].FromUserId)
              this.DisplayOptions = false;
          }
          else
            this.DisplayOptions = true;
          this.LabelCount = this._MemoDetailsJson[0].LabelCount;
          this.SelectLabel = [];
          this._subject = this._MemoDetailsJson[0].MainSubject;

          if (this._MemoDetailsJson[0].DraftText == "") {
          }
          else {
            this.htmlContent = this._MemoDetailsJson[0].DraftText;
          }

          this.DMSPendingCount = this._MemoDetailsJson[0].DMSPendingCount;
          this.MemoCreatedUserId = this._MemoDetailsJson[0].MemoAdminId;
          this.FavoriteVal = this._MemoDetailsJson[0].Favorite;
          this.Pinval = this._MemoDetailsJson[0].isPin;
          this.AprrovewithCommentsList = this._MemoDetailsJson[0]['ActionUsers'];
          // console.log(this.AprrovewithCommentsList, "Action users");
          this.FirstReplyId = this._MemoDetailsJson[0].FirstReplyId;
          this._IsDeleted = this._MemoDetailsJson[0].IsDeleted;
          this._ApprovalReplyId = this._ReplyId;
          this.Dropdowntopsubject = this._MemoDetailsJson[0].Subject;
          console.log(this.Dropdowntopsubject,"Subject Data")
          if (this._MemoDetailsJson[0].ReplyRequired == true || this._MemoDetailsJson[0].ApprovalRequired == true) {
            this._tableRequired = true;
          }
          else {
            this._tableRequired = false;
          }
          this._ApprovalMemoId = this._MemoId;

          if (this.ReplyType == 'Edit Reply') {
            if (this._ReplyDetailsJson[0].ReplyRequired) {
              this.ReplyRequired = true;
            } else {
              this.ReplyRequired = false;
            }

            if (this._ReplyDetailsJson[0].ApprovalRequired) {
              this.ApprovalPending = true;
            } else {
              this.ApprovalPending = false;
            }

            if (this._ReplyDetailsJson[0].IsConfidential) {
              this._IsConfidential = true;
            } else {
              this._IsConfidential = false;
            }
          }
          //below code is used to bind the TO list in left section "this._ToUserListDetails"
          this._ToUserListDetails = this._MemoDetailsJson[0].TOUsers;
          // console.log(this._ToUserListDetails, "To User Value ReplyDetailsV2ForInitialLoad");
          this._CCUserListDetails = this._MemoDetailsJson[0].CCUsers;
          // console.log(this._CCUserListDetails, "CC Users List ReplyDetailsV2ForInitialLoad");
           this.TotalUserListDetails = this._ToUserListDetails.length;
           this.TotalCCUserListDetails = this._CCUserListDetails.length;
          //  console.log(this._ToUserListDetails,"TotalUsersss");
          this.selectedToEmpIds = [];
          this.selectedCCEmpIds = [];
          this.selectedToEmployees = [];
          this.selectedCCEmployees = [];
          this._disabledUsers = [];
          this._disabledUsers = [this._LoginUserId];
          //binding selected users of memo in TO and CC dropdowns
          //start here
          // console.log(this._ToUserListDetails, "_ToUserListDetails");
          this._ToUserListDetails.forEach(element => {
            if (element.IsExist && (element.CreatedBy !== this._LoginUserId) && element.UserActiveStatus == true) {
              this._TempToUsers.push(element.CreatedBy);
              this.selectedToEmployees.push(element);
              this.selectedToEmpIds.push(element.CreatedBy);
            }
          });
          // console.log(this._disabledUsers, "_disabledUsers");
          this._CCUserListDetails.forEach(element => {
            if (element.IsExist && (element.CreatedBy !== this._LoginUserId) && element.UserActiveStatus == true) {
              //rebinding CC in mat chip "this.selectedCCEmployees"
              this.selectedCCEmployees.push(element);
              //selected ids to pass on submit in memo reply
              this.selectedCCEmpIds.push(element.CreatedBy);
            }
          });
          // this._AllUsersList.forEach(element => {
          //   if ((element.IsExist == 0 || element.UserActiveStatus == false) && (element.CreatedBy != this._LoginUserId)) {
          //     this._disabledUsers.push(element.CreatedBy);
          //   }
          // });
          // // c
          // //end here

          // //disabling New users if memo is confidential
          // //start here
          // // this._AllUsersToList = data["Data"]["TotalUsersJson"];
          // if (this.IsConfidential && (this.MemoAdminId != this._LoginUserId)) {
          //   this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users"));
          //   this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users"));
          // }
          // else if (this.IsConfidential && (this.MemoAdminId == this._LoginUserId)) {
          //   this._disabledUsers = [this._LoginUserId];
          // }


          // this._AllUsersCCList = data["Data"]["TotalUsersJson"];
          //disabling New users if memo is confidential
          //end here

          //Checking User exists in memo or removed from memo
          //start here
          const foundIsExists = this._ToUserListDetails.some(el => el.CreatedBy === this._LoginUserId && el.IsExist == false);
          if (foundIsExists) this._IsExists = false;
          const foundIsExistsCC = this._CCUserListDetails.some(el => el.CreatedBy === this._LoginUserId && el.IsExist == false);
          if (foundIsExistsCC) this._IsExists = false;
          //end here
          this._MemoDocuments = this._MemoDetailsJson[0].DocumentsJson;
          // console.log(this._MemoDocuments,"_MemoDocuments");
          this._ForwardMemoDocuments = this._MemoDetailsJson[0].DocumentsJson;
          this._MemoDocumentsCount = this._MemoDocuments.length;
          this._UsersAction = this._MemoDetailsJson[0].ActionUsers;
          this._Details = this._MemoDetailsJson;
          this._IsHistory = this._Details[0].IsHistory;
          // console.log(this._Details, "Intialload");
          this._MinutesDifference = this._Details[0].MinutesDifference;
          this._SecondsDifference = this._Details[0].SecondsDifference;
          if (this._LoginUserId == this._Details[0].FromUserId) {
            if (this.timer) {
              this.timer.unsubscribe();
            }
            const _remaingMinutes = 15 - parseInt(this._MinutesDifference.toString());
            let duration = (60 * 15) - parseInt(this._SecondsDifference.toString()); //parseInt(_remaingMinutes.toString()) * 60; // 15 minutes in seconds
            this.timer = interval(1000).subscribe(() => {
              this.minutes = Math.floor(duration / 60);
              this.seconds = duration % 60;
              duration--;
              if (this.minutes < 0 && this.seconds < 0) {
                this.showButton = false;
                this.timer.unsubscribe();
                // Handle timer completion if needed
              } else {
                this.showButton = true;
              }
            });
          } else {
            if (this.timer) {
              this.timer.unsubscribe();
            }
            this.showButton = false;
          }
          if (this._LoginUserId == this._Details[0].FromUserId) {
            this.AddUserReplyAdmin = true
          } else {
            this.AddUserReplyAdmin = false
          }
          this.IsPolicyDocument = this._Details[0].IsPolicyDocument;
          if (this._IsHistory == 1 && this.IsPolicyDocument == false) {
            this.isChecked = true;
            this.isHistoryVisible = true;
          }
          else {
            this.isChecked = false;
            this.isHistoryVisible = false;
          }
          if (this._IsHistory == 0) {
            this._CurrectionSelectionIsHIstory = false;
          } else if (this._IsHistory == 1) {
            this._CurrectionSelectionIsHIstory = true;
          }
          this.AprrovewithCommentsList = this._Details[0]['ActionUsers'];
           this.DocumentsHistoryList = this._Details[0]['DocumentsJsonII'].length;
           this.AddedUsersJson = this._Details[0]['AddedUsersJson'];
           this.SubjectHistoryJson = this._Details[0]['SubjectHistoryJson'];
          // console.log(this.AddedUsersJson,"AddedUsersJson");
          // this.Requestbutton = data["Data"].UserRequest;
          this._Drafttext = this._Details[0]['DraftText'];
          if (this._Drafttext == '') {
            this._DraftColour = false;
          }
          else {
            this._DraftColour = true;
          }
        }
        this.ViewMorethreadshide = false;
        this._ReplyParentDetailsJson = [];
        this.ReplyHistoryV2(this._ReplyId, false, 0)
      });
  }

  async ReplyDetailsV2(replyid: number) {
    this._ReplyId = replyid;
    (await this.inboxService.ReplyDetailsV2(replyid))
      .subscribe(data => {
        this._disabledUsers = [];
        this._disabledUsers = [this._LoginUserId];
        this._ReplyDetailsJson = data["Data"]["ReplyDetailsJson"];
        // console.log(this._ReplyDetailsJson, "ReplyDetailsV2");
        this.initialIsConfidential = this._ReplyDetailsJson[0].InitialReplyIsConfidential;
        this.MemoAdminId = this._ReplyDetailsJson[0].MemoAdminId;
        this.IsConfidential = this._ReplyDetailsJson[0].IsConfidential;
        if (this._ReplyDetailsJson[0].IsConfidential) {
          if (this._LoginUserId == this._ReplyDetailsJson[0].FromUserId)
            this.DisplayOptions = true;
          else if (this._LoginUserId != this._ReplyDetailsJson[0].FromUserId)
            this.DisplayOptions = false;
        }
        else
          this.DisplayOptions = true;
        // this._ReplyParentDetailsJson = this._ReplyDetailsJson[0].ReplyParentJson;
        // console.log(this._ReplyParentDetailsJson,"ReplyHistory");
        this._ToUserMemo = this._ReplyDetailsJson[0].TOUsers;
        // console.log(this._ToUserMemo, "Reply API To Users");
        // const createdByValues = this._ToUserMemo
        //   .filter(item => item.UserActiveStatus === false)
        //   .map(item => item.CreatedBy);
        // // console.log(createdByValues, "createdByValues");
        // this._disabledUsers = [...this._disabledUsers, ...createdByValues];
        this._FromUserId = this._ReplyDetailsJson[0].FromUserId;
        this._DraftId = this._ReplyDetailsJson[0].DraftId;
        this._Bookmark = this._ReplyDetailsJson[0].IsBookmark;
        this.MemoCreatedUserId = this._ReplyDetailsJson[0].MemoAdminId;

        if (this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          if (this._ReplyDetailsJson[0].ReplyRequired) {
            this.ReplyRequired = true;
          } else {
            this.ReplyRequired = false;
          }

          if (this._ReplyDetailsJson[0].ApprovalRequired) {
            this.ApprovalPending = true;
          } else {
            this.ApprovalPending = false;
          }

          if (this._ReplyDetailsJson[0].IsConfidential) {
            this._IsConfidential = true;
          } else {
            this._IsConfidential = false;
          }
        }
        this._ToUserListDetails = this._ToUserMemo;
        this.TotalUserListDetails = this._ToUserListDetails.length;
        if (this._ReplyDetailsJson[0].ReplyRequired == true || this._ReplyDetailsJson[0].ApprovalRequired == true) {
          this._tableRequired = true;
        }
        else {
          this._tableRequired = false;
        }
        this._ToUserMemo = this._ToUserMemo.filter(item => item.CreatedBy !== this._LoginUserId);
        this._ToUserMemo = this._ToUserMemo.filter(item => item.UserActiveStatus == true);
        // this._disabledUsers.push(this._ToUserMemo.filter(item => item.UserActiveStatus == false));

        this._CCUserMemo = this._ReplyDetailsJson[0].CCUsers;
        this.TotalCCUserListDetails = this._CCUserMemo.length;
        // console.log(this._CCUserMemo,"CC Users");
        // const createdByValuesCC = this._AllUsersToList
        //   .filter(item => item.UserActiveStatus === false)
        //   .map(item => item.CreatedBy);
        // this._disabledUsers = [...this._disabledUsers, ...createdByValuesCC];
        this._CCUserMemo = this._CCUserMemo.filter(item => item.UserActiveStatus == true);
        this._CCUserMemo = this._CCUserMemo.filter(item => item.CreatedBy !== this._LoginUserId);


        // console.log(this._Details, "ReplyDetailsV2 Attachment Users")
        this._CCUserListDetails = this._ReplyDetailsJson[0].CCUsers;
        // console.log(this._CCUserListDetails, "Reply API CC Users");
        this.CCUserCount = this._CCUserListDetails.length;
        // alert(this.CCUserCount);
        this.selectedToUser = [];
        this.selectedCCUser = [];
        this._TotalUsers = [];
        //binding selected users of memo in TO and CC dropdowns
        //start here
        this._TempToUsers = [];
        this._TempCCUsers = [];
        this.selectedToEmployees = [];
        this.selectedCCEmployees = [];
        this.selectedToEmpIds = [];
        this.selectedCCEmpIds = [];


        this._ToUserMemo.forEach(element => {
          if (element.IsExist) {
            if (this.ReplyType != 'Forward' && this.ReplyType != "إلى الأمام" && this.ReplyType != 'Reply' && this.ReplyType != 'رد') {
              this.selectedToEmployees.push(element);
              this.selectedToEmpIds.push(element.CreatedBy);
            }
            else {
              if (element.CreatedBy == this._ReplyDetailsJson[0].FromUserId) {
                this.selectedToEmployees.push(element);
                this.selectedToEmpIds.push(element.CreatedBy);
              }
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
          }
          this._TempToUsers = [];
        });



        this._CCUserMemo.forEach(element => {
          if (element.IsExist) {
            if (this.ReplyType == 'Reply All' || this.ReplyType == 'Edit Reply' || this.ReplyType == "الرد على الجميع" || this.ReplyType == "تحرير الرد") {
              this.selectedCCEmployees.push(element);
              this.selectedCCEmpIds.push(element.CreatedBy);
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
          }
          this._TempCCUsers = [];
        });

        //end here

        //Assigning values to to and cc dropdown array, used while replying memo
        //Assigning values to to and cc dropdown array, used while replying memo
        //start here
        this._AllUsersToList = this._AllUsersList;
        // alert(this._AllUsersToList);
        this._AllUsersCCList = this._AllUsersList;
        // alert(this._AllUsersCCList);
        //end here

        this._AllUsersList.forEach(element => {
          if (((element.IsExist == 0 && element.UserGroup == "Memo Users") || element.UserActiveStatus == false) && (element.CreatedBy != this._LoginUserId)) {
            this._disabledUsers.push(element.CreatedBy);
          }
        });
        // c
        //end here


        //disabling New users if memo is confidential
        //start here
        // 
        // alert(this.IsConfidential);
        if (this.IsConfidential && (this.MemoAdminId != this._LoginUserId)) {
          this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
          this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
          // alert(this.IsConfidential);
        }
        //disabling New users if memo is confidential
        //end here

        //disabled login user
        //check when user is exist in memo then disabled
        //check if user is inactive then disabled
        //start here

        // this._AllUsersToList.forEach(element => {
        //   //check when user is exist in memo then disabled
        //   const foundIsExists = this._ToUserMemo.some(el => el.CreatedBy === element.CreatedBy && el.IsExist == 0);

        //   if (foundIsExists) element.disabled = true;
        //   //disabled login user
        //   (element.CreatedBy === this._LoginUserId) ? element.disabled = true : "";
        //   //check if user is inactive then disabled
        //   (element.UserActiveStatus == false) ? element.disabled = true : "";
        // });
        // //end here

        // //disabled login user
        // //check when user is exist in memo then disabled
        // //check if user is inactive then disabled
        // //start here
        // this._AllUsersCCList.forEach(element => {
        //   //check when user is exist in memo then disabled
        //   const foundIsExists = this._CCUserMemo.some(el => el.CreatedBy === element.CreatedBy && el.IsExist == 0);
        //   if (foundIsExists) element.disabled = true;
        //   //disabled login user
        //   (element.CreatedBy === this._LoginUserId) ? element.disabled = true : "";
        //   //check if user is inactive then disabled
        //   (element.UserActiveStatus == false) ? element.disabled = true : "";
        // });
        // //end here

        this._MemoDocuments = this._ReplyDetailsJson[0].DocumentsJson;

        if (this.ReplyType == 'Forward' || this.ReplyType == 'إلى الأمام' || this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          this._ForwardMemoDocuments = this._ReplyDetailsJson[0].DocumentsJson;
        } else if (this.ReplyType == 'Reply All' || this.ReplyType == 'Reply' || this.ReplyType == "الرد على الجميع" || this.ReplyType == 'رد') {
          // Assuming you want to clear or perform some specific action when ReplyType is 'Reply All' or 'Reply'
          // If you want to rebind some other data, replace the following line accordingly
          this._ForwardMemoDocuments = [];
        }

        this._MemoDocumentsCount = this._MemoDocuments.length;
        this._Details = this._ReplyDetailsJson;;
        // console.log(this._Details, "Rigntsection in  ReplyDetails");
        this._IsHistory = this._Details[0].IsHistory;
        // console.log(this._IsHistory,"Reply History");
        if (this._IsHistory == 0) {
          this._CurrectionSelectionIsHIstory = false;
        } else if (this._IsHistory == 1) {
          this._CurrectionSelectionIsHIstory = true;
        }
        this.IsPolicyDocument = this._Details[0].IsPolicyDocument;
        this.Dropdowntopsubject = this._Details[0].Subject;
        this.AprrovewithCommentsList = this._Details[0]['ActionUsers'];
        // console.log(this.AprrovewithCommentsList,"ActionUsers")
        this.DocumentsHistoryList = this._Details[0]['DocumentsJsonII'].length;
        this.AddedUsersJson = this._Details[0]['AddedUsersJson'];
        // console.log(this.AddedUsersJson,"AddedUsersJson");
        this.SubjectHistoryJson = this._Details[0]['SubjectHistoryJson'];
        console.log(this._Details,"ReplyDetailsV2");
        this._Drafttext = this._Details[0]['DraftText'];
        if (this._Drafttext != "" && this.ReplyType != 'Forward' && this.ReplyType != 'إلى الأمام') {
          this.htmlContent = this._Drafttext;
        }
        if (this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          this.htmlContent = this._Details[0].Matter;
        }
        if (this.ReplyType == 'Forward' || this.ReplyType == "إلى الأمام") {
          // this.htmlContent = `<div><br><br><br><span>---------------------------------------------------------------------------</span></div>  ${this._Details[0].Matter}`;
          this.htmlContent = '<div><br><br><br><span>---------------------------------------------------------------------------</span></div>' + this._Details[0].Matter;
        }
        if (this._Drafttext == '') {
          this._DraftColour = false;
        }
        else {
          this._DraftColour = true;
        }
        if (this._Details[0].DraftSubject == "") {
          this.SelectedSubject = this._Details[0].Subject;
        }
        else {
          this.SelectedSubject = this._Details[0].DraftSubject;
        }
        this._ApprovalMemoId = 0;
        this._ApprovalReplyId = replyid;
        this._UsersAction = this._ReplyDetailsJson[0].ActionUsers;
        // console.log(this._Details, "Right section");
        this._MinutesDifference = this._Details[0].MinutesDifference;
        this._SecondsDifference = this._Details[0].SecondsDifference;

        if (this._LoginUserId == this._Details[0].FromUserId) {
          if (this.timer) {
            this.timer.unsubscribe();
          }
          const _remaingMinutes = 15 - parseInt(this._MinutesDifference.toString());
          let duration = (60 * 15) - parseInt(this._SecondsDifference.toString()); //parseInt(_remaingMinutes.toString()) * 60; // 15 minutes in seconds
          this.timer = interval(1000).subscribe(() => {
            this.minutes = Math.floor(duration / 60);
            this.seconds = duration % 60;
            duration--;
            if (this.minutes < 0 && this.seconds < 0) {
              this.showButton = false;
              this.timer.unsubscribe();
              // Handle timer completion if needed
            } else {
              this.showButton = true;
            }
          });
        } else {
          if (this.timer) {
            this.timer.unsubscribe();
          }
          this.showButton = false;
        }

        if (this._LoginUserId == this._Details[0].FromUserId) {
          this.AddUserReplyAdmin = true
        } else {
          this.AddUserReplyAdmin = false
        }
        // //Setting Value to true,purpose is: reply details/replyid exists in left panel
        // //Start here
        // this._CheckDetailsDataExists = true;
        // //end here
        if (this._IsHistory == 0) {

          const commonActiveIdElement = this.el.nativeElement.querySelector('#hdnCommonActiveId');

          // Check if commonActiveIdElement is not null before accessing its value
          if (commonActiveIdElement) {
            const newValue = commonActiveIdElement.value;
            const newDivElement = this.el.nativeElement.querySelector(`#New_Div_${newValue}`);

            if (newDivElement) {
              newDivElement.classList.remove('active');

              const replyDivElement = this.el.nativeElement.querySelector(`#New_Div_${replyid}`);
              if (replyDivElement) {
                replyDivElement.classList.add('active');
                replyDivElement.classList.remove('new-m');
                commonActiveIdElement.value = replyid.toString();
              }
            }
          }
        } else if (this._IsHistory == 1) {
          const commonActiveIdElement = this.el.nativeElement.querySelector('#hdnCommonActiveId');

          // Check if commonActiveIdElement is not null before accessing its value
          if (commonActiveIdElement) {
            const newValue = commonActiveIdElement.value;
            const newDivElement = this.el.nativeElement.querySelector(`#New_Div_${newValue}`);

            if (newDivElement) {
              newDivElement.classList.remove('active');

              const replyDivElement = this.el.nativeElement.querySelector(`#New_Div_${replyid}`);
              if (replyDivElement) {
                replyDivElement.classList.add('active');
                replyDivElement.classList.remove('unread');
                commonActiveIdElement.value = replyid.toString();
              }
            }
          }
        }
        this.ViewMorethreadshide = false;
        this._ReplyParentDetailsJson = [];
        this.ReplyHistoryV2(this._ReplyId, false, 0);
      });
  }

  // This Method is using for timer
  //Start here
  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
  //End here

  ReplyDetails(replyid: number) {
    this._ReplyParentDetailsJson = [];
    this._ReplyId = replyid;
    this.inboxService.ReplyDetails(replyid).subscribe(
      da => {
        // console.log(da, "ReplyDetails");
        this._obj = da as InboxDTO;
        var _ReplyDtlsJson = da["Data"];
        _ReplyDtlsJson = _ReplyDtlsJson["ReplyDetailsJson"];
        this._ReplyDetailsJson = _ReplyDtlsJson;
        this.initialIsConfidential = this._ReplyDetailsJson[0].InitialReplyIsConfidential;
        this.MemoAdminId = this._ReplyDetailsJson[0].MemoAdminId;
        this.IsConfidential = this._ReplyDetailsJson[0].IsConfidential;
        if (this._ReplyDetailsJson[0].IsConfidential) {
          if (this._LoginUserId == this._ReplyDetailsJson[0].FromUserId)
            this.DisplayOptions = true;
          else if (this._LoginUserId != this._ReplyDetailsJson[0].FromUserId)
            this.DisplayOptions = false;
        }
        else
          this.DisplayOptions = true;
        this._ReplyParentDetailsJson = this._ReplyDetailsJson[0].ReplyParentJson;
        // console.log(this._ReplyParentDetailsJson, "ReplyHistory");
        this._ToUserMemo = this._ReplyDetailsJson[0].TOUsers;
        this._FromUserId = this._ReplyDetailsJson[0].FromUserId;
        this._DraftId = this._ReplyDetailsJson[0].DraftId;
        this._Bookmark = this._ReplyDetailsJson[0].IsBookmark;
        this.MemoCreatedUserId = this._ReplyDetailsJson[0].MemoAdminId;
        // alert( this._Bookmark);
        // this._Memosource = MemoSource;
        // alert(this._Bookmark);
        // alert(this._Memosource);
        this._ToUserListDetails = this._ToUserMemo;
        // this.ToUserCount = this._ToUserListDetails.length;
        if (this._ReplyDetailsJson[0].ReplyRequired == true || this._ReplyDetailsJson[0].ApprovalRequired == true) {
          this._tableRequired = true;
        }
        else {
          this._tableRequired = false;
        }
        this._ToUserMemo = this._ToUserMemo.filter(item => item.CreatedBy !== this._LoginUserId);
        this._ToUserMemo = this._ToUserMemo.filter(item => item.UserActiveStatus == true);

        this._CCUserMemo = this._ReplyDetailsJson[0].CCUsers;
        this._CCUserMemo = this._CCUserMemo.filter(item => item.UserActiveStatus == true);
        this._CCUserMemo = this._CCUserMemo.filter(item => item.CreatedBy !== this._LoginUserId);

        this._CCUserListDetails = this._ReplyDetailsJson[0].CCUsers;
        this.CCUserCount = this._CCUserListDetails.length;
        this.selectedToUser = [];
        this.selectedCCUser = [];
        this._TotalUsers = [];
        // this.memoreplyService._ReplyMemoobj.selectedToUser = [];
        // this.memoreplyService._ReplyMemoobj.selectedCCUser = [];
        //binding selected users of memo in TO and CC dropdowns
        //start here
        this._TempToUsers = [];
        this._TempCCUsers = [];
        this.selectedToEmployees = [];
        this.selectedCCEmployees = [];
        this.selectedToEmpIds = [];
        this.selectedCCEmpIds = [];
        this._disabledUsers = [];

        this._disabledUsers = [this._LoginUserId];
        this._ToUserMemo.forEach(element => {
          if (element.IsExist) {
            // this.memoreplyService._ReplyMemoobj.selectedToUser.push(element.CreatedBy);
            // this._TempToUsers.push(element);
            if (this.ReplyType != 'Forward') {
              this.selectedToEmployees.push(element);
              this.selectedToEmpIds.push(element.CreatedBy);
              // console.log(this.selectedToEmpIds,"selectedToEmpIds");
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
          }
          this._TempToUsers = [];
          // this.memoreplyService._ReplyMemoobj.selectedToUser.forEach(element => {
          //   this._TempToUsers.push(element);
          // });
        });

        this._CCUserMemo.forEach(element => {
          if (element.IsExist) {
            // this.memoreplyService._ReplyMemoobj.selectedCCUser.push(element.CreatedBy);
            // this._TempCCUsers.push(element);
            if (this.ReplyType == 'Reply All') {
              this.selectedCCEmployees.push(element);
              this.selectedCCEmpIds.push(element.CreatedBy);
              // console.log(this.selectedCCEmpIds,"selectedCCEmpIds");
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
          }
          this._TempCCUsers = [];
          // this.memoreplyService._ReplyMemoobj.selectedCCUser.forEach(element => {
          //   this._TempCCUsers.push(element);
          // });
        });
        //end here

        //Assigning values to to and cc dropdown array, used while replying memo
        //start here
        this._AllUsersToList = this._AllUsersList;
        this._AllUsersCCList = this._AllUsersList;
        //end here

        //disabling New users if memo is confidential
        //start here
        // this._AllUsersToList = data["Data"]["TotalUsersJson"];
        if (this.IsConfidential && (this.MemoAdminId != this._LoginUserId)) {
          this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
          this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
        }

        // this._AllUsersCCList = data["Data"]["TotalUsersJson"];
        //disabling New users if memo is confidential
        //end here

        //disabled login user
        //check when user is exist in memo then disabled
        //check if user is inactive then disabled
        //start here

        this._AllUsersToList.forEach(element => {
          //check when user is exist in memo then disabled
          const foundIsExists = this._ToUserMemo.some(el => el.CreatedBy === element.CreatedBy && el.IsExist == false);
          if (foundIsExists) element.disabled = true;
          //disabled login user
          (element.CreatedBy === this._LoginUserId) ? element.disabled = true : "";
          //check if user is inactive then disabled
          (element.UserActiveStatus == false) ? element.disabled = true : "";
        });
        //end here

        //disabled login user
        //check when user is exist in memo then disabled
        //check if user is inactive then disabled
        //start here
        this._AllUsersCCList.forEach(element => {
          //check when user is exist in memo then disabled
          const foundIsExists = this._CCUserMemo.some(el => el.CreatedBy === element.CreatedBy && el.IsExist == false);
          if (foundIsExists) element.disabled = true;
          //disabled login user
          (element.CreatedBy === this._LoginUserId) ? element.disabled = true : "";
          //check if user is inactive then disabled
          (element.UserActiveStatus == false) ? element.disabled = true : "";
        });
        //end here
        this._MemoDocuments = this._ReplyDetailsJson[0].DocumentsJson;
        // if (this.ReplyType == 'Forward') {
        //   this._ForwardMemoDocuments = this._ReplyDetailsJson[0].DocumentsJson;
        // }
        if (this.ReplyType === 'Forward') {
          this._ForwardMemoDocuments = this._ReplyDetailsJson[0].DocumentsJson;
        } else if (this.ReplyType === 'Reply All' || this.ReplyType === 'Reply') {
          // Assuming you want to clear or perform some specific action when ReplyType is 'Reply All' or 'Reply'
          // If you want to rebind some other data, replace the following line accordingly
          this._ForwardMemoDocuments = [];
        }
        this._MemoDocumentsCount = this._MemoDocuments.length;
        this._Details = this._ReplyDetailsJson;;
        // console.log(this._Details, "Rigntsection in  ReplyDetails");
        this._IsHistory = this._Details[0].IsHistory;
        // console.log(this._IsHistory,"Reply History");
        if (this._IsHistory == 0) {
          this._CurrectionSelectionIsHIstory = false;
        } else if (this._IsHistory == 1) {
          this._CurrectionSelectionIsHIstory = true;
        }
        this.Dropdowntopsubject = this._Details[0].Subject;
        this.AprrovewithCommentsList = this._Details[0]['ActionUsers'];


        this._Drafttext = this._Details[0]['DraftText'];

        if (this._Drafttext == "" && this.ReplyType != 'Forward') {
          // this.prependText('Dear User,<br><br><br><br><br>');
          // this.appendText(
          //   this.currentUserValue.SignatureThumbnail,
          //   this.currentUserValue.DisplayName,
          //   this.currentUserValue.DesignationName
          // );
        }
        else if (this._Drafttext != "" && this.ReplyType != 'Forward') {
          this.htmlContent = this._Drafttext;
        }
        else if (this.ReplyType == 'Forward') {
          this.htmlContent = this._Details[0].Matter;
        }

        if (this._Drafttext == '') {
          this._DraftColour = false;
        }
        else {
          this._DraftColour = true;
        }
        if (this._Details[0].DraftSubject == "") {
          this.SelectedSubject = this._Details[0].Subject;
        }
        else {
          this.SelectedSubject = this._Details[0].DraftSubject;
        }
        this._ApprovalMemoId = 0;
        this._ApprovalReplyId = replyid;
        this._UsersAction = this._ReplyDetailsJson[0].ActionUsers;
      }
    )
    this.ViewMorethreadshide = false;
    // if (this._IsHistory == 0) {
    //   var newValue = (<HTMLInputElement>document.getElementById("hdnCommonActiveId")).value;
    //   (<HTMLInputElement>document.getElementById("New_Div_" + newValue)).classList.remove("active");
    //   (<HTMLInputElement>document.getElementById("New_Div_" + replyid)).classList.add("active");
    //   (<HTMLInputElement>document.getElementById("New_Div_" + replyid)).classList.remove("new-m");
    //   (<HTMLInputElement>document.getElementById("hdnCommonActiveId")).value = replyid.toString();
    // } else if (this._IsHistory == 1) {
    // }
    if (this._IsHistory === 0) {
      const commonActiveIdElement = this.el.nativeElement.querySelector('#hdnCommonActiveId');

      // Check if commonActiveIdElement is not null before accessing its value
      if (commonActiveIdElement) {
        const newValue = commonActiveIdElement.value;
        const newDivElement = this.el.nativeElement.querySelector(`#New_Div_${newValue}`);

        if (newDivElement) {
          newDivElement.classList.remove('active');
          this.el.nativeElement.querySelector(`#New_Div_${replyid}`).classList.add('active');
          this.el.nativeElement.querySelector(`#New_Div_${replyid}`).classList.remove('new-m');
          commonActiveIdElement.value = replyid.toString();
        }
      }
    } else if (this._IsHistory === 1) {
      // Handle the case when _IsHistory is 1
    }


    // var newValue = (<HTMLInputElement>document.getElementById("hdnCommonActiveId")).value;
    // (<HTMLInputElement>document.getElementById("New_Div_" + newValue)).classList.remove("active");
    // (<HTMLInputElement>document.getElementById("New_Div_" + replyid)).classList.add("active");
    // (<HTMLInputElement>document.getElementById("New_Div_" + replyid)).classList.remove("new-m");
    // (<HTMLInputElement>document.getElementById("hdnCommonActiveId")).value = replyid.toString();
  }
  Collapse_v() {
    $(".Collapse-v").hide();
    $(".Expand-v").show();
  }

  Expand_v() {
    $(".Collapse-v").show();
    $(".Expand-v").hide();

    $('.Expand-v').on('click', function (e) {
      if ($(this).parents('.accordion').find('.collapse.show')) {
        var idx = $(this).index('[data-toggle="collapse"]');
        if (idx == $('.collapse.show').index('.collapse')) {
          // prevent collapse
          e.stopPropagation();
        }
      }
    });

  }
  ParentTitle(ParentId) {
    this.ReplyDetailsV2(ParentId);
    setTimeout(() => {
      const targetElementId = `New_Div_${this._ReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 2000);
  }

  MemoRequestTitle(LastReplyId) {
    // alert(LastReplyId);
    this.ReplyDetailsV2(LastReplyId);
    setTimeout(() => {
      const targetElementId = `New_Div_${LastReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    $("#Selected_All").prop("checked", true);
    this.AddNewUserValues = [];
    this.SelectedUserIds = [];
    $('#add_users').removeClass('active');
    $('#users_reqs').removeClass('active');
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnUsersList_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

  }

  MemoReply() {
    if (this.htmlContent == '') {
      $('.error-msg-pop-x').removeClass('d-none');
      this.showSendAnywayAndCancelButtons = false;
      // alert(this.showSendAnywayAndCancelButtons);
      return false;
    }
    else {
      this.SendMemoReply();
    }
  }

  SendMemoReply() {
    var MailId = parseInt((<HTMLInputElement>document.getElementById("hdnMainId")).value);
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("files", this._lstMultipleFiales[i].Files);
    }
    this._obj.UserReplied = 1;
    this._obj.MailId = this._MemoId;
    this._obj.DocumentId = 0;
    this._obj.FromUserId = this._LoginUserId;
    this._obj.Reply = this.ReplyRequired === undefined ? false : this.ReplyRequired;
    if (this._lstMultipleFiales.length > 0) {
      this._obj.Attachment = true;
    }
    else {
      this._obj.Attachment = false;
    }
    let attvalu = this._obj.Attachment;
    if (this._ExpiryDate == null) {
      this._ExpiryDate = new Date("2000-01-01");
      this._obj.Deadline_sort = 0;
      this._obj.DeadLineDate = new Date("2000-01-01");
    }
    else {
      let parsedDate = moment(this._ExpiryDate, "YYYY-MM-DD");
      let outputDate = parsedDate.format("YYYY-MM-DD");
      this._ExpiryDate = new Date(outputDate);
      this._obj.Deadline_sort = 1;
      this._obj.DeadLineDate = this._ExpiryDate;
    }
    this._obj.Description = this.htmlContent;
    this._obj.ApprovalPending_F = this.ApprovalPending === undefined ? false : this.ApprovalPending;
    this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;

    this._obj.IsActive = false;
    this._obj.ParentId = this._ReplyId;
    if (!this.selectedToEmpIds || this.selectedToEmpIds.length === 0) {
      $('.error-msg-pop-x-forward').removeClass('d-none');
      this.ToErrorlog = true;
    } else if (this.SelectedSubject === "")
      this.SubjectErrorlog = true;
    if (this.ToErrorlog == true || this.SubjectErrorlog == true) return false;
    this._obj.ToUserxml = this.selectedToEmpIds;
    this._obj.Deadline_sort = 1;
    this._obj.message = "";
    this._obj.Title = this.SelectedSubject;
    this._obj.CCUserxml = this.selectedCCEmpIds;
    // this._obj.MemoReplyType = this.ReplyType;
    if (this.ReplyType === "Reply All" || this.ReplyType === "الرد على الجميع") {
      this._obj.MemoReplyType = "Reply All";
    }

    if (this.ReplyType === "Reply" || this.ReplyType === "رد") {
      this._obj.MemoReplyType = "Reply";
    }
    if (this.ReplyType === "Forward" || this.ReplyType === "إلى الأمام") {
      this._obj.MemoReplyType = "Forward";
    }

    this._obj.MailDocIdString = this._ForwardMemoDocuments.map(obj => obj.MailDocId).join(', ');
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    $("body").addClass("progressattachment");
    this.memoreplyService.MemoReplys(this._obj).subscribe(
      data => {
        // console.log(data, "MemoReply");
        this._obj = data as InboxDTO;
        frmData.append("MailId", MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "true");
        frmData.append("ReplyId", data["Data"].ReplyId);
        // console.log(data["Data"].ReplyId,"ReplyID");
        if (attvalu == true) {
          this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
            .catch(err => console.log('Error while connect with server'));

          this.newmemoService.UploadAttachmenst(frmData).subscribe(
            (event: HttpEvent<any>) => {
              const language = localStorage.getItem('language');
              switch (event.type) {
                case HttpEventType.Sent:
                  // console.log('Request has been made!');
                  break;
                case HttpEventType.ResponseHeader:
                  // console.log('Response header has been received!');
                  break;
                case HttpEventType.UploadProgress:
                  this.progress = Math.round(event.loaded / event.total * 100);

                  if (this.progress == 100) {
                    this.progressConnectionBuilder.on("ReceiveProgress", (progressbar) => {
                      this.progress = progressbar;
                      console.log(progressbar, "progressbar in memodetails");
                      if (this.progress == 100) {
                        if (language === 'ar') {
                          this._snackBar.open('تم رفع الملفات..', 'تنتهي الآن', {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                          });
                        } else {
                          this._snackBar.open('Files Uploaded..', 'End now', {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                          });
                        }
                      }
                    });
                    if (language === 'ar') {
                      this._snackBar.open('تم إرسال الرد، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                      });
                    } else {
                      this._snackBar.open('Reply Sent, Please Wait to upload the file..', 'End now', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                      });
                    }
                  }
                  break;
                case HttpEventType.Response:
                  $("body").removeClass("progressattachment");
                  // Display message based on language preference
                  if (language === 'ar') {
                    this._snackBar.open('تم إرسال الرد بنجاح', 'تنتهي الآن', {
                      duration: 5000,
                      horizontalPosition: "right",
                      verticalPosition: "bottom",
                    });
                  } else {
                    this._snackBar.open('Reply Sent Successfully', 'End now', {
                      duration: 5000,
                      horizontalPosition: "right",
                      verticalPosition: "bottom",
                    });
                  }

                  this.ReplyListMemoDetailsV2(this._MemoId);
                  this.ICustomUpload = [];
                  setTimeout(() => {
                    this.progress = 0;
                  }, 1000);
                  (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
                  document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                  document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

                  this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
                    data => {
                      console.log(data, "New Memos Triggered")
                    }
                  );
                  var _touse = [];
                  if (this.selectedToEmpIds.length > 0) {
                    for (let index = 0; index < this.selectedToEmpIds.length; index++) {
                      _touse.push(this.selectedToEmpIds[index]);
                    }
                    for (let index = 0; index < this.selectedCCEmpIds.length; index++) {
                      _touse.push(this.selectedCCEmpIds[index]);
                    }
                    this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._obj.MailId, data["Data"].ReplyId).subscribe(
                      data => {
                        console.log(data, "New Memos Notifications");
                      }
                    );
                  }
              }
              setTimeout(() => {
                const targetElementId = `New_Div_${data["Data"].ReplyId}`;
                const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                }
              }, 1000);
            }
          )
        }
        else {
          $("body").removeClass("progressattachment");
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('تم إرسال الرد بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Reply Sent Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }
          // this.MemoDetails(this._MemoId);
          this.ReplyListMemoDetailsV2(this._MemoId);
          this.ICustomUpload = [];
          (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
            data => {
              console.log(data, "New Memos Triggered")
            }
          );
          var _touse = [];
          if (this.selectedToEmpIds.length > 0) {
            for (let index = 0; index < this.selectedToEmpIds.length; index++) {
              _touse.push(this.selectedToEmpIds[index]);
            }
            for (let index = 0; index < this.selectedCCEmpIds.length; index++) {
              _touse.push(this.selectedCCEmpIds[index]);
            }
            this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._obj.MailId, data["Data"].ReplyId).subscribe(
              data => {
                console.log(data, "New Memos Notifications");
              }
            )
          }
        }
        this.Description = '';
        this._ExpiryDate = null;
        this.DeadlineDatecheck = false;
        this.htmlContent = "";


      }
    )
  }

  SendEditReply() {
    var MailId = parseInt((<HTMLInputElement>document.getElementById("hdnMainId")).value);
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("files", this._lstMultipleFiales[i].Files);
    }
    this._obj.UserReplied = 1;
    this._obj.MailId = this._MemoId;
    this._obj.ReplyId = this._ReplyId;
    this._obj.DocumentId = 0;
    this._obj.FromUserId = this._LoginUserId;
    this._obj.Reply = this.ReplyRequired === undefined ? false : this.ReplyRequired;
    if (this._lstMultipleFiales.length > 0) {
      this._obj.Attachment = true;
    }
    else {
      this._obj.Attachment = false;
    }
    let attvalu = this._obj.Attachment;
    if (this._ExpiryDate == null) {
      this._ExpiryDate = new Date("2000-01-01");
      this._obj.Deadline_sort = 0;
      this._obj.DeadLineDate = new Date("2000-01-01");
    }
    else {
      let parsedDate = moment(this._ExpiryDate, "YYYY-MM-DD");
      let outputDate = parsedDate.format("YYYY-MM-DD");
      this._ExpiryDate = new Date(outputDate);
      this._obj.Deadline_sort = 1;
      this._obj.DeadLineDate = this._ExpiryDate;
    }
    this._obj.Description = this.htmlContent;
    this._obj.ApprovalPending_F = this.ApprovalPending === undefined ? false : this.ApprovalPending;
    this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;

    this._obj.IsActive = false;
    this._obj.ParentId = this._ReplyId;
    if (!this.selectedToEmpIds || this.selectedToEmpIds.length === 0)
      this.ToErrorlog = true;
    else if (this.SelectedSubject === "")
      this.SubjectErrorlog = true;
    if (this.ToErrorlog == true || this.SubjectErrorlog == true) return false;
    this._obj.ToUserxml = this.selectedToEmpIds;
    this._obj.Deadline_sort = 1;
    this._obj.message = "";
    this._obj.Title = this.SelectedSubject;
    this._obj.CCUserxml = this.selectedCCEmpIds;
    // this._obj.MemoReplyType = this.ReplyType;
    // alert(this.ReplyType);
    if (this.ReplyType === "Edit Reply" || this.ReplyType === "تحرير الرد") {
      this._obj.MemoReplyType = "Edit Reply";
    }


    this._obj.MailDocIdString = this._ForwardMemoDocuments.map(obj => obj.MailDocId).join(', ');
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    $("body").addClass("progressattachment");
    this.memoreplyService.EditReply(this._obj).subscribe(
      data => {
        this._obj = data as InboxDTO;
        frmData.append("MailId", MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "true");
        frmData.append("ReplyId", data["Data"].ReplyId);
        if (attvalu == true) {
          this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
            .catch(err => console.log('Error while connect with server'));
          this.newmemoService.UploadAttachmenst(frmData).subscribe(
            (event: HttpEvent<any>) => {
              const language = localStorage.getItem('language');
              switch (event.type) {
                case HttpEventType.Sent:
                  // console.log('Request has been made!');
                  break;
                case HttpEventType.ResponseHeader:
                  // console.log('Response header has been received!');
                  break;
                case HttpEventType.UploadProgress:
                  this.progress = Math.round(event.loaded / event.total * 100);

                  if (this.progress == 100) {
                    this.progressConnectionBuilder.on("ReceiveProgress", (progressbar) => {
                      this.progress = progressbar;
                      if (this.progress == 100) {
                        if (language === 'ar') {
                          this._snackBar.open('تم رفع الملفات..', 'تنتهي الآن', {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                          });
                        } else {
                          this._snackBar.open('Files Uploaded..', 'End now', {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                          });
                        }
                      }
                      if (language === 'ar') {
                        this._snackBar.open('تم إرسال الرد، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      } else {
                        this._snackBar.open('Reply Sent, Please Wait to upload the file..', 'End now', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      }
                    });

                  }
                  break;
                case HttpEventType.Response:
                  $("body").removeClass("progressattachment");
                  if (language === 'ar') {
                    this._snackBar.open('تم إرسال الرد بنجاح', 'تنتهي الآن', {
                      duration: 5000,
                      horizontalPosition: "right",
                      verticalPosition: "bottom",
                    });
                  } else {
                    this._snackBar.open('Reply Sent Successfully', 'End now', {
                      duration: 5000,
                      horizontalPosition: "right",
                      verticalPosition: "bottom",
                    });
                  }
                  this.ReplyListMemoDetailsV2(this._MemoId);
                  this.ICustomUpload = [];
                  (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
                  document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                  document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                  setTimeout(() => {
                    this.progress = 0;
                  }, 1500);
                  this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
                    data => {
                      console.log(data, "New Memos Triggered")
                    }
                  );
                  var _touse = [];
                  if (this.selectedToEmpIds.length > 0) {
                    for (let index = 0; index < this.selectedToEmpIds.length; index++) {
                      _touse.push(this.selectedToEmpIds[index]);
                    }
                    for (let index = 0; index < this.selectedCCEmpIds.length; index++) {
                      _touse.push(this.selectedCCEmpIds[index]);
                    }
                    this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._obj.MailId, data["Data"].ReplyId).subscribe(
                      data => {
                        console.log(data, "New Memos Notifications");
                      }
                    );
                  }
              }
              setTimeout(() => {
                const targetElementId = `New_Div_${data["Data"].ReplyId}`;
                const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                }
              }, 1000);
            }
          )
        }
        else {
          $("body").removeClass("progressattachment");
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('تم إرسال الرد بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Reply Sent Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }
          // this.MemoDetails(this._MemoId);
          this.ReplyListMemoDetailsV2(this._MemoId);
          this.ICustomUpload = [];
          (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
            data => {
              console.log(data, "New Memos Triggered")
            }
          );
          var _touse = [];
          if (this.selectedToEmpIds.length > 0) {
            for (let index = 0; index < this.selectedToEmpIds.length; index++) {
              _touse.push(this.selectedToEmpIds[index]);
            }
            for (let index = 0; index < this.selectedCCEmpIds.length; index++) {
              _touse.push(this.selectedCCEmpIds[index]);
            }
            this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._obj.MailId, data["Data"].ReplyId).subscribe(
              data => {
                console.log(data, "New Memos Notifications");
              }
            )
          }
        }
        this.Description = '';
        this._ExpiryDate = null;
        this.DeadlineDatecheck = false;
        this.htmlContent = "";
      }
    )
  }

  Rebinding() {
    this.txtSearch = "";
    this.MemoDetails(this._MemoId);
  }

  viewheli() {
    var div = document.getElementById("actvty-top");
    div.scrollIntoView({ behavior: "smooth" });
    //$('#cmts-layout').removeClass('hidden');
    // this._Details.forEach(element => {
    //   this.AprrovewithCommentsList = JSON.parse(element[0].ActionCommentsJson);
    // });
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
        if (data['Message'] == true) {
          this.LabelsJsondata = data['Data'];
          this.LabelsJsondata = (this.LabelsJsondata['LablesJson']);
          this.SubLabelList = this.LabelsJsondata
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم إنشاء التصنيف بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Label Create Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }

          this.cd.detectChanges();
          this.label = ""
          this.Addlabel = "";
        }
        else if (data['Message'] == false) {
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('هناك خطأ ما', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Something went wrong', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }

        }
      });
  }

  public startTour(value: string) {
    if (value == "MemoReplyFilters") {
      this.guidedTourService.startTour({
        tourId: 'MemoReplyFilters',
        useOrb: false,
        skipCallback: (stepSkippedOn: number) => this.UpdateTourCount(value),
        completeCallback: () => this.UpdateTourCount(value),
        steps: [
          {
            title: 'Memo Reply Filters',
            selector: '#post1',
            content: 'user can arrange and sort the data by using this action.',
            orientation: 'bottom'
          },
          {
            title: 'Arranged/Filtered Data',
            selector: '#post2',
            content: 'view the customized data as per filter.',
            orientation: 'right'
          }
          ,
          {
            title: 'Previous Replies',
            selector: '#post3',
            content: 'user can see the parent replies.',
            orientation: 'top'
          }
        ]

      });
    }
  }

  UpdateTourCount(_value: string) {
    var data = localStorage.getItem('currentUser');
    if (data != null) {
      let cart = JSON.parse(data);
      cart[0].Triggered = cart[0].Triggered + 1;
      localStorage.setItem('currentUser', JSON.stringify(cart));
    }
    this._userdto.createdby = this.currentUserValue.createdby;
    this._userdto.TourId = _value;
    this._apiService.UpdateTourCount(this._userdto)
      .subscribe(data => {

      }
      );
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
      var dynamicScripts = ["../../../assets/js/scripts.bundle.js", "../../../assets/js/annyang.min.js"];

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

  //Tourguid_comment
  public loadTourGuideScripts() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }

    if (!isFound) {
      // var dynamicScripts = ["../../../assets/js/tour/tourguide.min.js", "../../../assets/js/tour/jquery-3.3.1.slim.min.js", "../../../assets/js/dashboard/main.js"];
      var dynamicScripts = ["../../../assets/js/tour/jquery-3.3.1.slim.min.js", "../../../assets/js/tour/tourguide.min.js"];

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

  startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
    this.voiceActiveSectionError = false;
    this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;

    if (annyang) {
      let commands = {
        'demo-annyang': () => { }
      };

      annyang.addCommands(commands);
      this.initializeVoiceRecognitionCallback();

      annyang.start({ autoRestart: false });
    }
  }

  initializeVoiceRecognitionCallback(): void {
    annyang.addCallback('error', (err) => {
      if (err.error === 'network') {
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
      }
    });

    annyang.addCallback('soundstart', (res) => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
    });

    annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
      }
    });

    annyang.addCallback('result', (userSaid) => {
      // this.ngZone.run(() => this.voiceActiveSectionError = false);

      let queryText: any = userSaid[0];

      annyang.abort();
      this.voiceText = queryText;
      //this.htmlContent = this.htmlContent + " " + this.voiceText;

      this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
    });

  }

  closeVoiceRecognition(): void {
    this.voiceText = undefined;
    if (annyang) {
      annyang.abort();
    }
  }

  removetag(labelid: number) {
    const MemoIdsArray: number[] = [];
    MemoIdsArray.push(this._MemoId);
    this.inboxService.RemoveMemoFromLabel(MemoIdsArray.toString(), labelid, this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        const language = localStorage.getItem('language');

        // Display message based on language preference
        if (language === 'ar') {
          this._snackBar.open('تمت إزالة التسمية بنجاح', 'تنتهي الآن', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        } else {
          this._snackBar.open('Remove Label Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        }

        this.MemoDetails(this._MemoId);
        MemoIdsArray.forEach(element => {
          // (<HTMLInputElement>document.getElementById("mailid_" + element)).style.display = "none";
        });
      }
    )
    this.LabelUserErrorLog = false;
    $('#Kt_labels').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  AddMemostoLabels() {

    if (this.SelectedLabelIds == undefined || this.SelectedLabelIds == "") {
      this.LabelUserErrorLog = true;
      return
    }
    this.LabelUserErrorLog = false;
    if (this.SelectedLabelIds != 0) {
      this.inboxService.AddMemoToLabel(this._MemoId.toString(), this.SelectedLabelIds.toString(), this.currentUserValue.createdby).subscribe(
        data => {
          if (data["Message"] == "1") {
            const language = localStorage.getItem('language');

            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تمت إضافة التصنيفات بنجاح', 'تنتهي الآن', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom"
              });
            } else {
              this._snackBar.open('Labels Added Successfully', 'End now', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom"
              });
            }

          }
          this.LabelCount = data["Data"].LabelCount;
        }
      )
    } else {
      const language = localStorage.getItem('language');

      // Display message based on language preference
      if (language === 'ar') {
        this._snackBar.open('الرجاء تحديد العلامة', 'تنتهي الآن', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['red-snackbar']
        });
      } else {
        this._snackBar.open('Please Select Tag', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['red-snackbar']
        });
      }

    }
    $('#Kt_labels').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    // this.Labeltext = null;
    this.SelectedLabelIds = [];
    this.AddLabelList = [];
  }

  newLabels() {
    $('#newlabel').show();
    $('#exislabel').hide();
    $('#labelsnew').hide();
    $('#labelslist').show();
    // document.getElementById("addbtntxt").innerHTML = "Create New";
  }

  exisLabels() {
    $('#newlabel').hide();
    $('#exislabel').show();
    $('#labelslist').hide();
    $('#labelsnew').show();
    // document.getElementById("addbtntxt").innerHTML = "Add";
  }
  viwcmnts() {
    document.getElementById("appr-cmts").classList.toggle("d-none");
    document.getElementById("main-section").classList.toggle("d-none");
  }

  rjtcmnts() {
    document.getElementById("rjct-cmts").classList.toggle("d-none");
    document.getElementById("rjct-section").classList.toggle("d-none");
  }

  // deletememo(MailId: number) {
  //         //(<HTMLInputElement>document.getElementById("mailid_" + MailId)).style.display = "none";
  //         // var ud = this.currentUserValue.createdby;
  //         // db.collection('NewMemosList_' + ud).doc(MailId.toString()).update({
  //         //   IsDeleted: true
  //         // })
  //         if (this._IsDeleted == true) {
  //           this.inboxService.deleteMemo(MailId.toString(), this.currentUserValue.createdby).subscribe(
  //             data => {
  //               this._obj = data as InboxDTO;
  //               if (data["Message"] == "1") {
  //               }

  //             }
  //             )
  //           Swal.fire({
  //             title: "Are you sure?",
  //             text: "Do you want to proceed with Restored this memo",
  //             showCancelButton: true,
  //             confirmButtonColor: "#3085d6",
  //             cancelButtonColor: "#d33",
  //             confirmButtonText: "Yes, Restored it!"
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this._IsDeleted = false;
  //               // this._snackBar.open('Restored Successfully', 'End now', {
  //               //   duration: 5000,
  //               //   horizontalPosition: "right",
  //               //   verticalPosition: "bottom",
  //               // });
  //             }
  //           });
  //         }
  //         else if (this._IsDeleted == false) {
  //           this.inboxService.deleteMemo(MailId.toString(), this.currentUserValue.createdby).subscribe(
  //             data => {
  //               this._obj = data as InboxDTO;
  //               if (data["Message"] == "1") {
  //               }

  //             }
  //             )
  //           Swal.fire({
  //             title: "Are you sure?",
  //             text: "Do you want to proceed with deleting this memo",
  //             showCancelButton: true,
  //             confirmButtonColor: "#3085d6",
  //             cancelButtonColor: "#d33",
  //             confirmButtonText: "Yes, delete it!"
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this._IsDeleted = true;
  //             }
  //           });
  //           // this._snackBar.open('Deleted Successfully', 'End now', {
  //           //   duration: 5000,
  //           //   horizontalPosition: "right",
  //           //   verticalPosition: "bottom",
  //           // });
  //         }


  // }

  // deletememo(MailId: number) {
  //   const lang: any = localStorage.getItem('language');
  //   // Check if memo is already deleted
  //   if (this._IsDeleted == true) {
  //     Swal.fire({
  //       title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
  //       text: lang === 'ar' ? "هل تريد المتابعة في استعادة هذا المذكرة؟" : "Do you want to proceed with Restored this memo",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: lang === 'ar' ? "نعم، استعدها!" : "Yes, Restored it!"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // User confirmed restore action
  //         this._IsDeleted = false; // Assuming this is what you need to do
  //         // Call restoreMemo API
  //         this.restoreMemo(MailId);
  //       }
  //     });
  //   } else if (this._IsDeleted == false) { // Corrected condition
  //     // Memo is not deleted, confirm deletion
  //     Swal.fire({
  //       title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
  //       text: lang === 'ar' ? "هل تريد المتابعة في حذف هذه المذكرة؟" : "Do you want to proceed with deleting this memo",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: lang === 'ar' ? "نعم، احذفها!" : "Yes, delete it!"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // User confirmed delete action
  //         this._IsDeleted = true; // Assuming this is what you need to do
  //         // Call deleteMemo API
  //         this.deleteMemo1(MailId);
  //       }
  //     });
  //   }
  // }

  deletememo(MailId: number) {
    const lang: any = localStorage.getItem('language');
    // Check if memo is already deleted
    if (this._IsDeleted == true) {
      Swal.fire({
        title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
        text: lang === 'ar' ? "هل تريد المتابعة في استعادة هذا المذكرة؟" : "Do you want to proceed with Restored this memo",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: lang === 'ar' ? "نعم، استعدها!" : "Yes, Restored it!",
        cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel" // Set cancel button text based on language
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed restore action
          this._IsDeleted = false; // Assuming this is what you need to do
          // Call restoreMemo API
          this.restoreMemo(MailId);
        }
      });
    } else if (this._IsDeleted == false) { // Corrected condition
      // Memo is not deleted, confirm deletion
      Swal.fire({
        title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
        text: lang === 'ar' ? "هل تريد المتابعة في حذف هذه المذكرة؟" : "Do you want to proceed with deleting this memo",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: lang === 'ar' ? "نعم، احذفها!" : "Yes, delete it!",
        cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel" // Set cancel button text based on language
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed delete action
          this._IsDeleted = true; // Assuming this is what you need to do
          // Call deleteMemo API
          this.deleteMemo1(MailId);
        }
      });
    }
  }

  restoreMemo(MailId: number) {
    this.inboxService.restoreMemo(MailId.toString(), this.currentUserValue.createdby).subscribe({
      next: (data) => {
        // Handle the response as needed
      },
      error: (error) => {
        // Handle error if any
      }
    });
  }

  deleteMemo1(MailId: number) {
    this.inboxService.deleteMemo(MailId.toString(), this.currentUserValue.createdby).subscribe({
      next: (data) => {
        // Handle the response as needed
      },
      error: (error) => {
        // Handle error if any
      }
    });
  }

  Bookmark() {
    this.inboxService.BookmarkAPI(this._ReplyId, this.currentUserValue.createdby, this._MemoId).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (this._Bookmark == false) {
          setTimeout(() => {
            const targetElementId = `New_Div_${this._ReplyId}`;
            const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            } else {
            }
          }, 3000);
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('المرجعية بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Bookmark Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }

        }
        else if (this._Bookmark == true) {
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('إشارة مرجعية دون جدوى', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Unsuccessfully Bookmark', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }

          this.ReplyDetailsV2(this._ReplyId);
        }
        this._Bookmark = this._Bookmark == true ? false : true;
        //_ReplyFilteredDataList
        this._ReplyFilteredDataList.forEach(element => {
          //element.ReplyDataList
          const itemToUpdate = element.ReplyDataList.find(item => item.ReplyId === this._ReplyId);

          // Update the value property if the item is found
          if (itemToUpdate) {
            itemToUpdate.IsBookmark = this._Bookmark;
          }
        });
      }
    )
  }

  resetForm(form?: NgForm) {
    // if (form != null)
    //   form.resetForm();
    this.newmemoService._AddUserObj = {
      MailId: null,
      ReplyId: null,
      CreatedBy: this.currentUserValue.createdby,
      ToUserxml: '',
      CCUserxml: '',
      CCUserAry: '',
      ToUserAry: '',
      // selectedUserIdsString: "",
      message: '',
      Type: false,
      IsToUsers: true,
      ReplyIds: '',
      OrganizationId: this.currentUserValue.organizationid
    }

    // this.memoreplyService._ReplyMemoobj = {
    //   UserReplied: null,
    //   MailId: null,
    //   FromUserId: null,
    //   Reply: false,
    //   DeadLineDate: null,
    //   Attachment: false,
    //   DocumentId: null,
    //   Description: '',
    //   ApprovalPending_F: false,
    //   IsActive: false, //always false
    //   ParentId: null,
    //   ToUserxml: '',
    //   CCUserxml: '',
    //   Deadline_sort: null,
    //   message: '',
    //   Title: '',
    //   selectedToUser: [],
    //   selectedCCUser: []
    // }
  }

  NewFeatures() {
    this.startTour(this.TourName);
  }

  ClearFilters(_val, _val1) {
    $('.drop-ul button.active1').removeClass('active1');
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    this.Pg_ReplyFilter_AllMain = true;
    this.Pg_ReplyFilter_Unread = false;
    this.Pg_ReplyFilter_Approval = false;
    this.Pg_ReplyFilter_ReplyRrquired = false;
    this.Pg_ReplyFilter_ByMe = false;
    this.Pg_ReplyFilter_Attachment = false;
    this.ReplyFilter_ByMeWithActions = false;
    this.Usericon = false;
    (<HTMLInputElement>document.getElementById("btn5")).classList.add("active1");
    $('.drop-ul button.active1').removeClass('active1');
    // (<HTMLInputElement>document.getElementById("reply_users_drp")).style.display = "none";
    (<HTMLInputElement>document.getElementById("btn" + _val1)).classList.add("active1");
    this.Pg_ReplyFilter_Date = true;
    this.Pg_ReplyFilter_Subject = false;
    this.Pg_ReplyFilter_From = false;
    this.ReplyFilter_Bookmarks = false;

    this.Usericon = false;
    (<HTMLInputElement>document.getElementById("btn1")).classList.add("active1");
    // this.MemoDetails(this._MemoId);
    this.ReplyListMemoDetailsV2(this._MemoId);
    this.txtSearch = "";
    $('.filter-dot').addClass('filter-no-dot');
  }

  async Reload(_val, _val1) {
    this._ReplyId = this.route.snapshot.params['replyid']
    $('.drop-ul button.active1').removeClass('active1');
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    this.Pg_ReplyFilter_AllMain = true;
    this.Pg_ReplyFilter_Unread = false;
    this.Pg_ReplyFilter_Approval = false;
    this.Pg_ReplyFilter_ReplyRrquired = false;
    this.Pg_ReplyFilter_ByMe = false;
    this.Pg_ReplyFilter_Attachment = false;
    this.ReplyFilter_ByMeWithActions = false;
    this.Reply_sort_exists = false;
    this.Usericon = false;
    (<HTMLInputElement>document.getElementById("btn5")).classList.add("active1");
    $('.drop-ul button.active1').removeClass('active1');
    // (<HTMLInputElement>document.getElementById("reply_users_drp")).style.display = "none";
    (<HTMLInputElement>document.getElementById("btn" + _val1)).classList.add("active1");
    this.Pg_ReplyFilter_Date = true;
    this.Pg_ReplyFilter_Subject = false;
    this.Pg_ReplyFilter_From = false;
    this.ReplyFilter_Bookmarks = false;
    this.Usericon = false;
    (<HTMLInputElement>document.getElementById("btn1")).classList.add("active1");
    // this.MemoDetails(this._MemoId);
    this.txtSearch = "";
    $('.filter-dot').addClass('filter-no-dot');
    this._ReplyFilteredDataList = [];
    await this.ReplyListMemoDetailsV2(this._MemoId);
  }


  async ReplyFilters(_val: number) {
    $('.drop-ul button.active1').removeClass('active1');
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    this.Pg_ReplyFilter_AllMain = false;
    this.Pg_ReplyFilter_Unread = false;
    this.Pg_ReplyFilter_Approval = false;
    this.Pg_ReplyFilter_ReplyRrquired = false;
    this.Pg_ReplyFilter_ByMe = false;
    this.Pg_ReplyFilter_Attachment = false;
    this.ReplyFilter_ByMeWithActions = false;
    this.ReplyFilter_Bookmarks = false;
    this.Reply_sort_exists = true;
    if (_val == 1) {
      this.Pg_ReplyFilter_AllMain = true;
      this.Usericon = false;
      if (this.Pg_ReplyFilter_Date == true) {
        $('.filter-dot').addClass('filter-no-dot');
        this.Reply_sort_exists = false;
      }
      else {
        this.Reply_sort_exists = true;
      }
    }
    else if (_val == 2) {
      this.Pg_ReplyFilter_Unread = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 3) {
      this.Pg_ReplyFilter_Approval = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 4) {
      this.Pg_ReplyFilter_ReplyRrquired = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 8) {
      this.Pg_ReplyFilter_ByMe = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 9) {
      this.Pg_ReplyFilter_Attachment = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 10) {
      this.ReplyFilter_ByMeWithActions = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 11) {
      this.ReplyFilter_Bookmarks = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    if (this.Pg_ReplyFilter_Date == true) {
      (<HTMLInputElement>document.getElementById("btn5")).classList.add("active1");
      this.Reply_sort_exists = true;
    }
    if (this.Pg_ReplyFilter_Subject == true) {
      (<HTMLInputElement>document.getElementById("btn6")).classList.add("active1");
      this.Reply_sort_exists = true;
    }
    if (this.Pg_ReplyFilter_From == true) {
      (<HTMLInputElement>document.getElementById("btn7")).classList.add("active1");
      this.Reply_sort_exists = true;
    }
    // await this.ReplyListMemoDetailsV2(this._MemoId);
    this._ReplyFilteredDataList = [];
    this.restartConnection();
  }


  async ReplySort(_val) {
    $('.drop-ul button.active1').removeClass('active1');
    this.Reply_sort_exists = true;
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    this.Pg_ReplyFilter_Date = false;
    this.Pg_ReplyFilter_Subject = false;
    this.Pg_ReplyFilter_From = false;
    if (_val == 5) {
      this.Pg_ReplyFilter_Date = true;
      this.Usericon = false;
      if (this.Pg_ReplyFilter_AllMain == true) {
        $('.filter-dot').addClass('filter-no-dot');
        this.Reply_sort_exists = false;
      }
    }
    else if (_val == 6) {
      this.Pg_ReplyFilter_Subject = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
    }
    else if (_val == 7) {
      this.Pg_ReplyFilter_From = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = true;
    }
    if (this.Pg_ReplyFilter_AllMain == true) {
      (<HTMLInputElement>document.getElementById("btn1")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_Unread == true) {
      (<HTMLInputElement>document.getElementById("btn2")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_Approval == true) {
      (<HTMLInputElement>document.getElementById("btn3")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_ReplyRrquired == true) {
      (<HTMLInputElement>document.getElementById("btn4")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_ByMe == true) {
      (<HTMLInputElement>document.getElementById("btn8")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_Attachment == true) {
      (<HTMLInputElement>document.getElementById("btn9")).classList.add("active1");
    }
    if (this.ReplyFilter_ByMeWithActions == true) {
      (<HTMLInputElement>document.getElementById("btn10")).classList.add("active1");
    }
    if (this.ReplyFilter_Bookmarks == true) {
      (<HTMLInputElement>document.getElementById("btn11")).classList.add("active1");
    }
    // await this.ReplyListMemoDetailsV2(this._MemoId);
    this._ReplyFilteredDataList = [];
    this.restartConnection();
  }
  // _CheckDetailsDataExists: boolean = true;
  async ShowandHideHistory(IsHistory) {
    this._IsHistory = IsHistory;
    this.isHistoryVisible = this._IsHistory == 1 ? true : false;

    if (!this.isHistoryVisible) {
      const hasReplyIdInHistory = this._ReplyFilteredDataList.some(element =>
        element.ReplyDataList.find(reply =>
          reply.IsHistory == "1" && reply.ReplyId == this._ReplyId
        )
      );
      // If hasReplyIdInHistory is true, it means we found a matching record
      if (hasReplyIdInHistory) {
        let latestReplyId = null;
        this._ReplyFilteredDataList.forEach(element => {
          const filteredReplies = element.ReplyDataList.filter(rep => rep.IsHistory == 0);
          if (filteredReplies.length > 0) {
            // Assuming the last reply in the filtered list is the "latest"
            const lastReply = filteredReplies[0];
            latestReplyId = lastReply.ReplyId;
            this._ReplyId = latestReplyId;
            this.ReplyDetailsV2(this._ReplyId);
          }
        });
      }
    }
  }
  _ReplyDataListlength: number = 0;
  getReplyDataListCount(rfd: any, isChecked: boolean): number {
    if (isChecked) {
      this._ReplyDataListlength = rfd.ReplyDataList.length;
    } else {
      this._ReplyDataListlength = rfd.ReplyDataList.filter((reply: any) => reply.IsHistory == 0 || reply.IsCustomAttachment == 1).length;
    }
    return this._ReplyDataListlength;
  }
  onToggle() {
    this.isChecked = !this.isChecked; // Toggle the boolean value
    this._IsHistory = this.isChecked == true ? 1 : 0;
    this.isHistoryVisible = this.isChecked;
    
    if (!this.isHistoryVisible) {
      const hasReplyIdInHistory = this._ReplyFilteredDataList.some(element =>
        element.ReplyDataList.find(reply =>
          reply.IsHistory == "1" && reply.ReplyId == this._ReplyId
        )
      );

      // If hasReplyIdInHistory is true, it means we found a matching record
      if (hasReplyIdInHistory) {
        let latestReplyId = null;

        // Use for...of loop for easier readability and break capability
        for (const element of this._ReplyFilteredDataList) {
          const filteredReplies = element.ReplyDataList.filter(rep => rep.IsHistory == 0 || rep.IsCustomAttachment == 1);

          if (filteredReplies.length > 0) {
            // Assuming the last reply in the filtered list is the "latest"
            const lastReply = filteredReplies[0];
            latestReplyId = lastReply.ReplyId;
            this._ReplyId = latestReplyId;
            this.ReplyDetailsV2(this._ReplyId);
            break; // Exit the loop once the condition is met
          }
        }
      }


      // if (hasReplyIdInHistory) {
      //   let latestReplyId = null;
      //   this._ReplyFilteredDataList.forEach(element => {
      //     const filteredReplies = element.ReplyDataList.filter(rep => rep.IsHistory == 0 || rep.IsCustomAttachment == 1);
      //     if (filteredReplies.length > 0) {
      //       // Assuming the last reply in the filtered list is the "latest"
      //       const lastReply = filteredReplies[0];
      //       latestReplyId = lastReply.ReplyId;
      //       this._ReplyId = latestReplyId;
      //       this.ReplyDetailsV2(this._ReplyId);
      //       return false;
      //     }
      //   });
      // }
    }
  }

  async ReplyHistoryV2(ReplyId: number, val: boolean, _pagenumber: number) {
    this._obj.ReplyId = ReplyId;
    this._obj.MailId = this._MemoId;
    this._obj.lastCreatedDate = null;
    if (this._ReplyParentDetailsJson.length > 0 && _pagenumber == 1) {
      // Sort the array in ascending order based on someProperty
      const sortedArray = this._ReplyParentDetailsJson.slice().sort((a, b) => new Date(a.CreatedDateTime).getTime() - new Date(b.CreatedDateTime).getTime());
      // Get the top 1 item (the first item after sorting)
      // const topItem
      this._obj.lastCreatedDate = sortedArray[0].CreatedDateTime;
      // this._obj.lastCreatedDate = _pagenumber == 0 ? null : topItem;
    }
    this._obj.pageNumber = _pagenumber + 1;
    this._obj.pageSize = 1;
    if (val) {
      this._obj.pageNumber = 1; // Increment page number for "View More" action
      this.ViewMorethreadshide = true;
      this._obj.pageSize = 1000;
    }
    (await this.inboxService.ReplyHistoryV2(this._obj))
      .subscribe(data => {
        // alert(data['Data']["ReplyHistoryJson"].length);
        this._ReplyParentDetailsJson = [...this._ReplyParentDetailsJson, ...data['Data']["ReplyHistoryJson"]];
        if (data['Data']["ReplyHistoryJson"].length == 0) {
          this.ViewMorethreadshide = true;
        }
        // console.log(this._ReplyParentDetailsJson, "ReplyHistoryV2");
        // this._ParentDisplayName = this._ReplyParentDetailsJson[0].ParentDisplayName;
        // this._Twoletter = this._ParentDisplayName.split(' ').map(word => word.charAt(0)).join('');

        // Check if _ReplyParentDetailsJson has at least one element
        if (this._ReplyParentDetailsJson.length > 0) {
          this._ParentDisplayName = this._ReplyParentDetailsJson[0].ParentDisplayName;
          this._Twoletter = this._ParentDisplayName.split(' ').map(word => word.charAt(0)).join('');
        }

      });
  }



  ReplyHistory(ReplyId: number, val: boolean) {
    // this._obj.ReplyId = ReplyId;
    this._obj.ReplyId = this._ReplyId;
    this._obj.MailId = this._MemoId;
    this._obj.ViewAll = val;
    this.inboxService.ReplyHistoryService(this._obj)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        this._ReplyHistoryArray = data["Data"];
        this._ReplyHistoryArray = this._ReplyHistoryArray["ReplyParentJson"];
        this._ReplyHistoryArray.forEach(element => {
          this._ReplyParentDetailsJson.push(element);
        });

        if (val == true) {
          this.ViewMorethreadshide = true;
        } else if (val == false) {
          this.ViewMorethreadshide = false;
        }
      })
  }

  Replyfilteruserchangeevent(DisplayName) {
    this.txtSearch = DisplayName;
    this.selectedUserDisplayName = DisplayName;
  }

  md = {
    ReplyId: 1,
    Status: 'N',
    ReplyStatus: 'Approval Pending',
  };


  addCustomUplpadDTO(CategoryName: string, CategoryId: number, isChecked: boolean) {
    const newUser: ICustomUpload = { CategoryName, CategoryId, isChecked };
    this.ICustomUpload.push(newUser);
    // alert(this.ICustomUpload.length)
  }

  ClickMainMemo() {
    setTimeout(() => {
      const targetElementId = `New_Div_${this._MemoDetailsJson[0].FirstReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    // this.MemoDetails(this._MemoId);
    this.ReplyDetailsV2(this._MemoDetailsJson[0].FirstReplyId);
  }

  // Raloadmemodetails(_val: number, _val1: number) {
  //   $('.drop-ul button.active1').removeClass('active1');
  //   // (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
  //   this.Pg_ReplyFilter_AllMain = true;
  //   this.Pg_ReplyFilter_Unread = false;
  //   this.Pg_ReplyFilter_Approval = false;
  //   this.Pg_ReplyFilter_ReplyRrquired = false;
  //   this.Pg_ReplyFilter_ByMe = false;
  //   this.Pg_ReplyFilter_Attachment = false;
  //   this.ReplyFilter_ByMeWithActions = false;


  //   this.Usericon = false;
  //   (<HTMLInputElement>document.getElementById("btn5")).classList.add("active1");
  //   // $('.drop-ul button.active1').removeClass('active1');
  //   // (<HTMLInputElement>document.getElementById("reply_users_drp")).style.display = "none";
  //   // (<HTMLInputElement>document.getElementById("btn" + _val1)).classList.add("active1");
  //   this.Pg_ReplyFilter_Date = true;
  //   this.Pg_ReplyFilter_Subject = false;
  //   this.Pg_ReplyFilter_From = false;
  //   this.ReplyFilter_Bookmarks = false;

  //   this.Usericon = false;
  //   (<HTMLInputElement>document.getElementById("btn1")).classList.add("active1");
  //   this.MemoDetails(this._MemoId);
  // }

  Rebinddata() {
    this.Usersearch = "";
    this.MemoDetails(this._MemoId);
  }


  OpenEPProject(Project_Code) {
    const Url = "https://cswebapps.com/creativeplanner/Details/" + Project_Code;
    window.open(Url);
  }

  GetSelectedSubject(Value) {
    this.SelectedSubject = Value;
  }


  SubjectMerges(event) {
    if (event.target.checked) {
      this._ReplyFilteredDataList.forEach(element => {
        if (element.Value == event.target.value) {
          this.selectedmerge.push(element.Value)
        }
      });
    } else {
      const index = this.selectedmerge.indexOf(event.target.value);
      if (index !== -1) {
        this.selectedmerge.splice(index, 1);
      }
    }
  }

  SubjectMerge() {
    this._obj.MergeSubject = this.RightSubjectSelected.toString();
    this._obj.MailId = this._MemoId;
    this._obj.PreviousSubject = this.LeftSubjectSelected.toString();
    this._ReplyFilteredDataList.forEach(element => {
      element.ReplyDataList.forEach(_rep => {

        if (_rep.IsHistory == 0 && (_rep.Title == this.LeftSubjectSelected)) {
          this.ReplyIds.push(_rep.ReplyId)
        }
      });
    });
    this._obj.ReplyIds = this.ReplyIds.toString();
    this.inboxService.MergeService(this._obj).subscribe(data => {
      this._obj = data as InboxDTO;
      const language = localStorage.getItem('language');

      // Display message based on language preference
      if (language === 'ar') {
        this._snackBar.open('تم دمج الموضوع بنجاح', 'تنتهي الآن', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      } else {
        this._snackBar.open('Merge Subject Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      }

      (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
      // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
      document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      this.MemoDetails(this._MemoId);
    });
    this.LeftSubjectSelected = null;
    this.RightSubjectSelected = null;
  }

  async SubjectListForMerge() {
    try {
      const data = await this.inboxService.SubjectList(this._MemoId).toPromise();

      //this._obj = data as InboxDTO;
      this._AllSubjectList = data["Data"];
      this._AllSubjectList = this._AllSubjectList["SubjectJson"]
      this._SubjectLeftList = this._AllSubjectList.filter(
        element => element.Subject !== this.Dropdowntopsubject
      );
      this._SubjectRightList = data["Data"];
      this._SubjectRightList = this._SubjectRightList["SubjectJson"];
    } catch (error) {
    }
  }


  SubjectSelectLeftInMerge(event) {
    this._SubjectLeftList.forEach(element => {
      if (element.Subject == event) {
        this.LeftDropdownCount = (element.TotalCount)
      }
    });
    this.LeftSubjectSelected = event;
    this._SubjectRightList = this._AllSubjectList.filter(function (item) {
      return item.Subject != event;
    });
  }

  SubjectSelectRightInMerge(event) {
    this._SubjectLeftList = this._AllSubjectList.filter(function (item) {
      return item.Subject != event;
    });
  }

  CancelMerge() {
    this.RightSubjectSelected = null;
    this.LeftSubjectSelected = null;
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  Clearfields() {
    $('.check').prop('checked', false);
    this.selectedmerge = [];
  }

  ClickAttachmentBindReply(replyid: number) {
    this._ReplyId = replyid;

    (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    setTimeout(() => {
      const targetElementId = `New_Div_${this._ReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    // this._CurrectionSelectionIsHIstory = isReply == true ? false : true;
    this.ReplyDetailsV2(this._ReplyId);
  }

  RemoveForwardSelectedFile(MailDocId: number) {
    this._ForwardMemoDocuments = this._ForwardMemoDocuments.filter(x => x.MailDocId != MailDocId);
  }

  prependText(text: string) {
    this.htmlContent = text + '\n\n';
  }

  // appendText(signature: string, displayName: string, designationName: string) {
  //   let signatureImageHtml = '';

  //   // Check if the signature is not 'NA'
  //   if (signature && signature !== 'NA') {
  //     signatureImageHtml = `<div class="col-md-12">
  //         <img style="max-height: 100px;max-width: 150px;" id="imgSignature_subMemo" src="https://yrglobaldocuments.blob.core.windows.net/documents/${signature}">
  //       </div>`;
  //   }

  //   // Use a ternary operator to handle the 'N/A' designation case
  //   const designation = designationName && designationName !== 'N/A' ? designationName : 'Admin';

  //   // Append the conditional HTML
  //   this.htmlContent += `<div class="form-group mb-0 pb-2">
  //     <label style="text-align: left;font-size: 13px;font-style: italic;font-family: inherit;" class="col-md-12 control-label">Best Regards,</label><br>
  //     ${signatureImageHtml}
  //     <label style="text-align: left;font-size: 15px;font-style: italic;font-family: inherit;" class="col-md-12 control-label">
  //       <label id="lblFromUserBottom_subMemo">  
  //         ${displayName},(${designation})
  //       </label>
  //     </label>
  //   </div>`;
  // }



  ReplyInfoClick(replyid) {
    this.ReplyDetailsV2(replyid);
    setTimeout(() => {
      const targetElementId = `New_Div_${replyid}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 2000);
  }


  textchangefun(Project_Code) {

    var value = (<HTMLInputElement>document.getElementById("hdnProjectDetailsDiv_" + Project_Code)).value;
    if (value == "0") {
      $('#view_' + Project_Code).html('hide');
      $('#icondown_' + Project_Code).addClass('d-none');
      $('#iconup_' + Project_Code).removeClass('d-none');
      (<HTMLInputElement>document.getElementById("hdnProjectDetailsDiv_" + Project_Code)).value = "1";
      //detailsview_
      $('#detailsview_' + Project_Code).addClass('show');
      //$('.projectdetailsdiv').addClass('d-none'); 
    }
    else {
      $('#view_' + Project_Code).html('view');
      $('#icondown_' + Project_Code).removeClass('d-none');
      $('#iconup_' + Project_Code).addClass('d-none');
      $('#detailsview_' + Project_Code).removeClass('show');
      (<HTMLInputElement>document.getElementById("hdnProjectDetailsDiv_" + Project_Code)).value = "0";
    }
  }

  gotoMemoDetailsV2(name, id, replyid) {
    // var url = document.baseURI + name;
    // var myurl = `${url}/${id}`;
    // window.location.href = myurl;

    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id);
    //var myWindow = window.open(myurl);
    myWindow.focus();
  }

  HistoryList(memoid: number) {
    (<HTMLInputElement>document.getElementById("kt_chat_panel1")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.memoreplyService.HistoryList(memoid)
      .subscribe(data => {

        // this._obj = data as InboxDTO;
        // this.AttachmentList = data["HistoryJson"];
        this.AttachmentList = data['Data'];
        this.AttachmentList = this.AttachmentList['HistoryJson'];

        this.AttachmentList.forEach(element => {
          element.AttachmentJson = JSON.parse(element.AttachmentJson);
        });
      });
  }

  GetMemoHistory(memoid: number) {
    this.memoreplyService.HistoryList(memoid)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        this.AttachmentList = JSON.parse(this._obj.HistoryJson);
      });
  }

  toggleSelectAll(event) {
    this._ReplyJsonBinding.forEach(item => {
      item.IsChecked = (event.target.checked == true ? 1 : 0);
      // Use Angular Renderer2 for manipulating the DOM
      const element = this.el.nativeElement.querySelector(`#div_reply_${item.ReplyId}`);

      if (event.target.checked) {
        // Use Renderer2 to add a CSS class
        this.renderer.addClass(element, 'Active');
      } else {
        // Use Renderer2 to remove a CSS class
        this.renderer.removeClass(element, 'Active');
      }
    });
    this.TotalSelectedReplies = this._ReplyJsonBinding.filter(x => x.IsChecked === 1).length;
  }

  // AddUsersReply(event) {
  //   if (event.target.value == "true") {
  //     this._ReplyJsonBinding = this._ReplyJson.filter(x => x.ReplyId == this._ReplyId);
  //   }
  //   else {
  //     this._ReplyJsonBinding = this._ReplyJson;
  //   }
  //   this._ReplyJsonBinding.filter(x => x.IsChecked === 1);
  //   this.TotalSelectedReplies = this._ReplyJsonBinding.filter(x => x.IsChecked === 1).length;
  // }

  replyCheck(event) {
    const recordToUpdate = this._ReplyJsonBinding.find(record => record.ReplyId == event.target.id);
    const element = this.el.nativeElement.querySelector(`#div_reply_${event.target.id}`);
    if (event.target.checked == true) {
      this.renderer.addClass(element, 'Active');
      if (recordToUpdate) {
        recordToUpdate.IsChecked = 1;
      }
    }
    else {
      this.renderer.removeClass(element, 'Active');
      if (recordToUpdate) {
        recordToUpdate.IsChecked = 0;
      }
    }

    if (this._ReplyJsonBinding.filter(x => x.IsChecked === 1).length == this._ReplyJson.length)
      this.selectallreply = true;
    else
      this.selectallreply = false;

    this.TotalSelectedReplies = this._ReplyJsonBinding.filter(x => x.IsChecked === 1).length;
  }

  ViewUsersDiv(memoid: number) {
    
    const lang: any = localStorage.getItem('language');
    this.ListofuserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.SelectUsersfromhere = lang === 'en' ? 'Select Users from here' : 'حدد المستخدمين من هنا'
    this.inboxService.UsersListForAdd(memoid).subscribe(
      res => {

        this._UsersList = res["Data"];
        this._UsersList = this._UsersList["UsersJson"];
        this._UserListSubList = this._UsersList;
        // this._ExistingUsersMemo = res["Data"];
        this._ExistingUsersMemo = res["Data"]["ExistingUserList"];
        console.log(this._ExistingUsersMemo, "List of User")
        this._ExistingUser = this._ExistingUsersMemo;
        this.MemoCreatedUserName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.DisplayName;
        this.MemoCreatedUserCompanyName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.CompanyName;
        this.MemoCreatedUserDesignationName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.DesignationName;
        this.MemoCreatedUserProfile = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.UserProfile;
        // this.DMSRequestJson = res["Data"];
        this.DMSRequestJson = res["Data"]["DMSRequestJson"];
        console.log(this.DMSRequestJson, "DMS Request");
        this._ReplyJson = res["Data"]["ReplyJson"];
        this._ReplyJsonBinding = this._ReplyJson;//(x => x.ReplyId == this._ReplyId);
        this.TotalSelectedReplies = this._ReplyJsonBinding.length;
        // alert( this.TotalSelectedReplies);
      });
      this.selectallreply = true;
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    $('.nav-link.active').removeClass('active');
    $('a[href="#list_of_users"]').addClass('active');
    $('#tab-pane active').removeClass('active');
    $('#list_of_users').addClass('active');
  }
  Addremoveuser(userid: number, _value: boolean) {
    this.inboxService.RemoveMemoUser(this._MemoId, userid, this.currentUserValue.createdby, _value).subscribe(
      data => {
        // this._obj = data as InboxDTO;
        if (data["Data"].message == "1") {
          let _msg;
          const language = localStorage.getItem('language');
          if (_value) {
            if (language === 'ar') {
              _msg = "تم إزالة المستخدم بنجاح"
            } else {
              _msg = "User removed successfully";
            }
          }
          else {
            if (language === 'ar') {
              _msg = "تم إزالة المستخدم بنجاح"
            } else {
              _msg = "User restored successfully";
            }
          }
          //   if (_value) {
          //     _msg = {
          //         en: "User removed successfully",
          //         ar: "تم إزالة المستخدم بنجاح"
          //     };
          // } else {
          //     _msg = {
          //         en: "User restored successfully",
          //         ar: "تمت استعادة المستخدم بنجاح"
          //     };
          // }

          this._snackBar.open(_msg, 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          //window.close();
          this.ReplyListMemoDetailsV2(this._MemoId);
          // this.MemoDetails(this._MemoId);
          this.ViewUsersDiv(this._MemoId);
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
            data => {
              console.log(data, "New Memos Triggered")
            })
        }
      }
    )
  }

  ViewEPDiv(memoid: number) {
    var newValue = (<HTMLInputElement>document.getElementById("hdnEPId_" + memoid)).value;
    if (newValue == "0") {
      (<HTMLInputElement>document.getElementById("Kt_more_ExecutionPlanner")).classList.add("kt-quick-panel--on");
      (<HTMLInputElement>document.getElementById("hdnEPId_" + memoid)).value = "1";
      //this.BindProjectList(memoid);
      //this.ProjectDetails(this._ProjectCode);      
      document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    }
    else if (newValue == "1") {
      (<HTMLInputElement>document.getElementById("Kt_more_ExecutionPlanner")).classList.remove("kt-quick-panel--on");
      (<HTMLInputElement>document.getElementById("hdnEPId_" + memoid)).value = "0";
      document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    }
  }

  CloseEPPanel() {
    (<HTMLInputElement>document.getElementById("Kt_more_ExecutionPlanner")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnEPId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  CloseUserlistPanel() {
    $("#Selected_All").prop("checked", true);
    this.AddNewUserValues = [];
    this.SelectedUserIds = [];
    $('#add_users').removeClass('active');
    $('#users_reqs').removeClass('active');
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnUsersList_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

  }
  _ReplyAddUserList: any[];
  AddUsersInReply() {
    // this.inboxService.AddUsersInReply(memoid).subscribe(
    //   data => {
    //     this._ReplyAddUserList = data['Data']['']
    //   });
    // this._AllUsersToList
    this._disabledUsers = [];
    this._disabledUsers = [this._LoginUserId];
    this._UserListReplySubList = this._AllUsersToList;
    this._AllUsersToList.forEach(element => {
      if ((element.IsExist == 0 || element.UserActiveStatus == false) && element.UserGroup == 'Memo Users') {
        this._disabledUsers.push(element.CreatedBy);
      }
      else if (element.UserActiveStatus == false && element.UserGroup == 'New Users') {
        this._disabledUsers.push(element.CreatedBy);
      }
    });
    this._ToUserListDetails.forEach(element => {
      this._disabledUsers.push(element.CreatedBy);
    });
    this._CCUserListDetails.forEach(element => {
      this._disabledUsers.push(element.CreatedBy);
    });
    this.ReplyToUsers = true;
    this.UserComments = "";
    this.ReplyAddUsers = [];
    this.SelectReplyUserIds = [];
    (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }

  // ReplyAdduserclearfeilds(){

  //   (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.add("kt-quick-panel--on");
  //   document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
  //   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  // }

  AddUsersReply(isTo: boolean) {
    if (this.SelectReplyUserIds == undefined || this.SelectReplyUserIds == "") {
      this.AddUserReplyErrorLog = true;
      return false;
    }
    this.AddUserReplyErrorLog = false;
    this.ReplyToUsers = isTo;
    this._obj.ToUserxml = this.ReplyToUsers ? this.SelectReplyUserIds.toString() : '[]';
    this._obj.CCUserxml = this.ReplyToUsers ? '[]' : this.SelectReplyUserIds.toString();
    this._obj.MailId = this._MemoId;
    this._obj.message = this.UserComments;

    this.newmemoService.AddExtraUser(this._obj, this._ReplyId.toString()).subscribe(
      res => {
        const language = localStorage.getItem('language');

        // Display message based on language preference
        if (language === 'ar') {
          this._snackBar.open('تمت إضافة المستخدمين بنجاح', 'تنتهي الآن', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['blue-snackbar']
          });
        } else {
          this._snackBar.open('Users Added Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['blue-snackbar']
          });
        }

        this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger,"").subscribe(
          res => {
            console.log(res, "New Memos Triggered")
          });
        this.ReplyListMemoDetailsV2(this._MemoId);
        (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
        document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      }
    );

  }

  CloseUserReplys() {
    this.ReplyToUsers = true;
    this.UserComments = "";
    this.ReplyAddUsers = [];
    this.SelectReplyUserIds = [];
    (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  ViewMergeDiv() {
    this.RightSubjectSelected = this.Dropdowntopsubject;
    //  this._SubjectLeftList = 
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.SubjectListForMerge();
  }


  CloseReplyAll_div() {
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    this.ToErrorlog = false;
    // this.saveasdraft();
    if (this.htmlContent == "") {
      this._DraftColour = false;
    }
    else if (this.htmlContent != "") {
      this._DraftColour = true;
      this.saveasdraft();
    }
    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  _ReplyMemoobj = {
    selectedToUser: [],
    selectedCCUser: [],
  };

  excontent1() {
    // document.getElementById("excontent").style.display = "none";
    document.getElementById("contentdiv").style.display = "block";
  }

  AddUser(isTo: boolean) {
    if (this.SelectedUserIds == undefined || this.SelectedUserIds == "") {
      this.AddUserErrorLog = true;
      return false;
    }
    this.AddUserErrorLog = false;
    this.IsToUsers = isTo;
    this._obj.ToUserxml = this.IsToUsers ? this.SelectedUserIds.toString() : '[]';
    this._obj.CCUserxml = this.IsToUsers ? '[]' : this.SelectedUserIds.toString();
    this._obj.MailId = this._MemoId;
    this._obj.message = this.UserComments;
    const filteredReplyIds: number[] = this._ReplyJsonBinding.filter(x => x.IsChecked === 1).map(x => x.ReplyId);
    if (filteredReplyIds.length === 0) {
      alert("Please select reply to add user");
      return false;
    } else {
      this.newmemoService.AddExtraUser(this._obj, filteredReplyIds.toString()).subscribe(
        res => {
          debugger
          const language = localStorage.getItem('language');
          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تمت إضافة المستخدمين بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          } else {
            this._snackBar.open('Users Added Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          }

          this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger,"").subscribe(
            res => {
              console.log(res, "New Memos Triggered")
            });
          // if (this._ReplyId == 0) {
          //   // this.MemoDetails(this._MemoId);
          //   this.ReplyListMemoDetailsV2(this._MemoId);
          // }
          // else {
          //   // this.ReplyDetailsV2(this._ReplyId)
          //   this.ReplyListMemoDetailsV2(this._MemoId);
          // }
          this.ReplyListMemoDetailsV2(this._MemoId);
            // (<HTMLInputElement>document.getElementById("hdnMoreUsersId")).value = "0";
            // (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
            // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
            // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
            const hdnMoreUsersId = document.getElementById("hdnMoreUsersId") as HTMLInputElement;
            if (hdnMoreUsersId) {
              hdnMoreUsersId.value = "0";
            }
        
            const ktUserList = document.getElementById("kt_User_list");
            if (ktUserList) {
              ktUserList.classList.remove("kt-quick-panel--on");
            }
        
            const sideView = document.getElementsByClassName("side_view")[0];
            if (sideView) {
              sideView.classList.remove("position-fixed");
            }
        
            const asideMenuOverlay = document.getElementsByClassName("kt-aside-menu-overlay")[0];
            if (asideMenuOverlay) {
              asideMenuOverlay.classList.remove("d-block");
            }
           
          
     
          // this.MemoDetails(this._MemoId);
          this.Adduserclearfeilds();
         
        }
      )
      $("#Selected_All").prop("checked", true);
      // $('.nav-link.active').removeClass('active');
      // $('a[href="#list_of_users"]').addClass('active');
      // $('#tab-pane active').removeClass('active');
      // $('#list_of_users').addClass('active');
      $('#add_users').removeClass('active');
    }
  }

  Adduserclearfeilds() {
    $("#Selected_All").prop("checked", true);
    $('#add_users').removeClass('active');
    this.IsToUsers = true;
    this.Selected_And_All = true;
    this.UserComments = "";
    this.AddNewUserValues = [];
    this.SelectedUserIds = [];
    this.AddUsers = "";
    (<HTMLInputElement>document.getElementById("hdnMoreUsersId")).value = "0";
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  BindConersationList(MemoId: number, PageNo: number, PageSize: number) {
    this.memoreplyService.ConversationList(MemoId, PageSize, PageNo)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _conversationList = JSON.parse(this._obj.ConversationJson);
        this.ConversationJson = _conversationList;
        var _daysjson = JSON.parse(this._obj.daysJson);
        this.daysJson = _daysjson;
        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalConversationRecords = _totalRecords[0].TotalRecords;
        this.activePageConversation = PageNo;
        this.cd.detectChanges();
      })
  }

  get filterbyStatus() {
    if (this._ToUserMemo != undefined) {
      return this._ToUserMemo.filter(x => x.Status != 9);
    }
  }

  openDialog(UserId: number) {
    let dialogRef = this.dialog.open(DailogComponent, {
      maxWidth: '100%',
      data: { UserId: UserId, MailId: this._MemoId }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.MemoDetails(this._MemoId);
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  SubjectEdit(Subject, IsReply) {
    this._ReplyId = IsReply;
    setTimeout(() => {
      const targetElementId = `New_Div_${this._ReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    document.getElementById('fade1').style.display = 'block';
    document.getElementById('light1').style.display = 'block';
    (<HTMLInputElement>document.getElementById("txtSubject")).value = Subject;
  }

  updateSubject() {
    const updatedSubject = (<HTMLInputElement>document.getElementById("txtSubject")).value;
    // Check if the subject is within the character limit
    if (updatedSubject.length <= 250) {
      this.inboxService.UpdateSubject(this._MemoId, this._ReplyId, updatedSubject,this.currentUserValue.createdby).subscribe(
        data => {

          this._obj = data as InboxDTO;
          if (data["Data"].message == "1") {
            this.ReplyListMemoDetailsV2(this._MemoId);
            (<HTMLInputElement>document.getElementById("light1")).style.display = "none";
            (<HTMLInputElement>document.getElementById("fade1")).style.display = "none";
            const language = localStorage.getItem('language');

            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
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


            this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger,"").subscribe(
              data => {
                console.log(data, "New Memos Triggered")
              }
            )
          }
        }
      );
    } else {
      // Show an error message or handle the case where the subject exceeds the character limit
      (<HTMLInputElement>document.getElementById("light1")).style.display = "none";
      (<HTMLInputElement>document.getElementById("fade1")).style.display = "none";
      const language = localStorage.getItem('language');

      // Display message based on language preference
      if (language === 'ar') {
        this._snackBar.open('يجب أن يكون الموضوع 250 حرفًا أو أقل', 'يغلق', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      } else {
        this._snackBar.open('Subject must be 250 characters or less', 'Close', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      }

    }
  }

  UnReadMemo(_ReplyId: number) {
    this.inboxService.UnReadMemo(_ReplyId.toString(), false, this.currentUserValue.createdby).subscribe(
      data => {
        if (data["Message"] == "1") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
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

          window.close();
        }
      }
    )
  }

  ChangeFavoriteValue(val: boolean, _mailId: number) {

    if (val == true) {
      val = false;
    }
    else if (val == false) {
      val = true;
    }

    this.inboxService.FavStatus(_mailId, val, this.currentUserValue.createdby)
      .subscribe(data => {
        if (data["Message"] = "1") {
          // alert('Please try again')
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
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
        }
        else {
          this.FavoriteVal = val;
        }
        this.MemoDetails(this._MemoId);
      });
  }

  Pinicon(_mailId: number, val: boolean) {
    this.Pinval = !val; // Toggle the value
    this.inboxService.UpdateMemoPin(_mailId, this.Pinval, this.currentUserValue.createdby, this.currentUserValue.organizationid).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data["Message"] == "1") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
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
        }
      }
    )
  }

  UnReadMemoWithNext(MailId, name, id, replyid) {

    this.inboxService.UnReadMemo(MailId, false, this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (data["Message"] == "1") {
          var url = document.baseURI + name;
          // var myurl = `${url}/${id}`;
          var myurl = `${url}/${id}/${replyid}`;
          window.location.href = myurl;
        }
      }
    )
  }

  LoadDocument(url1: string, filename: string, MailDocId: number) {

    let name = "Memo/ArchiveView";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let url = encoder.encode(url1);

    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    filename = filename.replace(/#/g, "%23");
    filename = filename.replace(/&/g, "%26");


    var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + filename + "&type=1" + "&" + "MailDocId=" + MailDocId + "&" + "MailId=" + this._MemoId + "&" + "ReplyId=" + this._ReplyId + "&" + "LoginUserId=" + this._LoginUserId + "&" + "IsConfidential=" + this.IsConfidential + "&" + "AnnouncementDocId=" + 0;
    var myWindow = window.open(myurl, url.toString());
    myWindow.focus();

  }

  UpdateApprovalStatus(MailId: number, ApprovalStatus: string, ReplyId: number) {


    this._UpdatedReplyId = this._ReplyId;
    if (this.Approvecomments == "" && this.Rejectcomments == "") {
      this._obj.Comments = "";
    } else if (ApprovalStatus == 'Approved') {
      this._obj.Comments = this.Approvecomments;
    } else if (ApprovalStatus == 'Reject') {
      this._obj.Comments = this.Rejectcomments;
    }
    this.inboxService.UpdateApprovalStatus(this._MemoId, ApprovalStatus, this._ReplyId, this._obj)
      .subscribe(
        da => {
          this._obj = da as InboxDTO;
          if (da["Data"].message == "1") {
            this.ReplyListMemoDetailsV2(this._MemoId);
            const language = localStorage.getItem('language');

            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
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
            this.newmemoService.NewMemosTrigger(da["Data"].NewMemosTrigger,"").subscribe(
              data => {
                console.log(data, "New Memos Triggered")
              })
          }
          this.Approvecomments = "";
          this.Rejectcomments = "";
        })
  }
  MemoStatus(MailId: any, FromUserId: number, val, ReplyId: number) {
    if (val == 1) {
      this._obj.UserApprovalStatus = 'Approve';
    } else if (val == 2) {
      this._obj.UserApprovalStatus = 'Reject';
    }
    this.inboxService.RequestMemoStatus(FromUserId, MailId, this.currentUserValue.createdby, ReplyId, this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        this.CloseUserlistPanel();
        this.MemoDetails(this._MemoId);
      })
    $('#users_reqs').removeClass('active');
  }

  onNgModelChangeReplys(e) {
    if (e) {
      this._obj.Reply = false;
      this.ApprovalPending = false;
    }
  }

  onNgModelChangeApprovals(e) {
    if (e) {
      this._obj.ApprovalPending_F = false;
      this.ReplyRequired = false;
    }
  }

  onNgModelChangeConfidential(e) {
    if (e) {
      this._obj.IsConfidential = false;
      this._IsConfidential = false;
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        // var contentType = file.type;
        // if (contentType === "application/pdf") {
        //   contentType = ".pdf";
        // }
        // else if (contentType === "image/png") {
        //   contentType = ".png";
        // }
        // else if (contentType === "image/jpeg") {
        //   contentType = ".jpeg";
        // }
        // else if (contentType === "image/jpg") {
        //   contentType = ".jpg";
        // }
        // var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
        // if (!allowedExtensions.exec(contentType)) {
        //   alert('In valid format');
        //   //fileUpload
        //   (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
        // }
        // else {
        //   //this.myFiles.push(event.target.files[index]);
        // }
        this.myFiles.push(event.target.files[index].name);
        //_lstMultipleFiales
        var d = new Date().valueOf();

        this._lstMultipleFiales = [...this._lstMultipleFiales, {
          UniqueId: d,
          FileName: event.target.files[index].name,
          Size: event.target.files[index].size,
          Files: event.target.files[index]
        }];
      }
    }

  }

  RemoveSelectedFile(_id) {
    var removeIndex = this._lstMultipleFiales.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this._lstMultipleFiales.splice(removeIndex, 1);
  }


  BackToReply() {
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    this.showSendAnywayAndCancelButtons = true;
  }

  OnChat() {
    //txtChat
    let txt = (<HTMLInputElement>document.getElementById("txtChat")).value;
    if (txt == "") {
      alert('Message required.');
      return false;
    }
    var MailId = parseInt((<HTMLInputElement>document.getElementById("hdnMainId")).value);
    this.memoreplyService.Sendmessage(txt, MailId).subscribe(
      res => {
        this.BindConersationList(MailId, 1, 100);
        this.message = '';
      }
    )
  }


  CloseQuickPanel1() {

    (<HTMLInputElement>document.getElementById("kt_chat_panel1")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  CloseReplyPanel() {
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    this.saveasdraft();
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  Replycancal() {
    this.htmlContent = "";
    this.DeadlineDatecheck = false;
    this._ExpiryDate = null;
    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    // (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  ClosemergePanel() {
    this.RightSubjectSelected = "";
    this.LeftSubjectSelected = "";
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  CloseMoreUsersPanel() {
    // (<HTMLInputElement>document.getElementById("Kt_more_users_add")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnMoreUsersId")).value = "0";
  }

  ViewAttachmentsDiv(memoid: number) {
    // var newValue = (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + memoid)).value;
    // if (newValue == "0") {
    this._obj.UserId = this.UserId;
    this._obj.SortType = this.SortType;
    // alert(this.SortType)
    this.memoreplyService.AttachmentList(memoid, this._obj)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        // this.DocumentList = data["AttachmentJson"];
        // this.DocumentList = data["Data"];
        this.DocumentList = data["Data"]["AttachmentJson"];
        this.Attachementcount = 0;
        this.DocumentList.forEach(element => {
          this.Attachementcount = JSON.parse(element.JsonData).length + this.Attachementcount;
        });
      });

    (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.add("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + memoid)).value = "1";
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // }
    // else if (newValue == "1") {
    //   (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.remove("kt-quick-panel--on");
    //   (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + memoid)).value = "0";
    // }
   
  }

  RebindingData() {
    this.SearchTxt = "";
    this.ViewAttachmentsDiv(this._MemoId);
  }

  AttachmentsSort(_val) {
    if (_val == 1) {
      this.Date = true;
      this.Users = false;
      this.Subject = false;
      this.Byme = false;
      this.CustomAttachment = false;
      this.SortType = _val;
    }
    if (_val == 2) {
      this.Date = false;
      this.Users = false;
      this.Subject = true;
      this.Byme = false;
      this.CustomAttachment = false;
      this.SortType = _val;


    }
    if (_val == 3) {
      this.Date = false;
      this.Users = true;
      this.Subject = false;
      this.Byme = false;
      this.CustomAttachment = false;
      this.SortType = _val;
    }
    if (_val == 4) {
      this.Date = false;
      this.Users = false;
      this.Subject = false;
      this.Byme = true;
      this.CustomAttachment = false;
      this.SortType = _val;
    }
    if (_val == 5) {
      this.Date = false;
      this.Users = false;
      this.Subject = false;
      this.Byme = false;
      this.CustomAttachment = true;
      this.SortType = _val;
    }
    this.ViewAttachmentsDiv(this._MemoId);
  }

  CloseAttachmentsPanel() {
    this.selectedUsers = [];
    this.AttachmentsSort(1);
    this.attchmnts();
    (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  saveasdraft() {
    this._obj.Description = this.htmlContent;
    this._obj.TextContent = this.htmlContent.replace(/<[^>]+>/g, '');
    this._obj.MailId = this._MemoId;
    this._obj.ReplyId = this._ReplyId;
    this._obj.Subject = this.SelectedSubject;
    this._obj.DraftId = this._DraftId.toString();
    this.memoreplyService.SaveasDraft(this._obj).subscribe(
      data => {
        this._obj = data as InboxDTO;
        this._ExpiryDate = null;
        (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
        document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
        if (this._obj.TextContent == "") {
          this._DraftColour = false;
          $('#drafticondiv_' + this._ReplyId).addClass('d-none');
          $('#drafticondiv_' + this._ReplyId).removeClass('d-inline');
        }
        else if (this._obj.TextContent != "") {
          this._DraftColour = true;
          $('#drafticondiv_' + this._ReplyId).addClass('d-inline');
          $('#drafticondiv_' + this._ReplyId).removeClass('d-none');
        }
      }
    )
  }

  Deletedraft() {
    this._obj.DraftId = this._DraftId.toString();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with deletedraft this memo",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.memoreplyService.DeleteDraft(this._obj).subscribe(
          data => {
            this._DraftColour = false;
            $('#drafticondiv_' + this._ReplyId).addClass('d-none');
            $('#drafticondiv_' + this._ReplyId).removeClass('d-inline');
            (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
            document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
            document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          }
        )
      }
    });
  }

  closeInfo() {
    this.attchmnts();
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  onRightClick1(event: MouseEvent, item) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;

    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = { item: item }

    // we open the menu
    this.matMenuTrigger.openMenu();

  }

  Openlabels() {
    //this.attchmnts();
    $('#Kt_labels').addClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this._obj.MailId = this._MemoId;
    this._obj.UserId = this._LoginUserId;
    this.inboxService.LabelsData(this._obj)
      .subscribe(data => {
        this.SelectLabel = data["Data"];
        this.SelectLabel = this.SelectLabel["SelectedLabels"];
        this.LabelsJsondata = data["Data"];
        this.LabelsJsondata = this.LabelsJsondata["LabelList"];
      });
  }

  Closelabels() {
    // this.Labeltext = null;
    this.SelectedLabelIds = [];
    this.AddLabelList = [];
    this.LabelUserErrorLog = false;
    $('#Kt_labels').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  onFileChangeAtt(event) {
    this.myFilesAtt = [];
    this.AttachmentErrorlog = false;
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        var contentType = file.type;
        if (contentType === "application/pdf") {
          contentType = ".pdf";
        }
        else if (contentType === "image/png") {
          contentType = ".png";
        }
        else if (contentType === "image/jpeg") {
          contentType = ".jpeg";
        }
        else if (contentType === "image/jpg") {
          contentType = ".jpg";
        }
        this.myFilesAtt.push(event.target.files[index].name);
        // alert(this.myFilesAtt);
        var d = new Date().valueOf();
        this.AttachmentFileuplod = [...this.AttachmentFileuplod, {
          UniqueId: d,
          FileName: event.target.files[index].name,
          Size: event.target.files[index].size,
          Files: event.target.files[index]
        }];
      }
    }
  }


  RemoveSelectedFileDrp(_id) {
    var removeIndex = this.AttachmentFileuplod.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this.AttachmentFileuplod.splice(removeIndex, 1);
    (<HTMLInputElement>document.getElementById("fileUploadDU")).value = "";
    if (this.AttachmentFileuplod == null || this.AttachmentFileuplod == undefined) {
      this.AttachmentsErrorlog = false;
    } else {
      this.AttachmentsErrorlog = true;
    }

  }

  QuickUploads() {
    var MailId = parseInt((<HTMLInputElement>document.getElementById("hdnMainId")).value);
    if (!this.AttachmentFileuplod || this.AttachmentFileuplod.length === 0) {
      this.AttachmentErrorlog = true;
    }
    const frmData = new FormData();
    for (var i = 0; i < this.AttachmentFileuplod.length; i++) {
      frmData.append("files", this.AttachmentFileuplod[i].Files);
    }
    if (this.selectedCategory == undefined || this.selectedCategory == "") {
      this.CategoryErrorlog = true;
      return false;
    }
    this.CategoryErrorlog = false;

    this._objInb.CategoryName = this.selectedCategory;
    this._objInb.MailId = MailId;
    this._objInb.Comments = this._Comments;
    this._objInb.ToUsersString = this.selectedEmpIds.toString();
    $("body").addClass("progressattachment");
    this.memoreplyService.QuickUpload(this._objInb).subscribe(
      (res: any) => {
        // console.log(res, "QuickUploadData");
        this._obj = res as InboxDTO;

        frmData.append("MailId", MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "false");
        frmData.append("ReplyId", res["Data"].ReplyId);
        this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
          .catch(err => console.log('Error while connect with server'));
        this.newmemoService.UploadAttachmenst(frmData).subscribe(
          (event: HttpEvent<any>) => {
            const language = localStorage.getItem('language');
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.UploadProgress:
                this.progressbar = Math.round(event.loaded / event.total * 100);
                if (this.progressbar == 100) {
                  this.progressConnectionBuilder.on("ReceiveProgress", (progressbar) => {
                    this.progressbar = progressbar;
                    if (this.progressbar == 100) {
                      if (language === 'ar') {
                        this._snackBar.open('تم رفع الملفات..', 'تنتهي الآن', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      } else {
                        this._snackBar.open('Files Uploaded..', 'End now', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      }
                    }
                  });
                }
                break;
              case HttpEventType.Response:
                $("body").removeClass("progressattachment");
                if (language === 'ar') {
                  this._snackBar.open('تم التحميل السريع بنجاح', 'تنتهي الآن', {
                    duration: 5000,
                    horizontalPosition: "right",
                    verticalPosition: "bottom",
                  });
                } else {
                  this._snackBar.open('Quick Upload Successfully', 'End now', {
                    duration: 5000,
                    horizontalPosition: "right",
                    verticalPosition: "bottom",
                  });
                }

                this.Attachementcount = 0;
                this.ICustomUpload.forEach(element => {
                  element.isChecked = false;
                });
                this.ICustomUpload = [];

                this.ViewAttachmentsDiv(this._MemoId);
                this.attchmnts();
                // this.MemoDetails(MailId);
                this.ReplyListMemoDetailsV2(this._MemoId);
                setTimeout(() => {
                  this.progressbar = 0;
                }, 1500);
            }
          },
          (error: any) => {
            console.error('Error uploading attachments:', error);
            // Handle error as needed
          }
        );
      }

    );
  }

  attchmnts() {
    this.CategoryErrorlog = false;
    this.AttachmentErrorlog = false;
    this.Attachmentshide = true;
    this.selectedCategory = "";
    this.selectedEmpIds = [];
    this.myFilesAtt = [];
    this._Comments = "";
    this.AttachmentFileuplod = [];
    this.selectedUsers = [];
    this.ICustomUpload.forEach(element => {
      element.isChecked = false;
    });
    (<HTMLInputElement>document.getElementById("fileUploadDU")).value = "";
    (<HTMLInputElement>document.getElementById("fileuploadtextDUV")).innerHTML = "Choose file";
    $('#quik-upload').hide();
    $('#attach_main').show();
    $('#atchvw-btn').addClass('d-none');
    $('#quik-btn').show();
  }

  UserJSON() {
    // var Userjosns = JSON.stringify({MemoID: this._MemoId, UserId: this._LoginUserId});
    // alert(Userjosns);

    this._obj.MailId = this._MemoId;
    this._obj.ReplyId = this._ReplyId
    this._obj.FromUserId = this._LoginUserId;
    this.newmemoService.Requestuser(this._obj).subscribe(
      data => {
        // this._obj = data as InboxDTO;
        if (data['Message'] == "1") {
          this.Requestbutton = true;
          this.Aftersendmessage = true;
          const lang: any = localStorage.getItem('language');
          if (lang === 'en') {
            Swal.fire({
              title: 'Request Sent Successfully',
              showConfirmButton: true,
              confirmButtonText: 'OK'
            });
          } else if (lang === 'ar') {
            Swal.fire({
              title: 'تم إرسال الطلب بنجاح',
              showConfirmButton: true,
              confirmButtonText: 'حسناً'
            });
          }
        }
      })
  }

  ApprovalReply(ParentId: number) {
    if (ParentId != 0)
      this._ReplyId = ParentId;
    this.ReplyDetailsV2(this._ReplyId)
  }

  usercomment() {
    this.Aftersendmessage = true;
    this.Requestbutton = true;
  }

  clearusercomment() {
    this.Usercomment = "";
    this.Aftersendmessage = false;
    this.Requestbutton = false;
  }


  ViewReplyDiv_Updated(memoid: number, typeid: number) {
    // alert(typeid);
    this.showSendAnywayAndCancelButtons = true;
    const lang: any = localStorage.getItem('language');
    this.searchTOfromhere = lang === 'en' ? 'search TO from here' : 'ابحث عن من هنا';
    this.searchCCfromhere = lang === 'en' ? 'search CC from here' : 'ابحث عن CC من هنا'

    if (typeid == 1) {
      if (lang == 'en') {
        this.ReplyType = "Reply All";
      } else if (lang == 'ar') {
        this.ReplyType = "الرد على الجميع";
      }
      this.Replybutton = true;
      this._lstMultipleFiales = [];
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      this._IsConfidential = false;
      this.htmlContent = "";
    } else if (typeid == 2) {
      const lang: any = localStorage.getItem('language');

      if (lang == 'en') {
        this.ReplyType = "Reply";
      } else if (lang == 'ar') {
        this.ReplyType = "رد";
      }
      this.Replybutton = true;
      this._lstMultipleFiales = [];
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      this._IsConfidential = false;
      this.htmlContent = "";
    } else if (typeid == 3) {
      const lang: any = localStorage.getItem('language');
      if (lang == 'en') {
        this.ReplyType = "Forward";
      } else if (lang == 'ar') {
        this.ReplyType = "إلى الأمام";
      }
      this.Replybutton = false;
      this._lstMultipleFiales = [];
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      this._IsConfidential = false;
      this.htmlContent = "";
    }
    else if (typeid == 4) {
      const lang: any = localStorage.getItem('language');
      if (lang == 'en') {
        this.ReplyType = "Edit Reply";
      } else if (lang == 'ar') {
        this.ReplyType = "تحرير الرد";
      }
      this._lstMultipleFiales = [];
      this.Replybutton = false;
      this.cd.detectChanges();
    }
    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    (<HTMLInputElement>document.getElementById("UpdatefileUpload")).value = "";
    this.excontent1();
    this.ReplyDetailsV2(this._ReplyId);

  }


  remove(employee: any): void {
    //_AllUsersToList
    const index = this.selectedToEmployees.findIndex((emp) => emp.CreatedBy === employee.CreatedBy);
    this.isSelection = false;
    if (index !== -1) {
      // Remove the employee from the selectedEmployees array
      this.selectedToEmployees.splice(index, 1);
      this.selectedToEmpIds.splice(index, 1);
    }
    // Optionally, you can uncheck the checkbox in the Project_List array
    employee.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value != this._LoginUserId) {
      const selectedToEmployee = this._AllUsersToList.find((fruit) => fruit.CreatedBy === event.option.value);
      this._keeppanelopen();
      if (selectedToEmployee) {
        const index = this.selectedToEmployees.findIndex((emp) => emp.CreatedBy === selectedToEmployee.CreatedBy);
        if (index === -1) {
          // Employee not found in the selected array, add it
          this.selectedToEmployees.push(selectedToEmployee);
          this.selectedToEmpIds.push(selectedToEmployee.CreatedBy);
        } else {
          // Employee found in the selected array, remove it
          this.selectedToEmployees.splice(index, 1);
          this.selectedToEmpIds.splice(index, 1);
        }
      }
      (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).value = "";
      this._AllUsersToList = this._AllUsersList;

      // console.log(this.selectedToEmpIds, "this.selectedToEmployees from selected event");
      //this.removeArrayById(event.option.value);
      const index = this.selectedCCEmployees.findIndex((emp) => emp.CreatedBy === event.option.value);
      if (index !== -1) {
        this.selectedCCEmployees.splice(index, 1);
        this.selectedCCEmpIds.splice(index, 1);
      }

      //selectedCCEmployees
    }
    else {
      alert("cannot add login user");
    }
    this.ToErrorlog = false;
    $('.error-msg-pop-x-forward').addClass('d-none');

  }



  CCUsersselected(event: MatAutocompleteSelectedEvent): void {

    if (event.option.value != this._LoginUserId) {
      const selectedCCEmployee = this._AllUsersCCList.find((fruit) => fruit.CreatedBy === event.option.value);
      //this._keeppanelopen();
      if (selectedCCEmployee) {
        const index = this.selectedCCEmployees.findIndex((emp) => emp.CreatedBy === selectedCCEmployee.CreatedBy);
        if (index === -1) {
          // Employee not found in the selected array, add it
          this.selectedCCEmployees.push(selectedCCEmployee);
          this.selectedCCEmpIds.push(selectedCCEmployee.CreatedBy);
        } else {
          // Employee found in the selected array, remove it
          this.selectedCCEmployees.splice(index, 1);
          this.selectedCCEmpIds.splice(index, 1);
        }
      }
      (<HTMLInputElement>document.getElementById("txtsearchCCEmpployees")).value = "";
      this._AllUsersCCList = this._AllUsersList;
      // console.log(this.selectedCCEmployees, "this.selectedCCEmployees from selected event");
      const index = this.selectedToEmployees.findIndex((emp) => emp.CreatedBy === event.option.value);
      this.isSelection = false;
      if (index !== -1) {
        // Remove the employee from the selectedEmployees array
        this.selectedToEmployees.splice(index, 1);
        this.selectedToEmpIds.splice(index, 1);
      }
      // console.log(this.selectedCCEmpIds, "ccusers");
    }
    else {
      alert("cannot add login user");
    }
  }

  isSelected(employee: any): boolean {
    return this.selectedToEmployees.some((emp) => emp.CreatedBy === employee.CreatedBy);
  }

  filterEmployees(input: string): void {
    this.isSelection = true;
    this._AllUsersToList = this._AllUsersList.filter((employee) =>
      employee.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  _keeppanelopen() {
    this._AllUsersToList = this._AllUsersList;
    this.isSelection = true;
    this.isSelectionCC = false;
    // requestAnimationFrame(() => this.customTrigger.openPanel()); // open the panel
    this.autoCompleteTrigger1.openPanel();
    (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).focus();
    this.customTriggerCC.closePanel();
  }

  closePanel() {
    this.isSelection = false;
    (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }

  filterUsersInCC(input: string): void {
    this.isSelectionCC = true;
    this._AllUsersCCList = this._AllUsersList.filter((employee) =>
      employee.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  isSelectedCCUsers(employee: any): boolean {
    return this.selectedCCEmployees.some((emp) => emp.CreatedBy === employee.CreatedBy);
  }

  CCUserremove(employee: any): void {
    const index = this.selectedCCEmployees.findIndex((emp) => emp.CreatedBy === employee.CreatedBy);
    this.isSelectionCC = false;
    if (index !== -1) {
      // Remove the employee from the selectedEmployees array
      this.selectedCCEmployees.splice(index, 1);
      this.selectedCCEmpIds.splice(index, 1);
    }
    // Optionally, you can uncheck the checkbox in the Project_List array
    employee.checked = false;
    requestAnimationFrame(() => this.autoCompleteTriggerCC.closePanel()); // close the panel
  }

  closePanelCC() {
    this.isSelectionCC = false;
    (<HTMLInputElement>document.getElementById("txtsearchCCEmpployees")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchCCEmpployees")).blur();
    requestAnimationFrame(() => this.autoCompleteTriggerCC.closePanel()); // close 
  }

  _keeppanelopenCC() {
    this._AllUsersCCList = this._AllUsersList;
    this.isSelectionCC = true;
    this.isSelection = false;
    // requestAnimationFrame(() => this.customTriggerCC.openPanel()); // open the panel
    this.autoCompleteTrigger2.openPanel();
    (<HTMLInputElement>document.getElementById("txtsearchCCEmpployees")).focus()
  }

  ccshowmore() {
    document.getElementById("ccList").classList.toggle("active");
    document.getElementById("ccCount").classList.toggle("d-none");
    document.getElementById("ccCountless").classList.toggle("d-none");
  }

  Toshowmore() {
    document.getElementById("ToList").classList.toggle("active");
    document.getElementById("ToCount").classList.toggle("d-none");
    document.getElementById("ToCountless").classList.toggle("d-none");
  }

  RemoveUser(employee: any): void {
    const index = this.selectedUsers.findIndex((Usr) => Usr.CreatedBy === employee.CreatedBy);
    this.isSelectionuser = false;
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
      this.selectedEmpIds.splice(index, 1);
      employee.checked = false;
    }
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }


  QuickUpload() {
   
    let lang: any = localStorage.getItem('language');
    this.SelectCategoryfromhere = lang === 'en' ? 'Select Category from here....' : 'اختر الفئة من هنا.....';
    this.SelectUsersfromheres = lang === 'en' ? 'Select Users from here' : 'حدد المستخدمين من هنا';
    this.inboxService.UsersListForAdd(this._MemoId).subscribe(
      res => {
        this._ExistingUsersMemo = res["Data"]["ExistingUserList"];
        // console.log(this._ExistingUsersMemo, "UserList");
        this._IsActiveExistinguser = this._ExistingUsersMemo.filter(item => item.IsExist === true && item.CreatedBy != this._LoginUserId);
        // this.selectedUsers = this._ExistingUsersMemo.filter(item => item.IsExist === true && item.CreatedBy != this._LoginUserId);
        // this._IsActiveExistinguser.forEach(element => {
        //   this.selectedEmpIds.push(element.CreatedBy);
        // });
        // console.log(this.selectedUsers, "Dropdownarray");
      });
    this.selectedCategoryArry = [];
    this.Attachmentshide = false;
    this.AttachmentsErrorlog = false;
    $('#attach_main').hide();
    $('#quik-upload').show();
    $('#quik-btn').hide();
    $('#atchvw-btn').removeClass('d-none');
  }

  _ExistingUsers(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = this._IsActiveExistinguser.find((User) => User.CreatedBy === event.option.value);
    // this._keeppanelopenusers();
    if (selectedEmployee) {
      const index = this.selectedUsers.findIndex((user) => user.CreatedBy === selectedEmployee.CreatedBy);
      if (index === -1) {
        // user not found in the selected array, add it
        this.selectedUsers.push(selectedEmployee);
        this.selectedEmpIds.push(selectedEmployee.CreatedBy);
      } else {
        // user found in the selected array, remove it
        this.selectedUsers.splice(index, 1);
        this.selectedEmpIds.splice(index, 1);
      }
      // console.log(this.selectedUsers, "User in custom");
    }
    // this.fruitInput.nativeElement.value = '';
    this._ExistingUser = this._IsActiveExistinguser;
    this.isSelection_Users = false;
  }

  isSelecteduser(employee: any): boolean {
    return this.selectedUsers.some((emp) => emp.CreatedBy === employee.CreatedBy);
  }

  filterusers(input: string): void {
    this.isSelectionuser = true;
    this._ExistingUser = this._IsActiveExistinguser.filter((employee) =>
      employee.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  _keeppanelopenusers() {
    this._ExistingUser = this._IsActiveExistinguser;
    this.isSelection_Users = true;
    this.autoCompleteTrigger3.openPanel();
    (<HTMLInputElement>document.getElementById("txtsearchUsers")).focus()
  }

  closePanelusers() {
    this.isSelectionuser = false;
    this.isSelection_Users = false;
    (<HTMLInputElement>document.getElementById("txtsearchUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel

  }

  RemoveCategory(): void {
    this.selectedCategory = "";
    this.ICustomUpload.forEach(element => {
      element.isChecked = false;
    });
    this.CategoryErrorlog = true;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }


  SelectedCategory(category: MatAutocompleteSelectedEvent): void {
    const _selectCate = this.ICustomUpload.find(user => user.CategoryId === category.option.value).CategoryName;
    this.selectedCategory = this.selectedCategory === _selectCate ? '' : _selectCate;
    this.ICustomUpload.forEach(element => {
      element.isChecked = element.CategoryId === category.option.value && this.selectedCategory != '' ? true : false;
    });
    // console.log(this.selectedCategory, "Cat");
    this.CategoryErrorlog = false;
    this.isSelectionCatarryArry = false;
  }



  isSelectedCategory(category: MatAutocompleteSelectedEvent): boolean {
    return this.selectedCategory.includes(category.option.value);
  }


  filterCategory(input: string): void {
    this.isSelectionCat = true;
    this.Catarry = this.ICustomUpload.filter((category) =>
      category.CategoryName.toLowerCase().includes(input.toLowerCase())
    );
  }



  AddCategory() {
    this.Catarry = this.ICustomUpload;
    this.isSelectionCat = true;
    this.isSelectionCatarryArry = true;
    this.autoCompleteTrigger4.openPanel();
    (<HTMLInputElement>document.getElementById("txtsearchCategory")).focus();
  }

  closeCategory() {
    this.isSelectionCat = false;
    this.isSelectionCatarryArry = false;
    (<HTMLInputElement>document.getElementById("txtsearchCategory")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchCategory")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }

  // closeCategoryArry() {
  //   this.isSelectionCatarry = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchCategoryarry")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchCategoryarry")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }
  _AddNewUsersInReply(event: MatAutocompleteSelectedEvent): void {

    const selectedEmployee = this._AllUsersToList.find((user) => user.CreatedBy === event.option.value);
    if (selectedEmployee) {
      const index = this.ReplyAddUsers.findIndex((_user) => _user.CreatedBy === selectedEmployee.CreatedBy);
      if (index === -1) {
        // User not found in the selected array, add it
        this.ReplyAddUsers.push(selectedEmployee);
        this.SelectReplyUserIds.push(selectedEmployee.CreatedBy);
      } else {
        // User found in the selected array, remove it
        this.ReplyAddUsers.splice(index, 1);
        this.SelectReplyUserIds.splice(index, 1);
      }
    }
    this._UserListReplySubList = this._AllUsersToList;
    this.isSelection_AddUsersReply = false;
    this.AddUserReplyErrorLog = false;
  }
  isSelectedAddusersReply(_User: any): boolean {
    return this.ReplyAddUsers.some((usr) => usr.CreatedBy === _User.CreatedBy);
  }

  filterAddUsersReply(input: string): void {
    this.isSelectionAddUserReply = true;
    this._UserListReplySubList = this._AllUsersToList.filter((User) =>
      User.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  OpenAddUsersReply() {
    this._UserListReplySubList = this._AllUsersToList;
    this.isSelection_AddUsersReply = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsersReply")).focus()
  }

  closePanelAddusersReply() {
    this.isSelectionAddUserReply = false;
    this.isSelection_AddUsersReply = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsersReply")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddUsersReply")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

    RemoveAddUserReply(Users) {
      const index = this.ReplyAddUsers.findIndex((usr) => usr.CreatedBy === Users.CreatedBy);
      this.isSelectionAddUserReply = false;
      if (index !== -1) {
        this.ReplyAddUsers.splice(index, 1);
        this.SelectReplyUserIds.splice(index, 1);
      }
      Users.checked = false;
      requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
    }
  // AddNewUserDropdown 
  _AddNewUsers(event: MatAutocompleteSelectedEvent): void {

    const selectedEmployee = this._UsersList.find((user) => user.UserId === event.option.value);
    if (selectedEmployee) {
      const index = this.AddNewUserValues.findIndex((_user) => _user.UserId === selectedEmployee.UserId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.AddNewUserValues.push(selectedEmployee);
        this.SelectedUserIds.push(selectedEmployee.UserId);
      } else {
        // User found in the selected array, remove it
        this.AddNewUserValues.splice(index, 1);
        this.SelectedUserIds.splice(index, 1);
      }
    }
    this._UserListSubList = this._UsersList;
    this.isSelection_AddUsers = false;
    this.AddUserErrorLog = false;
  }

  isSelectedAddusers(_User: any): boolean {
    return this.AddNewUserValues.some((usr) => usr.UserId === _User.UserId);
  }

  filterAddUsers(input: string): void {
    this.isSelectionAddUser = true;
    this._UserListSubList = this._UsersList.filter((User) =>
      User.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  OpenAddUsers() {
    this._ExistingUser = this._IsActiveExistinguser;
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

  // Mat Label Dropdown 

  _AddLabel(event: MatAutocompleteSelectedEvent): void {
    const selectedLabel = this.LabelsJsondata.find((label) => label.LabelId === event.option.value);
    if (selectedLabel) {
      const index = this.AddLabelList.findIndex((_label) => _label.LabelId === selectedLabel.LabelId);
      if (index === -1) {
        // Label not found in the selected array, add it
        this.AddLabelList.push(selectedLabel);
        this.SelectedLabelIds.push(selectedLabel.LabelId);
      } else {
        // Label found in the selected array, remove it
        this.AddLabelList.splice(index, 1);
        this.SelectedLabelIds.splice(index, 1);
      }
    }
    this.SubLabelList = this.LabelsJsondata;
    this.isSelection_AddLabel = false;
    this.LabelUserErrorLog = false;
  }

  isSelectedAddLabel(_label: any): boolean {
    return this.AddLabelList.some((lbl) => lbl.LabelId === _label.LabelId);

  }

  OpenAddLabel() {
    this.SubLabelList = this.LabelsJsondata;
    this.isSelection_AddLabel = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).focus()
  }

  closePanelAddLabel() {
    this.isSelectionAddLabel = false;
    this.isSelection_AddLabel = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  filterAddLabel(input: string): void {
    this.isSelectionAddLabel = true;
    this.SubLabelList = this.LabelsJsondata.filter((label) =>
      label.LabelName.toLowerCase().includes(input.toLowerCase())
    );
  }

  RemoveAddLabel(Label) {
    const index = this.AddLabelList.findIndex((lbl) => lbl.LabelName === Label.LabelName);
    this.isSelectionAddLabel = false;
    if (index !== -1) {
      this.AddLabelList.splice(index, 1);
      this.SelectedLabelIds.splice(index, 1);
    }
    Label.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }
  shareOnWhatsApp(): void {
    // URL encode the link
    const link = 'https://cswebapps.com/dmsweb/Memo/Details/' + this._MemoId + "/" + this._ReplyId;
    const encodedLink = encodeURIComponent(link);

    // Create the WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodedLink}`;

    // Open the URL in a new tab/window
    window.open(whatsappUrl, '_blank');
  }
  shareOnFacebook(): void {
    // URL encode the link
    const link = 'https://cswebapps.com/dmsweb/Memo/Details/' + this._MemoId + "/" + this._ReplyId;
    const encodedLink = encodeURIComponent(link);
    // Create the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;

    // Open the URL in a new tab/window
    window.open(facebookShareUrl, '_blank');
  }
  shareOnTwitter(): void {
    // URL encode the components
    const link = 'https://cswebapps.com/dmsweb/Memo/Details/' + this._MemoId + "/" + this._ReplyId;
    const encodedUrl = encodeURIComponent(link);

    // Create the Twitter Intent URL
    let twitterIntentUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;

    // Open the URL in a new tab/window
    window.open(twitterIntentUrl, '_blank');
  }
  copyLinkToClipboard(): void {
    const link = 'https://cswebapps.com/dmsweb/Memo/Details/' + this._MemoId + "/" + this._ReplyId;
    navigator.clipboard.writeText(link).then(() => {
      const language = localStorage.getItem('language');

      // Display message based on language preference
      if (language === 'ar') {
        this._snackBar.open('تم نسخ الرابط إلى الحافظة', 'تنتهي الآن', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      } else {
        this._snackBar.open('link copied to clipboard', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      }

      // Here you can trigger any feedback to the user, like a tooltip or a toast notification.
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
  featuremodel() {
    document.getElementById("newfeatures").style.display = "block";
    document.getElementById("newfeatures").style.overflow = "auto";
    document.getElementById("feature-modal-backdrop").classList.add("show");
  }

  NewAddUserCountFeature(_FeatureId: number) {
    this._obj.FeatureId = _FeatureId;
    this._obj.UserId = this.currentUserValue.createdby;
    this.newmemoService.AddUserCountFeature(this._obj).subscribe(
      data => {
        document.getElementById("newfeatures").style.display = "none";
        document.getElementById("newfeatures").style.overflow = "hidden";
        document.getElementById("feature-modal-backdrop").classList.remove("show");
      });
  }

  adjustDropdownPositionOnHover() {
    const userDetailElements = document.querySelectorAll('.user-detail');
    userDetailElements.forEach((userDetail: HTMLElement) => {
      userDetail.addEventListener('mouseenter', () => {
        const dropdownMenu = userDetail.querySelector('.user-detail-hover') as HTMLElement;
        if (!dropdownMenu) return;

        const dropdownRect = dropdownMenu.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();

        const newPositionX = dropdownRect.left + dropdownRect.width <= bodyRect.width ? 0 : bodyRect.width - dropdownRect.width - dropdownRect.left;
        const newPositionY = dropdownRect.top + dropdownRect.height <= bodyRect.height ? 0 : bodyRect.height - dropdownRect.height - dropdownRect.top;

        dropdownMenu.style.transform = `translate3d(${newPositionX}px, ${newPositionY}px, 0)`;
      });
    });
  }

to_viewmore() {
    const viewmoreElement = document.getElementById("to-viewmore");
    const viewlessElement = document.getElementById("to-viewless");

    document.getElementById("ToList").classList.toggle("more");
    
    if (viewmoreElement.style.display === "none") {
        viewmoreElement.style.display = "block";
        viewlessElement.style.display = "none";
    } else {
        viewmoreElement.style.display = "none";
        viewlessElement.style.display = "block";
    }
}

cc_viewmore() {
  const viewmoreElement = document.getElementById("cc-viewmore");
  const viewlessElement = document.getElementById("cc-viewless");

  document.getElementById("ccList").classList.toggle("more");
  
  if (viewmoreElement.style.display === "none"){
    viewmoreElement.style.display = "block";
    viewlessElement.style.display = "none";
  } else {
    viewmoreElement.style.display = "none";
    viewlessElement.style.display = "block";
  }
}
// date_filter(){
//   document.getElementById("date-fiter-dropdown").classList.toggle("show");
// }

datesUpdated($event) {
  if (this.pipe.transform($event.startDate, 'longDate') != null) {
    this._StartDate = this.pipe.transform($event.startDate, 'longDate');
    this._EndDate = this.pipe.transform($event.endDate, 'longDate');
  }
}
selectedDate(event) {
  if (event.option.value !== this._LoginUserId) {
    const selectedValue = event.option.value;
    // Handle the selected value here
  }
}
}
