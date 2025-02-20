import {
  Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, ViewChild,
  ViewChildren, QueryList, Inject,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { OutsourceService } from 'src/app/_service/outsource.service';
import { Outsourcedto } from 'src/app/_models/outsourcedto';
import {  MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { MemoReplyService } from 'src/app/_service/memo-reply.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { GacArchivingService } from 'src/app/_service/GacArchivingService';
import * as moment from 'moment';
import * as  Editor from 'ckeditor5-custom-build/build/ckeditor';
import tippy from 'node_modules/tippy.js';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular'; // Import AmChartsService and AmChart

// am4core.useTheme(am4themes_animated);
// let chart;
// let chart1;
// let xAxis;
// let yAxis;

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

am4core.useTheme(am4themes_animated);

let chart1;
interface ICustomUpload {
  CategoryName: string;
  CategoryId: number;
  isChecked: boolean;
}

@Component({
  selector: 'app-memo-details-v2',
  templateUrl: './memo-details-v2.component.html',
  styleUrls: ['./memo-details-v2.component.css'],
})


export class MemoDetailsV2Component implements OnInit, AfterViewInit {

  @ViewChild('tooltipElement', { static: false }) tooltipElement: ElementRef;
  @ViewChild('EditReply', { static: false }) editReplyElement!: ElementRef; // ViewChild to reference the DOM element
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  @ViewChild('inputField4', { read: MatAutocompleteTrigger }) autoCompleteTrigger4: MatAutocompleteTrigger;
  @ViewChild('inputField3', { read: MatAutocompleteTrigger }) autoCompleteTrigger3: MatAutocompleteTrigger;
  @ViewChild('inputField1', { read: MatAutocompleteTrigger }) autoCompleteTrigger1: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) customTriggerCC!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTriggerCC: MatAutocompleteTrigger;
  @ViewChild('inputField2', { read: MatAutocompleteTrigger }) autoCompleteTrigger2: MatAutocompleteTrigger;
  @ViewChild('editors') MemoDetailsV2Component: CKEditorComponent;
  @ViewChild('editors') editors!: CKEditorComponent; // Reference to the CKEditor instance
  @ViewChild('commentInput', { static: false }) commentInput!: ElementRef;
  @ViewChild('Approvecommentsfocus', { static: false }) Approvecommentsfocus!: CKEditorComponent;
  @ViewChild('Rejectcommentsfocus', { static: false }) Rejectcommentsfocus!: CKEditorComponent;



  //Login User Data fetch
  //start lud
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  jsonData: any[] = [];
  ReplyList: any[] = [];
  _MemoHeaderDetails: any[] = [];
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  //end lud

  //Declaring DTO's
  //start here
  _obj: InboxDTO;
  _objEp: Outsourcedto
  //end here
  _objInb: InboxDTO;
  _UserExistInMemo: Boolean = true;
  Usericon: boolean = false;
  chart1: AmChart; // Assuming chart1 is defined in the component
  Adduserserach: string;
  selectedUserDisplayName: boolean = true;
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
  _LoginUserId: number;
  _MemoId: number;
  _ReplyId: number;
  ReplyListSearch: string;
  _Activity: boolean = false;
  _LoadMoreLength: number = 0;
  ReplyUserList: any[] = [];
  ReplyFilter: boolean = false;
  _Details: any[] = [];
  showLoadMoreButton: boolean = true;
  isEP: boolean;
  ICustomUpload: ICustomUpload[] = [];
  _outsourceobj: Outsourcedto;
  _EPProjects: any;
  pipe = new DatePipe('en-US');
  _StartDate: string = '';
  _EndDate: string = '';
  _StartDate1: string = '';
  _EndDate1: string = '';
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
  // Label Section Variables start here
  LabelsJsondata: any;
  SelectLabel: any = [];
  LabelUserErrorLog: boolean = false;
  SubLabelList: any = [];
  AddLabelList: any = [];
  isSelectionAddLabel: boolean = false;
  SelectedLabelIds: any = [] = [];
  Addlabel: string = "";
  isSelection_AddLabel: boolean = false;
  LabelCount: number = 0;
  // Label Section end here

  // User Section Start here
  ListofuserSearch: string;
  _UsersList: any;
  _UserListSubList: any = [];
  _ExistingUsersMemo: any[];
  _ExistingUser: any = [];
  MemoCreatedUserName: any;
  MemoCreatedUser_Staus: boolean;
  MemoCreatedUserCompanyName: string;
  MemoCreatedUserDesignationName: string;
  MemoCreatedUserProfile: string;
  MemoCreatedUsersince: string;
  MemoCreatedUsertotalreplys: string;
  SentCount: number;
  Receivecount: number;
  MemoCreatedUserId: number;
  DMSRequestJson: any = [];
  _ReplyJson: any = [];
  _ReplyJsonBinding: any = [];
  TotalSelectedReplies: number = 0;
  selectallreply: boolean = true;
  ListUsersearch: string;
  AddNewUserValues: any = [];
  isSelectionAddUser: boolean = false;
  SelectedUserIds: any = [] = [];
  SelectUsersfromhere: string;
  isSelection_AddUsers: boolean = false;
  AddUserErrorLog: boolean = false;
  IsToUsers: boolean = true;
  UserComments: string;
  // User Section end here..

  // Merge Section Start here
  Dropdowntopsubject: any;
  RightSubjectSelected: string;
  _SubjectLeftList: any[];
  _SubjectRightList: any[];
  _AllSubjectList: any[] = [];
  LeftSubjectSelected: string;
  LeftDropdownCount: any;
  ReplyIds: any[] = [];
  // Merge Secton end here..

  // Memo History start here
  AttachmentList: any[];
  //Memo History end here..

  //Attachment Section start here
  selectedUsers = [];
  SelectCategoryfromhere: string;
  SelectUsersfromheres: string;
  _IsActiveExistinguser = [];
  Attachmentshide: boolean = true;
  AttachmentsErrorlog: boolean = false;
  CategoryErrorlog: boolean = false;
  AttachmentErrorlog: boolean = false;
  selectedCategory = "";
  selectedEmpIds: any = [];
  myFilesAtt: string[] = [];
  _Comments: string;
  AttachmentFileuplod: any;
  SearchTxt: string;
  SortType: number = 1;
  DocumentList: any[];
  Attachementcount: number = 0;
  Date: Boolean = true;
  Users: Boolean = false;
  Subject: Boolean = false;
  Byme: Boolean = false;
  CustomAttachment: Boolean = false;
  isSelectionCatarry: boolean = false;
  isSelectionCatarryArry: boolean = false;
  isSelectionCat: boolean = false;
  isSelectionCatAry: boolean = false;
  Catarry: any = [];
  UserSearch: string;
  isSelection_Users: boolean = false;
  readonly signalUrl = this.commonUrl.Signalurl;
  private progressConnectionBuilder!: HubConnection;
  private receiveReplyConnectionBuilder!: HubConnection;
  offers: any[] = [];
  progressbar: number = 0;
  _lstMultipleFiales: any;
  myFiles: string[] = [];
  isSelectionuser: boolean = false;
  // Attachment Section end here

  // Header Variable Values start here
  FavoriteVal: boolean;
  _IsDeleted: boolean;
  Pinval: boolean;
  DMSPendingCount: number = 0;
  _subject: string;
  Requestbutton: boolean;
  Aftersendmessage: boolean = false;
  Accessuser: any;
  IsConfidential: boolean = false; // Initialize as needed
  IsConfidentialReply: boolean = false; // Initialize as needed
  FirstReplyId: number;
  _IsExists: boolean;
  _ReplyUserExists: boolean
  _AllUsersList: any[] = [];
  _AllUsersToList: any[] = [];
  _AllUsersCCList: any[] = [];
  ReplySubjecthide: boolean;
  //Header Variable Values end here

  //Access denied user Varible value start here
  Usercomment: string = "";
  //Access denied user Varible value end here

  // Arabic lang variable value start here
  placeholderText: string;
  currentLang: "ar" | "en" = "ar";
  placeholderlabel: string;
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
  // Arabic lang variable value end here

  // Pagination Variable start here
  _CurrentpageNo: number;
  _TotalRecords: number;
  NextMemoId: number;
  PreviousMemoId: number;
  NextReplyId: number;
  PreviousReplyId: number;
  _MemoIds: any;
  // Pagination Variable end here

  // Meetings Variable start here
  _Addguest: any;
  _Addguestlist: any;
  sorttypes: number;
  tdMtgCnt: number = 0;
  upcMtgCnt: number = 0;
  lstMthCnt: number = 0;
  lst7dCnt: number = 0;
  oldMtgCnt: number = 0;
  meeting_arry: any;
  meetinglength: any;
  upcomingMeetings: any;
  todaymeetings: any;
  last7dmeetings: any;
  lastMonthMeetings: any;
  olderMeetings: any;
  meetingList: any;
  isLoadingData: boolean = false;
  mtgFromD: string = '';
  mtgUptoD: string = '';
  mtgsInRange: any;
  mLdng: boolean = false;
  // Meetings Variable start here

  // Right Section Variable Start here
  AprrovewithCommentsList: any[] = [];
  DocumentsHistoryList: any;
  AddedUsersJson: any;
  SubjectHistoryJson: any;
  _Bookmark: boolean = false;
  AddUserReplyAdmin: boolean = true;
  showButton: boolean = true;
  _MinutesDifference: number;
  _SecondsDifference: number;
  timer: Subscription;
  minutes: number;
  seconds: number;
  _MemoDocuments: any;
  _MemoDocumentsCount: number = 0;
  _tableRequired: boolean;
  ViewMorethreadshide: boolean = false;
  _CurrectionSelectionIsHIstory: boolean = false;
  _IsHistory: any;
  _ToUserListDetails: any[] = [];
  _CCUserListDetails: any[] = [];
  _ToUserMemo: any[] = [];
  _CCUserMemo: any[] = [];
  TotalUserListDetails: any;
  TotalCCUserListDetails: any;
  _ReplyParentDetailsJson: any = [];
  _ParentDisplayName: any;
  _Twoletter: any;
  _TwoletterReplyHistroy: any;
  showSendAnywayAndCancelButtons: boolean = true;
  searchTOfromhere: string;
  searchCCfromhere: string;
  ReplyType: string;
  Replybutton: boolean = false;
  ReplyRequired: boolean;
  ApprovalPending: boolean;
  _IsConfidential: boolean;
  htmlContent: string = "";
  _DraftColour: boolean = false;
  _Drafttext: string;
  SelectedSubject: string;
  _ApprovalMemoId: number;
  _ApprovalReplyId; number;
  _UpdatedReplyId: number;
  Rejectcomments: any;
  Approvecomments: any;
  ReplyToUsers: boolean = true;
  ReplyAddUsers: any = [];
  SelectReplyUserIds: any = [] = [];
  AddUserReplyErrorLog: boolean = false;
  ToErrorlog: boolean = false;
  progress: number = 0;
  _ForwardMemoDocuments: any = [] = [];
  DeadlineDatecheck: boolean = false;
  _ExpiryDate: Date | null = null;
  disablePreviousDate = new Date();
  public Editor: any = Editor;
  _DraftId: number = 0;
  isSelectionCC: boolean = false;
  selectedToEmpIds: any = [];
  selectedCCEmpIds: any = [];
  selectedToEmployees: any = [];
  selectedCCEmployees: any = [];
  _disabledUsers: number[] = [];
  _TempToUsers: any[] = [];
  _TempCCUsers: any[] = [];
  isSelection: boolean = false;
  SubjectErrorlog: boolean = false;
  selectItemToReadTranslation: string;
  nothingIsSelectedTranslation: string;
  _UserListReplySubList: any = [];
  _MainSubjectOption: boolean = false;
  ActionMemoPercentage: number = 80;
  constructor(
    private route: ActivatedRoute,
    private inboxService: InboxService,
    private cdr: ChangeDetectorRef,
    private outsourceService: OutsourceService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public newmemoService: NewMemoService,
    private el: ElementRef,
    private elementRef: ElementRef,
    public memoreplyService: MemoReplyService,
    private commonUrl: ApiurlService,
    private router: Router,
    private datePipes: DatePipe,
    public datepipe: DatePipe,
    private gacArchivingService: GacArchivingService
  ) {
    translate.setDefaultLang('en');
    translate.use('en'); // Set initial language
    this._obj = new InboxDTO();
    this._objInb = new InboxDTO();
    this._objEp = new Outsourcedto();
    this._MemoId = this.route.snapshot.params['id'];
    this._ReplyId = this.route.snapshot.params['replyid'];
    // alert(this._ReplyId);

    this.EmployeeId = parseInt(this.currentUserValue.EmployeeCode);
    this._LoginUserId = this.currentUserValue.createdby;
    this._disabledUsers = [this._LoginUserId];
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
        current = this._MemoIds[i].ReplyId;
        if (current == this._ReplyId) {
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
  }

  async SignalRMethods() {
    //Creation Connection of Receiving Replies
    //start here
    let _val = this.currentUserValue.createdby + this._MemoId;
    this.receiveReplyConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'receiveReplyList?userId=' + _val)
      .build();
    // this.receiveReplyConnectionBuilder.start().then(() =>
    //   console.log('Reply List Binding Connection started.......!'))
    //   .catch(err => console.log('Error while connect with server'));
    // this.receiveReplyConnectionBuilder.onclose((error) => {
    //   console.error('Connection closed. Failed to reconnect after multiple attempts:', error);
    //   // window.location.reload();
    //   // Optionally, you can trigger a manual reconnection here if necessary.
    // });
    const startConnection = () => {
      this.receiveReplyConnectionBuilder.start()
        .then(() => console.log('Reply List Binding Connection started.......!'))
        .catch(err => {
          console.log('Error while connecting to server:', err);
          // Try to reconnect after a delay if the initial connection fails
          setTimeout(() => startConnection(), 5000); // Retry after 5 seconds
        });
    };

    // Start the connection for the first time
    startConnection();

    this.receiveReplyConnectionBuilder.onclose((error) => {
      console.error('Connection closed. Attempting to reconnect...', error);
      // Retry connection after delay (e.g., 3 seconds)
      setTimeout(() => {
        startConnection();
      }, 3000);
    });

    this.receiveReplyConnectionBuilder.on("ReceiveReply", (receiveReplies) => {
      const jsonData = [JSON.parse(receiveReplies)];
      this.ReplyList = this.updateOrAddReplies(this.ReplyList, jsonData);
      if (this.Pg_ReplyFilter_Date) {
        const groupedData = {};
        this.ReplyList.forEach(item => {
          if (!groupedData[item.DateCategory]) {
            groupedData[item.DateCategory] = [];
          }
          groupedData[item.DateCategory].push(item);
        });
        // Creating JSON representation for each group
        const groupedJson = Object.keys(groupedData).map(key => {
          return {
            DateCategoryValue: key,
            DateCategoryJson: groupedData[key],
            DateCategorySort: groupedData[key][0].SortOrder
          };
        });
        // Sort the groupedJson array by DateCategorySort in descending order
        groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
        this.jsonData = groupedJson;
      }
      else if (this.Pg_ReplyFilter_Subject) {
        const groupedData = {};
        this.ReplyList.forEach(item => {
          if (!groupedData[item.Title]) {
            groupedData[item.Title] = [];
          }
          groupedData[item.Title].push(item);
        });
        // Creating JSON representation for each group
        const groupedJson = Object.keys(groupedData).map(key => {
          return {
            DateCategoryValue: key,
            DateCategoryJson: groupedData[key],
            DateCategorySort: groupedData[key][0].SortOrder
          };
        });

        // Sort the groupedJson array by DateCategorySort in descending order
        groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
        this.jsonData = groupedJson;
      }
      else if (this.Pg_ReplyFilter_From) {
        const groupedData = {};
        this.ReplyList.forEach(item => {
          if (!groupedData[item.DisplayName]) {
            groupedData[item.DisplayName] = [];
          }
          groupedData[item.DisplayName].push(item);
        });
        // Creating JSON representation for each group
        const groupedJson = Object.keys(groupedData).map(key => {
          return {
            DateCategoryValue: key,
            DateCategoryJson: groupedData[key],
            DateCategorySort: groupedData[key][0].SortOrder
          };
        });

        // Sort the groupedJson array by DateCategorySort in descending order
        groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
        this.jsonData = groupedJson;
      }
      this.jsonData.forEach(element => {
        element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });
    });
    //End here

    //Creation Connection of Progress bar for file upload
    //start here
    this.progressConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'progressHub?userId=' + this.currentUserValue.createdby)
      .build();

    // let retryCount = 0;
    // const maxRetries = 5;

    // const startProgressConnection = () => {
    //   this.progressConnectionBuilder.start()
    //     .then(() => {
    //       console.log('Progress Hub Connection started.......!');
    //       retryCount = 0;  // Reset retry count on successful connection
    //     })
    //     .catch(err => {
    //       console.log('Error while connecting to progress hub:', err);
    //       if (retryCount < maxRetries) {
    //         retryCount++;
    //         const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);  // Exponential backoff, capped at 30 seconds
    //         setTimeout(() => startProgressConnection(), delay);
    //       } else {
    //         console.error('Max reconnection attempts reached for progress hub.');
    //       }
    //     });
    // };

    // // Start the connection for the first time
    // startProgressConnection();

    // this.progressConnectionBuilder.onclose((error) => {
    //   console.error('Progress connection closed. Attempting to reconnect...', error);

    //   // Retry connection after delay (e.g., 3 seconds)
    //   setTimeout(() => {
    //     startProgressConnection();
    //   }, 3000);
    // });
    //End here
  }


  ngAfterViewInit() {

    setTimeout(() => {
      this.initializeTippy()
    }, 2000);
    setTimeout(() => {
      if (this.commentInput) {
        this.commentInput.nativeElement.focus();
      }
    }, 1000);
  }


  showPopup: boolean = false;
  _Replypopup: boolean = false
  maxShowCount: number = 1;  // Maximum number of times to show the popup
  async ngOnInit(): Promise<void> {
    this.showButton = false;
    this._LoginUserId = this.currentUserValue.createdby;
    // const storedLoginUserId = localStorage.getItem('storedLoginUserId');
    // const storedPopupShown = localStorage.getItem('popupShown'); // Flag for hiding popup
    let visitCount = Number(this.currentUserValue.SharePopupCount) || 0;

    console.log('Stored Login User ID:', this._LoginUserId);
    console.log('Visit Count:', visitCount);

    if (this._LoginUserId.toString() === this._LoginUserId.toString()) {
      // Same user logic
      visitCount++;
      if (visitCount <= this.maxShowCount) {
        this.showPopup = true;
        localStorage.setItem('visitCount', visitCount.toString());
        console.log('Popup shown. Visit count:', visitCount);
      } else {
        this.showPopup = false;
        localStorage.setItem('popupShown', 'true');
        console.log('Limit reached. Popup hidden.');
      }
    } else {
      localStorage.setItem('storedLoginUserId', this._LoginUserId.toString());
      localStorage.setItem('visitCount', '1');
      this.showPopup = true;
      console.log('First-time visit. Popup shown.');
    }





    // const storedLoginUserId = Number(localStorage.getItem('storedLoginUserId')) || null;
    // let visitCount = Number(localStorage.getItem('visitCount')) || 0;

    // // Condition 1: Both IDs are the same, show up to maxShowCount times
    // if (this._LoginUserId === storedLoginUserId) {
    //   visitCount++;  // Increment visit count
    //   if (visitCount <= this.maxShowCount) {
    //     this.showPopup = true;  // Show the popup    
    //     localStorage.setItem('visitCount', visitCount.toString()); // Store the updated visit count
    //     // console.log('Popup shown. Visit count:', visitCount);
    //   } else {
    //     this.showPopup = false; // Hide if limit reached
    //     // console.log('Limit reached. Popup hidden.');
    //   }
    // }
    //  else {
    //   // when memo is open for very first time.
    //   // If the IDs do not match, ensure popup is hidden
    //   localStorage.setItem('storedLoginUserId', this._LoginUserId.toString());
    //   localStorage.setItem('visitCount', '0');
    //   this.showPopup = true;
    // }

    setTimeout(() => {
      const targetElementId = `New_Div_${this._ReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    window.addEventListener('scroll', () => {
      this.autocompletes.forEach((ac) => {
        if (ac.panelOpen)
          ac.updatePosition();
      });
    }, true);
    this.progress = 0;
    this.SortType = 1;
    (await this.ReplyListLeftSectionInitialLoadV2(this._MemoId, 1, 30));
    (await this.languageValuesAssign());
    (await this.SignalRMethods());
    this.generateLink();
  }

  Gotit(): void {
    // Get the current count from localStorage SharePopupCount
    // let visitCount = this.currentUserValue.SharePopupCount;
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let currentUserString = localStorage.getItem('currentUser');
    let currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    //localStorage.getItem('visitCount');
    // Convert the value to a number, or initialize to 0 if not present
    let count = currentUser[0].SharePopupCount ? Number(currentUser[0].SharePopupCount) : 0;
    // Increment the count
    count++;
    currentUser[0].SharePopupCount = count;
    // Store the updated count back in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.showPopup = false;
  }

  _ApprovalStatus: string = 'Pending'; // Assuming this is defined somewhere
  initializeTippy() {
    const hoverElementsPF = document.querySelectorAll('.tippy_EditSubject');
    hoverElementsPF.forEach(hoverElementINMPF => {
      tippy(hoverElementINMPF, {
        content: 'Edit Subject',
        placement: 'right-end',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });



    const hoverElementEP = document.querySelector('#ExecutionPlanner');
    if (hoverElementEP) {
      // Initialize Tippy.js
      tippy(hoverElementEP, {
        content: 'Stream planner',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementEM = document.querySelector('#Vieworlinkmeeting');
    if (hoverElementEM) {
      // Initialize Tippy.js
      tippy(hoverElementEM, {
        content: 'Meeting(s)',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementML = document.querySelector('#labelsTitle');
    if (hoverElementML) {
      // Initialize Tippy.js
      tippy(hoverElementML, {
        content: 'Mark as label(s)',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMF = document.querySelector('#Favoritetitle');
    if (hoverElementMF) {
      // Initialize Tippy.js
      tippy(hoverElementMF, {
        content: 'Mark as favorite',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMD = document.querySelector('#DeleteMemo');
    if (hoverElementMD) {
      // Initialize Tippy.js
      tippy(hoverElementMD, {
        content: 'Move to trash',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMR = document.querySelector('#RestoreMemo');
    if (hoverElementMR) {
      // Initialize Tippy.js
      tippy(hoverElementMR, {
        content: 'Restore',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMS = document.querySelector('#MemoStatuss');
    if (hoverElementMS) {
      // Initialize Tippy.js
      tippy(hoverElementMS, {
        content: 'Memo Status',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMP = document.querySelector('#PinMemo');
    if (hoverElementMP) {
      // Initialize Tippy.js
      tippy(hoverElementMP, {
        content: 'Mark as pin',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMPu = document.querySelector('#unPinMemo');
    if (hoverElementMPu) {
      // Initialize Tippy.js
      tippy(hoverElementMPu, {
        content: 'Remove pin',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }
    const hoverElementMUS = document.querySelector('#Users');
    if (hoverElementMUS) {
      // Initialize Tippy.js
      tippy(hoverElementMUS, {
        content: 'Users',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMM = document.querySelector('#merge-btn');
    if (hoverElementMM) {
      // Initialize Tippy.js
      tippy(hoverElementMM, {
        content: 'Merge',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMH = document.querySelector('#History');
    if (hoverElementMH) {
      // Initialize Tippy.js
      tippy(hoverElementMH, {
        content: 'History',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMA = document.querySelector('#ListofAttachmnets');
    if (hoverElementMA) {
      // Initialize Tippy.js
      tippy(hoverElementMA, {
        content: 'List of Attachmnets',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementMN = document.querySelector('#FeaturesNew');
    if (hoverElementMN) {
      // Initialize Tippy.js
      tippy(hoverElementMN, {
        content: 'New Features',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }
    const hoverElementMRP = document.querySelector('#Recordsperpage');
    if (hoverElementMRP) {
      // Initialize Tippy.js
      tippy(hoverElementMRP, {
        content: 'Records per page',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMPP = document.querySelector('#Previose');
    if (hoverElementMPP) {
      // Initialize Tippy.js
      tippy(hoverElementMPP, {
        content: 'Previous',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMNP = document.querySelector('#Next');
    if (hoverElementMNP) {
      // Initialize Tippy.js
      tippy(hoverElementMNP, {
        content: 'Next',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMES = document.querySelector('#dropdownMenuLink');
    if (hoverElementMES) {
      // Initialize Tippy.js
      tippy(hoverElementMES, {
        content: 'Edit subject',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMAF = document.querySelector('#Filters');
    if (hoverElementMAF) {
      // Initialize Tippy.js
      tippy(hoverElementMAF, {
        content: 'Filters',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementMCF = document.querySelector('#ReloadClearFilters');
    if (hoverElementMCF) {
      // Initialize Tippy.js
      tippy(hoverElementMCF, {
        content: 'Reset',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    // Initialize Tippy.js with the appropriate tooltip content
    const hoverElement = document.querySelector('#AddUserhover');
    if (hoverElement) {
      // Initialize Tippy.js
      tippy(hoverElement, {
        content: 'Add User(s)',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElement1 = document.querySelector('#Share');
    if (hoverElement1) {
      // Initialize Tippy.js
      tippy(hoverElement1, {
        content: 'Share',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElement2 = document.querySelector('#Bookmark');
    if (hoverElement2) {
      // Initialize Tippy.js
      tippy(hoverElement2, {
        content: 'Mark as bookmark',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElement3 = document.querySelector('#Reply');
    if (hoverElement3) {
      // Initialize Tippy.js
      tippy(hoverElement3, {
        content: 'Reply',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElement4 = document.querySelector('#ReplyAll');
    if (hoverElement4) {
      // Initialize Tippy.js
      tippy(hoverElement4, {
        content: 'Reply All',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElement9 = document.querySelector('#NewTopic');
    if (hoverElement9) {
      // Initialize Tippy.js
      tippy(hoverElement9, {
        content: 'New Topic',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementworkflow = document.querySelector('#workflow');
    if (hoverElementworkflow) {
      // Initialize Tippy.js
      tippy(hoverElementworkflow, {
        content: 'Workflow',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElement5 = document.querySelector('#Forward');
    if (hoverElement5) {
      // Initialize Tippy.js
      tippy(hoverElement5, {
        content: 'Forward',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElement8 = document.querySelector('#EditReply');
    if (hoverElement8) {
      tippy(hoverElement8, {
        content: 'Edit',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }
    const Removeuser = document.querySelectorAll('.remove_user');
    Removeuser.forEach(hoverElementremove_user => {
      tippy(hoverElementremove_user, {
        content: 'Remove User',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    const Restoreuser = document.querySelectorAll('#restore_user');
    Restoreuser.forEach(hoverElementrestore_user => {
      tippy(hoverElementrestore_user, {
        content: 'Restore User',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    if (this._ApprovalStatus == 'Pending') {
      const hoverElement6 = document.querySelector('#Reject');
      if (hoverElement6) {
        // Initialize Tippy.js
        tippy(hoverElement6, {
          content: 'Reject',
          placement: 'bottom',
          arrow: true,
          animation: 'scale-extreme',
          animateFill: true,
          inertia: true,
        });
      }

      const hoverElement7 = document.querySelector('#Approve');
      if (hoverElement7) {
        // Initialize Tippy.js
        tippy(hoverElement7, {
          content: 'Approve',
          placement: 'bottom',
          arrow: true,
          animation: 'scale-extreme',
          animateFill: true,
          inertia: true,
        });
      }
    }




  }


  ngOnDestroy(): void {
    this.timer.unsubscribe(); // Unsubscribe from the timer observable to prevent memory leaks
  }

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
        this.renderer.removeChild(document.head, linkElement);
      } else {
      }
    }
    this.translate.getTranslation(lang).subscribe(translations => {
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

    if (this.jsonData.length === 0) {
      this.translate.get('Memodeatils.Selectanitemtoread').subscribe((translation: string) => {
        this.selectItemToReadTranslation = translation;
        this.cdr.detectChanges();
      });

      this.translate.get('Memodeatils.Nothingisselected').subscribe((translation: string) => {
        this.nothingIsSelectedTranslation = translation;
        this.cdr.detectChanges();
      });
    }
  }
  callAnotherMethod(): void {
    $('.kt-widget__items.mt-2.mr-1.px-2.collapse').removeClass('show');
    $('.mb-0.titlediv.d-flex.justify-content-between').addClass('collapsed');
  }
  async ReplyListLeftSectionInitialLoadV2(MailId: number, pageNumber: number, pageSize: number) {
    this._obj.MailId = MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyId = this._ReplyId;
    (await this.inboxService.ReplyListLeftSecrionInitialLoadV2(this._obj))
      .subscribe(async data => {
        console.log(data, "left section data")
        this._Activity = data["Data"].Activity == 'True' ? true : false;
        // alert(this._Activity);
        this.ReplyList = data["Data"].MemoReplyList;
        if (this.ReplyList[0].TotalRecords == this.ReplyList.length)
          this._LoadMoreLength = 0;
        else if (this.ReplyList[0].TotalRecords != this.ReplyList.length)
          this._LoadMoreLength = this.ReplyList.length;
        const groupedData = {};
        data["Data"].MemoReplyList.forEach(item => {
          if (!groupedData[item.DateCategory]) {
            groupedData[item.DateCategory] = [];
          }
          groupedData[item.DateCategory].push(item);
        });
        // Creating JSON representation for each group
        const groupedJson = Object.keys(groupedData).map(key => {
          return {
            DateCategoryValue: key,
            DateCategoryJson: groupedData[key],
            DateCategorySort: groupedData[key][0].SortOrder
          };
        });

        // Sort the groupedJson array by DateCategorySort in descending order
        groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
        this.jsonData = groupedJson;
        this.jsonData.forEach(element => {
          element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
        });
        this.cdr.detectChanges();
      });


    // Assume this.jsonData is an array of elements with DateCategoryJson property
    for (const element of this.jsonData) {
      if (element.DateCategoryJson && element.DateCategoryJson.length > 0) {
        // Flatten all replies into a single array
        const allReplies = [...element.DateCategoryJson];

        // Sort the replies by Timestamp in descending order (latest first)
        allReplies.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

        // Select the latest reply
        const latestReply = allReplies[0];

        // If there's a latest reply, set the _ReplyId
        if (latestReply) {
          this._ReplyId = latestReply.ReplyId;
          break;
        }
      }
      console.log(this.jsonData, "Memodetails11111111111111111111");
    }
    //Calling  function to Projects from creative planner
    await this.MemoCreativePlannerProjects();
    await this.MemoHeaderDetailsV2();
    await this.ReplyDetailsV2(this._ReplyId);
    this.generateLink();
  }

  async MemoHeaderDetailsV2() {
    this._obj.MailId = this._MemoId;
    this._obj.ReplyId = this._ReplyId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    (await this.inboxService.MemoHeaderDetails(this._obj))
      .subscribe(data => {
        this._MemoHeaderDetails = data["Data"].HeaderJsonDetails
        console.log(this._MemoHeaderDetails, "Memoheader");
        this.LabelCount = this._MemoHeaderDetails[0].LabelCount;
        this.FavoriteVal = this._MemoHeaderDetails[0].Favorite;
        this._IsDeleted = this._MemoHeaderDetails[0].IsDelete;
        this.Pinval = this._MemoHeaderDetails[0].isPin;
        this.DMSPendingCount = this._MemoHeaderDetails[0].DMSPendingCount;
        this._subject = this._MemoHeaderDetails[0].MainSubject;
        this.MemoCreatedUserId = this._MemoHeaderDetails[0].MemoAdminId;
        this.Requestbutton = this._MemoHeaderDetails[0].UserRequest;
        this.IsConfidential = this._MemoHeaderDetails[0].IsConfidential;
        // alert(this.IsConfidential);
        this.FirstReplyId = this._MemoHeaderDetails[0].FirstReplyId;
        this._IsExists = this._MemoHeaderDetails[0].IsExists;
        this._ReplyUserExists = this._MemoHeaderDetails[0].ReplyUserExists;
        // alert(this._ReplyUserExists);
        console.log(this._MemoHeaderDetails, "MemoHead Deatils");
        if (this._MemoHeaderDetails[0].UserRequest == false) {
          this.Aftersendmessage = false;
          this.Requestbutton = false;
        }
        else if (this._MemoHeaderDetails[0].UserRequest == true) {
          this.Aftersendmessage = true;
          this.Requestbutton = true;
        }
        var userexist = this._MemoHeaderDetails[0].UserExists;
        if (userexist == false) {
          this._UserExistInMemo = false;
        }
        else if (userexist == true) {
          this._UserExistInMemo = true;
        }
        if (!this._UserExistInMemo) {
          this.Accessuser = this._MemoHeaderDetails[0].BasicMemoDetailsJson;
        }
        if (this._LoginUserId == this.MemoCreatedUserId) {
          this._MainSubjectOption = true;
        } else {
          this._MainSubjectOption = false;
        }
        this._AllUsersList = JSON.parse(this._MemoHeaderDetails[0].TotalUsersJson);
        this._AllUsersToList = JSON.parse(this._MemoHeaderDetails[0].TotalUsersJson);
        this._AllUsersCCList = JSON.parse(this._MemoHeaderDetails[0].TotalUsersJson);
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
            if (element.CreatedBy !== this._LoginUserId) {
              //rebinding CC in mat chip "this.selectedCCEmployees"
              this.selectedCCEmployees.push(element);
              //selected ids to pass on submit in memo reply
              this.selectedCCEmpIds.push(element.CreatedBy);
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
            console.log(this._disabledUsers, "disableusers");
          }
        });
        //end here

        //disabling New users if memo is confidential
        //start here
        // this._AllUsersToList = data["Data"]["TotalUsersJson"];
        if (this.IsConfidential && (this.MemoCreatedUserId != this._LoginUserId)) {
          this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users"));
          this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users"));
        }
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
      })
  }

  _IsWorkFlow: any;
  _WorkFlowJsonII: any[];
  _WorkFlowId: number;
  _GroupId: number;
  _ReplyWorkFlowSortId: number;
  _UserActionIsActive: any;
  async ReplyDetailsV2(replyid: number) {
    this._ReplyId = replyid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    (await this.inboxService.ReplyDetailsV2(replyid))
      .subscribe(data => {
        this._Details = data["Data"].ReplyDetailsJson;
        console.log(this._Details, "Reply Deatils");
        this.Dropdowntopsubject = this._Details[0].Subject;
        this.AprrovewithCommentsList = this._Details[0]['ActionUsers'];
        this.DocumentsHistoryList = this._Details[0]['DocumentsJsonII'].length;
        this.AddedUsersJson = this._Details[0]['AddedUsersJson'];
        this.SubjectHistoryJson = this._Details[0]['SubjectHistoryJson'];
        this.IsConfidentialReply = this._Details[0].IsConfidential;
        this.IsConfidential = this._Details[0].IsConfidential;
        this._IsWorkFlow = this._Details[0].IsWorkFlow;
        this._WorkFlowJsonII = this._Details[0]['WorkFlowJsonII'];
        console.log(this._WorkFlowJsonII ,"Right section list");
        if (this._WorkFlowJsonII.length > 0) {
          this.FileuploadRequired = this._WorkFlowJsonII.filter(x => x.UserId == this._LoginUserId).map(x => x.AttachmentRequired)[0];
        }
        else {
          this.FileuploadRequired = false;
        }
        this._WorkFlowId = this._Details[0].WorkFlowId;
        this._SortId = this._Details[0].SortId;
        this._GroupId = this._Details[0].GroupId;
        this._ReplyWorkFlowSortId = this._Details[0].ReplyWorkFlowSortId;
        this._UserActionIsActive = this._Details[0].UserActionIsActive;
        //  alert(this._UserActionIsActive);
        this._WorkFlowJsonII = this._WorkFlowJsonII.sort((a, b) => a.SortId - b.SortId);
        // alert(this.IsConfidentialReply);
        this._ApprovalStatus = this._Details[0].ApprovalStatus;
        // this._ReplyUserExists = this._Details.map(details => details.ReplyUserExists);
        this._ReplyUserExists = this._Details[0].ReplyUserExists;  // single boolean value
        // alert(this._ReplyUserExists);
        this._Bookmark = this._Details[0].IsBookmark == 1 ? true : false;
        this._MinutesDifference = this._Details[0].MinutesDifference;
        this._SecondsDifference = this._Details[0].SecondsDifference;
        if (this._Details[0].UserRequest == false) {
          this.Aftersendmessage = false;
          this.Requestbutton = false;
        }
        else if (this._Details[0].UserRequest == true) {
          this.Aftersendmessage = true;
          this.Requestbutton = true;
        }
        if (this._LoginUserId == this._Details[0].FromUserId) {
          this.ReplySubjecthide = true;
        } else {
          this.ReplySubjecthide = false;
        }
        console.log(this._Details, "details");
        this._ToUserMemo = this._Details[0].TOUsers;
        this._ToUserListDetails = this._ToUserMemo;
        console.log(this._ToUserListDetails, "View List User");
        let count = 0; // Initialize a counter variable
        this._ToUserListDetails.forEach(element => {
          if (element.IsExist && element.CreatedBy !== this._LoginUserId && element.UserActiveStatus === true) {
            count++; // Increment the counter if the condition is met
          }
        });

        this.TotalUserListDetails = count;

        this._ToUserMemo = this._ToUserMemo.filter(item => item.CreatedBy !== this._LoginUserId);
        this._ToUserMemo = this._ToUserMemo.filter(item => item.UserActiveStatus == true);
        // this._disabledUsers.push(this._ToUserMemo.filter(item => item.UserActiveStatus == false));
        this._CCUserListDetails = this._Details[0].CCUsers;
        console.log(this._CCUserListDetails, "CC User List");
        this._CCUserMemo = this._Details[0].CCUsers;
        this.TotalCCUserListDetails = this._CCUserMemo.length;
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
            if (this.ReplyType != 'Forward' && this.ReplyType != "إلى الأمام" && this.ReplyType != 'Reply' && this.ReplyType != 'رد' && this.ReplyType != 'New Topic' && this.ReplyType != "موضوع جديد") {
              this.selectedToEmployees.push(element);
              this.selectedToEmpIds.push(element.CreatedBy);
            }
            else {
              if (element.CreatedBy == this._Details[0].FromUserId) {
                if (this.ReplyType != 'Forward' && this.ReplyType != "إلى الأمام" && this.ReplyType != 'New Topic' && this.ReplyType != "موضوع جديد") {
                  this.selectedToEmployees.push(element);
                  this.selectedToEmpIds.push(element.CreatedBy);
                }
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
              if (element.CreatedBy !== this._LoginUserId && element.UserActiveStatus == true) {
                this.selectedCCEmployees.push(element);
                this.selectedCCEmpIds.push(element.CreatedBy);
              }
            }
          }
          else {
            this._disabledUsers.push(element.CreatedBy);
            // alert(this._disabledUsers);
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
        // console.log(this._AllUsersCCList,"Cc User issues");
        //end here
        console.log(this._AllUsersList, "Total user");

        this._AllUsersList.forEach(element => {
          if (((element.IsExist == 0 && element.UserGroup == "Memo Users") || element.UserActiveStatus === false) && (element.CreatedBy != this._LoginUserId)) {
            this._disabledUsers.push(element.CreatedBy);
          }
        });



        // c
        //end here


        //disabling New users if memo is confidential
        //start here
        // 
        // alert(this.IsConfidential);
        if (this.IsConfidentialReply && (this.MemoCreatedUserId != this._LoginUserId)) {
          this._disabledUsers.push(...this._AllUsersToList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
          this._disabledUsers.push(...this._AllUsersCCList.filter(user => user.UserGroup == "New Users").map(user => user.CreatedBy));
          // alert(this.IsConfidential);
        }

        // if (this._LoginUserId == this._Details[0].FromUserId) {
        //   if (this.timer) {
        //     this.timer.unsubscribe();
        //   }
        //   const _remaingMinutes = 15 - parseInt(this._MinutesDifference.toString());
        //   let duration = (60 * 15) - parseInt(this._SecondsDifference.toString()); //parseInt(_remaingMinutes.toString()) * 60; // 15 minutes in seconds
        //   this.timer = interval(1000).subscribe(() => {
        //     this.minutes = Math.floor(duration / 60);
        //     this.seconds = duration % 60;
        //     duration--;
        //     if (this.minutes < 0 && this.seconds < 0) {
        //       this.showButton = false;
        //       this.timer.unsubscribe();
        //       // Handle timer completion if needed
        //     } else {
        //       this.showButton = true;
        //     }
        //   });
        // } else {
        //   if (this.timer) {
        //     this.timer.unsubscribe();
        //   }
        //   this.showButton = false;
        // }

        if (this._LoginUserId == this._Details[0].FromUserId) {
          if (this.timer) {
            this.timer.unsubscribe();
          }

          const _remainingMinutes = 15 - parseInt(this._MinutesDifference.toString());
          let duration = (60 * 15) - parseInt(this._SecondsDifference.toString()); // total duration in seconds

          // Timer logic
          this.timer = interval(1000).subscribe(() => {
            this.minutes = Math.floor(duration / 60);
            this.seconds = duration % 60;
            duration--;

            // Ensure time is displayed correctly and handle timer end
            if (duration < 0) {
              // Delay hiding the button after the timer completes
              setTimeout(() => {
                this.showButton = false;  // Hide button after the delay
              }, 0); // Delay of 2 seconds (2000 milliseconds)

              this.timer.unsubscribe(); // Stop the timer
            } else {
              this.showButton = true; // Keep showing button while timer runs
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
        this._MemoDocuments = this._Details[0].DocumentsJson;
        // Remove any existing local storage item with the key 'AttachmentMemoId_<MemoId>'
        localStorage.removeItem('AttachmentMemoId_' + this._MemoId);

        // Generate an array with necessary properties from the documents
        const attachmentUrls = this._MemoDocuments.map((document: any) => ({
          url: document.message, // Assuming the URL is stored in the 'message' field
          MailDocId: document.MailDocId,
          FileName: document.FileName,
          ContentType: document.ContentType, // Optional, if you want to save this too
        }));

        // Save the generated attachment URLs to local storage as a JSON string
        localStorage.setItem('AttachmentMemoId_' + this._MemoId, JSON.stringify(attachmentUrls));

        if (this.ReplyType == 'Forward' || this.ReplyType == 'إلى الأمام' || this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          this._ForwardMemoDocuments = this._Details[0].DocumentsJson;
          console.log(this._ForwardMemoDocuments, "MailDocIds")
        } else if (this.ReplyType == 'Reply All' || this.ReplyType == 'Reply' || this.ReplyType == "الرد على الجميع" || this.ReplyType == 'رد') {
          // Assuming you want to clear or perform some specific action when ReplyType is 'Reply All' or 'Reply'
          // If you want to rebind some other data, replace the following line accordingly
          this._ForwardMemoDocuments = [];
        }
        this._MemoDocumentsCount = this._Details.length;

        if (this._Details[0].ReplyRequired == true || this._Details[0].ApprovalRequired == true) {
          this._tableRequired = true;
        }
        else {
          this._tableRequired = false;
        }
        this._IsHistory = this._Details[0].IsHistory;
        if (this._IsHistory == 0) {
          this._CurrectionSelectionIsHIstory = false;
        } else if (this._IsHistory == 1) {
          this._CurrectionSelectionIsHIstory = true;
        }
        if (this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          if (this._Details[0].ReplyRequired) {
            this.ReplyRequired = true;
          } else {
            this.ReplyRequired = false;
          }

          if (this._Details[0].ApprovalRequired) {
            this.ApprovalPending = true;
          } else {
            this.ApprovalPending = false;
          }

          if (this._Details[0].IsConfidentialReply) {
            this._IsConfidential = true;
          } else {
            this._IsConfidential = false;
          }
        }
        this._DraftId = this._Details[0].DraftId;
        this._Drafttext = this._Details[0]['DraftText'];
        if (this._Drafttext != "" && this.ReplyType != 'Forward' && this.ReplyType != 'إلى الأمام' && this.ReplyType != 'New Topic' && this.ReplyType != "موضوع جديد") {
          this.htmlContent = this._Drafttext;
        }
        if (this.ReplyType == 'Edit Reply' || this.ReplyType == 'تحرير الرد') {
          this.htmlContent = this._Details[0].Matter;
        }

        // Clear the existing content before adding the separator
        if (this.ReplyType == 'Forward' || this.ReplyType == "إلى الأمام") {
          // this.htmlContent = `<div><br><br><br><span>---------------------------------------------------------------------------</span></div>  ${this._Details[0].Matter}`;
          this.htmlContent = '<div><br><br><br><span>---------------------------------------------------------------------------</span></div>' + this._Details[0].Matter;
          console.log(this.htmlContent, "two lines");
        }

        if (this._Drafttext == '') {
          this._DraftColour = false;
        }
        else {
          this._DraftColour = true;
        }
        if (this._Details[0].DraftSubject == "" && this.ReplyType != 'New Topic' && this.ReplyType != "موضوع جديد") {
          this.SelectedSubject = this._Details[0].Subject;
        }
        else {
          this.SelectedSubject = this._Details[0].DraftSubject;
        }
        this._ApprovalMemoId = 0;
        this._ApprovalReplyId = replyid;



        // if (this._IsHistory == 0) {

        //   const commonActiveIdElement = this.el.nativeElement.querySelector('#hdnCommonActiveId');

        //   // Check if commonActiveIdElement is not null before accessing its value
        //   if (commonActiveIdElement) {
        //     const newValue = commonActiveIdElement.value;
        //     const newDivElement = this.el.nativeElement.querySelector(`#New_Div_${newValue}`);

        //     if (newDivElement) {
        //       newDivElement.classList.remove('active');

        //       const replyDivElement = this.el.nativeElement.querySelector(`#New_Div_${replyid}`);
        //       if (replyDivElement) {
        //         replyDivElement.classList.add('active');
        //         replyDivElement.classList.remove('new-m');
        //         commonActiveIdElement.value = replyid.toString();
        //       }
        //     }
        //   }
        // } else if (this._IsHistory == 1) {
        //   const commonActiveIdElement = this.el.nativeElement.querySelector('#hdnCommonActiveId');

        //   // Check if commonActiveIdElement is not null before accessing its value
        //   if (commonActiveIdElement) {
        //     const newValue = commonActiveIdElement.value;
        //     const newDivElement = this.el.nativeElement.querySelector(`#New_Div_${newValue}`);

        //     if (newDivElement) {
        //       newDivElement.classList.remove('active');

        //       const replyDivElement = this.el.nativeElement.querySelector(`#New_Div_${replyid}`);
        //       if (replyDivElement) {
        //         replyDivElement.classList.add('active');
        //         replyDivElement.classList.remove('unread');
        //         commonActiveIdElement.value = replyid.toString();
        //       }
        //     }
        //   }
        // }

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
              replyDivElement.classList.remove(this._IsHistory == 0 ? 'new-m' : 'unread');
              commonActiveIdElement.value = replyid.toString();
            }
          }

          // Ensure the last item is also marked as active if needed
          // const allDivElements = this.el.nativeElement.querySelectorAll('div[id^="New_Div_"]');
          // if (allDivElements.length > 0) {
          //   const lastDivElement = allDivElements[allDivElements.length - 1];
          //   lastDivElement.classList.add('active');
          // }
        }
        this.ViewMorethreadshide = false;
        this._ReplyParentDetailsJson = [];
        this.ReplyHistoryV2(this._ReplyId, false, 0);
        setTimeout(() => {
          this.initializeTippy();
        }, 500);
      })

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
    this._obj.CreatedBy = this.currentUserValue.createdby;
    (await this.inboxService.ReplyHistoryV2(this._obj))
      .subscribe(data => {
        // alert(data['Data']["ReplyHistoryJson"].length);
        this._ReplyParentDetailsJson = [...this._ReplyParentDetailsJson, ...data['Data']["ReplyHistoryJson"]];
        if (data['Data']["ReplyHistoryJson"].length == 0) {
          this.ViewMorethreadshide = true;
        }
        // this._ParentDisplayName = this._ReplyParentDetailsJson[0].ParentDisplayName;
        // this._Twoletter = this._ParentDisplayName.split(' ').map(word => word.charAt(0)).join('');

        // Check if _ReplyParentDetailsJson has at least one element
        if (this._ReplyParentDetailsJson.length > 0) {
          this._ParentDisplayName = this._ReplyParentDetailsJson[0].ParentDisplayName;
          this._Twoletter = this._ParentDisplayName.split(' ').map(word => word.charAt(0)).join('');
        }

      });
  }
  ReplyListPagination(IsAll: boolean) {
    this._obj.MailId = this._MemoId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.LastRowId = this.getLastRowReplyId(this.ReplyList).ReplyId;
    this._obj.LastReplyId = this.getLastReplyId(this.ReplyList).ReplyId;
    this._obj.Activity = this._Activity;
    this._obj.pageSize = 10;
    this._obj.IsAll = IsAll;
    this.inboxService.ReplyListPaginationV2(this._obj)
      .subscribe(data => {
        const jsonData = data["Data"].MemoReplyList;
        // this._LoadMoreLength = jsonData.length;
        this.ReplyList = this.updateOrAddReplies(this.ReplyList, jsonData);
        this.ReplyList = this.ReplyList.slice().sort((a, b) => new Date(b.CreatedDateTime).getTime() - new Date(a.CreatedDateTime).getTime());
        if (this.ReplyList[0].TotalRecords == this.ReplyList.length)
          this._LoadMoreLength = 0;
        else if (this.ReplyList[0].TotalRecords != this.ReplyList.length)
          this._LoadMoreLength = this.ReplyList.length;
        if (this.Pg_ReplyFilter_Date) {
          const groupedData = {};
          this.ReplyList.forEach(item => {
            if (!groupedData[item.DateCategory]) {
              groupedData[item.DateCategory] = [];
            }
            groupedData[item.DateCategory].push(item);
          });
          // Creating JSON representation for each group
          const groupedJson = Object.keys(groupedData).map(key => {
            return {
              DateCategoryValue: key,
              DateCategoryJson: groupedData[key],
              DateCategorySort: groupedData[key][0].SortOrder
            };
          });

          // Sort the groupedJson array by DateCategorySort in descending order
          groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
          this.jsonData = groupedJson;
        } else if (this.Pg_ReplyFilter_Subject) {
          const groupedData = {};
          this.ReplyList.forEach(item => {
            if (!groupedData[item.Title]) {
              groupedData[item.Title] = [];
            }
            groupedData[item.Title].push(item);
          });
          // Creating JSON representation for each group
          const groupedJson = Object.keys(groupedData).map(key => {
            return {
              DateCategoryValue: key,
              DateCategoryJson: groupedData[key],
              DateCategorySort: groupedData[key][0].SortOrder
            };
          });

          // Sort the groupedJson array by DateCategorySort in descending order
          groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
          this.jsonData = groupedJson;
        } else if (this.Pg_ReplyFilter_From) {
          const groupedData = {};
          this.ReplyList.forEach(item => {
            if (!groupedData[item.DisplayName]) {
              groupedData[item.DisplayName] = [];
            }
            groupedData[item.DisplayName].push(item);
          });
          // Creating JSON representation for each group
          const groupedJson = Object.keys(groupedData).map(key => {
            return {
              DateCategoryValue: key,
              DateCategoryJson: groupedData[key],
              DateCategorySort: groupedData[key][0].SortOrder
            };
          });

          // Sort the groupedJson array by DateCategorySort in descending order
          groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
          this.jsonData = groupedJson;
        }
        this.jsonData.forEach(element => {
          element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
        });
      })
  }

  updateOrAddReplies(array1, array2) {
    // Create a map from array1 for quick lookup
    const replyMap = new Map(array1.map(item => [item.ReplyId, item]));

    array2.forEach(item => {
      if (replyMap.has(item.ReplyId)) {
        // If replyid exists in array1, overwrite the value
        replyMap.set(item.ReplyId, item);
      } else {
        // If replyid does not exist in array1, add the new item
        replyMap.set(item.ReplyId, item);
      }
    });

    // Convert the map back to an array
    return Array.from(replyMap.values());
  }

  getLastRowReplyId(replyList) {
    if (!replyList || replyList.length === 0) {
      return null;
    }
    const filteredAndSorted = replyList.sort((a: any, b: any) => new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime());
    return filteredAndSorted[0];
  }
  getLastReplyId(replyList: any) {

    if (!replyList || replyList.length === 0) {
      return null;
    }
    const filteredAndSorted = replyList
      .filter((x: { IsHistory: number; IsCustomAttachment: number; }) => x.IsHistory === 0 || x.IsCustomAttachment === 1)
      .sort((a: any, b: any) => new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime());
    return filteredAndSorted[0];
  }

  ActivityToggle() {
    this._Activity = this._Activity == true ? false : true;
    if (this._Activity == false) {
      const hasReplyIdInHistory = this.jsonData.some(element =>
        element.DateCategoryJson.find(reply =>
          reply.IsHistory == "1" && reply.ReplyId == this._ReplyId
        )
      );
      if (hasReplyIdInHistory) {
        let latestReplyId = null;
        for (const element of this.jsonData) {
          const filteredReplies = element.DateCategoryJson.filter(rep => rep.IsHistory == 0 || rep.IsCustomAttachment == 1);
          if (filteredReplies.length > 0) {
            const lastReply = filteredReplies[0];
            this._ReplyId = lastReply.ReplyId;
            this.ReplyDetailsV2(this._ReplyId);
            break;
          }
        }
      }
    }
  }
  getReplyDataListCount(rfd: any): number {
    let _ReplyDataListlength = 0;
    if (this._Activity) {
      _ReplyDataListlength = rfd.DateCategoryJson.length;
    } else {
      _ReplyDataListlength = rfd.DateCategoryJson.filter((reply: any) => reply.IsHistory == 0 || reply.IsCustomAttachment == 1).length;
    }
    return _ReplyDataListlength;
  }

  gotoMemoDetailsV2(name, id, replyid) {
    // var url = document.baseURI + name;
    // var myurl = `${url}/${id}`;
    // window.location.href = myurl;

    // var url = document.baseURI + name;
    // var myurl = `${url}/${id}/${replyid}`;
    // //var myurl = `${url}`;
    // //this.router.navigate([myurl]);
    // var myWindow = window.open(myurl, id);
    // //var myWindow = window.open(myurl);
    // myWindow.focus();
    const url = `${document.baseURI + name}/${id}/${replyid}`;
    // this.router.navigate([url]);
    window.location.href = url;
  }

  NewTabV2(name, id, replyid) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id);
    //var myWindow = window.open(myurl);
    myWindow.focus();
  }

  // Header Method start here
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
        this.MemoHeaderDetailsV2()
      });
  }
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
        setTimeout(() => {
          this.initializeTippy();
        }, 500);
      }
    )
  }
  isMainReplyClick: boolean = false;
  ClickMainMemo(replyid) {
    this._ReplyId = replyid;
    setTimeout(() => {
      const targetElementId = `New_Div_${this._ReplyId}`;
      const targetElement = this.elementRef.nativeElement.querySelector(`#${targetElementId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
      }
    }, 1000);
    this.isMainReplyClick = true;
  }
  SubjectEdit(Subject, replyid) {
    this._ReplyId = replyid;
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
    this.isMainReplyClick = false;
  }
  updateSubject() {
    const updatedSubject = (<HTMLInputElement>document.getElementById("txtSubject")).value;
    // Check if the subject is within the character limit
    if (updatedSubject.length <= 250) {
      this.inboxService.UpdateSubject(this._MemoId, this._ReplyId, updatedSubject, this.currentUserValue.createdby).subscribe(
        data => {
          this._obj = data as InboxDTO;
          if (data["Data"].message == "1") {
            if (this.isMainReplyClick) {
              this._subject = updatedSubject;
            }
            this._Details[0].Subject = updatedSubject;
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
            //  this.ReplyListLeftSectionInitialLoadV2(this._MemoId, 1, 30);
            this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
              data => {
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
    const filteredList = this.ReplyList.filter(reply => reply.FromUserId !== this._LoginUserId);
    const sortedList = filteredList.sort((a, b) => b.CreatedDate.getTime() - a.CreatedDate.getTime());
    const latestReply = sortedList.length > 0 ? sortedList[0].ReplyId : null;
    this.inboxService.UnReadMemo(latestReply.toString(), false, this.currentUserValue.createdby).subscribe(
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
  // Header Method end here

  // Label Section Start
  Openlabels() {
    $('#Kt_labels').addClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this._obj.MailId = this._MemoId;
    this._obj.UserId = this._LoginUserId;
    this.inboxService.LabelsData(this._obj)
      .subscribe(data => {
        console.log(data, "Label list in memo details");
        this.SelectLabel = data["Data"];
        this.SelectLabel = this.SelectLabel["SelectedLabels"];
        this.LabelsJsondata = data["Data"];
        this.LabelsJsondata = this.LabelsJsondata["LabelList"];
      });
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
  removetag(labelid: number) {

    const MemoIdsArray: number[] = [];
    MemoIdsArray.push(this._MemoId);
    this.inboxService.RemoveMemoFromLabel(MemoIdsArray.toString(), labelid, this.currentUserValue.createdby).subscribe(
      data => {
        console.log(data, "Remove Label");
        this._obj = data as InboxDTO;
        if (this.LabelCount > 0) {
          this.LabelCount -= 1; // Decrement by 1
        }

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

        // this.MemoDetails(this._MemoId);
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
  Closelabels() {
    this.SelectedLabelIds = [];
    this.AddLabelList = [];
    this.LabelUserErrorLog = false;
    $('#Kt_labels').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
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

          this.cdr.detectChanges();
          // this.label = ""
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
  // Label Mat dropdown start
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
  filterAddLabel(input: string): void {
    this.isSelectionAddLabel = true;
    this.SubLabelList = this.LabelsJsondata.filter((label) =>
      label.LabelName.toLowerCase().includes(input.toLowerCase())
    );
  }
  OpenAddLabel() {
    this.SubLabelList = this.LabelsJsondata;
    this.isSelection_AddLabel = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).focus()
  }
  openAutocompleteDrpDwnAddLabel(OpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnAddLabel(CloseOpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  closePanelAddLabel() {
    this.isSelectionAddLabel = false;
    this.isSelection_AddLabel = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }
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
  // Label Mat dropdown end
  // Label Section End

  // User Section Action start
  ViewUsersDiv(memoid: number) {

    const lang: any = localStorage.getItem('language');
    this.ListofuserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.SelectUsersfromhere = lang === 'en' ? 'Select Users from here' : 'حدد المستخدمين من هنا';
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.organizationid = this.currentUserValue.organizationid;
    this.inboxService.UsersListForAdd(memoid).subscribe(
      res => {
        this._UsersList = res["Data"];
        this._UsersList = this._UsersList["UsersJson"];
        this._UserListSubList = this._UsersList;
        this._ExistingUsersMemo = res["Data"]["ExistingUserList"];
        console.log(this._ExistingUsersMemo, "List of user");
        this._ExistingUser = this._ExistingUsersMemo;
        this.MemoCreatedUserName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.DisplayName;
        this.MemoCreatedUser_Staus = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.UserActiveStatus;
        this.MemoCreatedUserCompanyName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.CompanyName;
        this.MemoCreatedUserDesignationName = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.DesignationName;
        this.MemoCreatedUserProfile = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.UserProfile;
        this.MemoCreatedUsersince = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.FormattedDaysSince;
        this.MemoCreatedUsertotalreplys = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.TotalRepliesCount;
        this.SentCount = this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.ReplyCount;

        this.Receivecount = Number(this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.SubMemoCCCount) +
          Number(this._ExistingUsersMemo.find(x => x.CreatedBy === this.MemoCreatedUserId)?.SubMemoCount);


        this.DMSRequestJson = res["Data"]["DMSRequestJson"];
        console.log(this.DMSRequestJson, "DMS Request Users");
        this._ReplyJson = res["Data"]["ReplyJson"];
        this._ReplyJsonBinding = this._ReplyJson;
        this.TotalSelectedReplies = this._ReplyJsonBinding.length;
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
  ListofUserSearch() {
    this.ListUsersearch = "";
  }
  Addremoveuser(userid: number, _value: boolean) {
    this.inboxService.RemoveMemoUser(this._MemoId, userid, this.currentUserValue.createdby, _value).subscribe(
      data => {
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
          this._snackBar.open(_msg, 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          //window.close();
          // this.ReplyListMemoDetailsV2(this._MemoId);
          // this.MemoDetails(this._MemoId);
          this.ViewUsersDiv(this._MemoId);
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
            data => {
            })
        }
      }
    )
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
  filterAddUsers(input: string): void {
    this.isSelectionAddUser = true;
    this._UserListSubList = this._UsersList.filter((User) =>
      User.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }
  closePanelAddusers() {
    this.isSelectionAddUser = false;
    this.isSelection_AddUsers = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }
  openAutocompleteDrpDwnAddUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  OpenAddUsers() {
    this._ExistingUser = this._IsActiveExistinguser;
    this.isSelection_AddUsers = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).focus()
  }
  closeAutocompleteDrpDwnAddUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
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
      Swal.fire({
        title: "Are you sure? ",
        html: `Do you want to add user(s) in <strong>${this.TotalSelectedReplies}</strong> reply(s)`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm "
      }).then((result) => {
        if (result.isConfirmed) {
          // API call is made only if the user confirms the action
          this.newmemoService.AddExtraUser(this._obj, filteredReplyIds.toString()).subscribe(
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

              this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger, res["Data"].NewRepliesTrigger).subscribe(
                res => {
                });
              // this.ReplyListMemoDetailsV2(this._MemoId);          
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
              this.ReplyDetailsV2(this._ReplyId);
              this.Adduserclearfeilds();
            }
          );
        }
      });
    }
  }

  Adduserclearfeilds() {
    $("#Selected_All").prop("checked", true);
    $('#add_users').removeClass('active');
    this.IsToUsers = true;
    this.UserComments = "";
    this.AddNewUserValues = [];
    this.SelectedUserIds = [];
    this.AddUserErrorLog = false;
    (<HTMLInputElement>document.getElementById("hdnMoreUsersId")).value = "0";
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
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
        this.DMSPendingCount = this.DMSPendingCount - 1;
        // this.MemoDetails(this._MemoId);
      })
    $('#users_reqs').removeClass('active');
    this.ReplyDetailsV2(this._ReplyId);
  }
  MemoRequestTitle(LastReplyId) {
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
  // User Section Action end

  // Merge Section Start
  SubjectSelectRightInMerge(event) {
    this._SubjectLeftList = this._AllSubjectList.filter(function (item) {
      return item.Subject != event;
    });
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
  SubjectMerge() {
    this._obj.MergeSubject = this.RightSubjectSelected.toString();
    this._obj.MailId = this._MemoId;
    this._obj.PreviousSubject = this.LeftSubjectSelected.toString();
    this.jsonData.forEach(element => {
      element.DateCategoryJson.forEach(_rep => {
        if (_rep.IsHistory == 0 && (_rep.Title == this.LeftSubjectSelected)) {
          this.ReplyIds.push(_rep.ReplyId)
        }
      });
    });
    this._obj.ReplyIds = this.ReplyIds.toString();
    this._obj.UserId = this.currentUserValue.createdby;
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
      this.ReplyListLeftSectionInitialLoadV2(this._MemoId, 1, 30);
      (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
      // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
      document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    });
    this.LeftSubjectSelected = null;
    this.RightSubjectSelected = null;
  }
  async SubjectListForMerge() {
    try {
      const data = await this.inboxService.SubjectList(this._MemoId).toPromise();
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
  ViewMergeDiv() {
    this.RightSubjectSelected = this.Dropdowntopsubject;
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.SubjectListForMerge();
  }
  ClosemergePanel() {
    this.RightSubjectSelected = null;
    this.LeftSubjectSelected = null;
    (<HTMLInputElement>document.getElementById("Kt_merge_Memo")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnReplyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  // Merge Section end

  // Memo History List start
  HistoryList(memoid: number) {
    (<HTMLInputElement>document.getElementById("kt_chat_panel1")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.memoreplyService.HistoryList(memoid)
      .subscribe(data => {
        // console.log(data,"History section");
        this.AttachmentList = data['Data'];
        this.AttachmentList = this.AttachmentList['HistoryJson'];
           console.log(this.AttachmentList,"Attachment list");
        // this.AttachmentList.forEach(element => {
        //   element.AttachmentJson = JSON.parse(element.AttachmentJson);
        // });

        this.AttachmentList.forEach(element => {
          // Check if AttachmentJson exists and is a valid string
          if (element.AttachmentJson) {
            try {
              element.AttachmentJson = JSON.parse(element.AttachmentJson);
            } catch (error) {
              console.error('Invalid JSON:', element.AttachmentJson, error);
              element.AttachmentJson = []; // Assign a fallback value
            }
          } else {
            element.AttachmentJson = []; // Assign a fallback value if undefined
          }
        });
      });
  }
  LoadDocument(url1: string, filename: string, MailDocId: number) {

    let name = "Memo/ArchiveView";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let url = encoder.encode(url1);

    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    filename = filename.replace(/%/g, "%25");
    filename = filename.replace(/#/g, "%23");
    filename = filename.replace(/&/g, "%26");


    // var myurl = `${rurl}/url?url=${url}&uid=${encodeduserid}&filename=${filename}&type=1&MailDocId=${MailDocId}&MailId=${this._MemoId}&ReplyId=${this._ReplyId}&LoginUserId=${this._LoginUserId}&IsConfidential=${this._IsConfidential}&AnnouncementDocId=0`;


    var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + encoder.encode(filename) + "&type=1" + "&" + "MailDocId=" + MailDocId + "&" + "MailId=" + this._MemoId + "&" + "ReplyId=" + this._ReplyId + "&" + "LoginUserId=" + this._LoginUserId + "&" + "IsConfidential=" + this.IsConfidential + "&" + "AnnouncementDocId=" + 0;
    var myWindow = window.open(myurl, url.toString());
    myWindow.focus();

  }



  // Memo History List end

  // Attachment List Start
  QuickUploaddiv() {
    let lang: any = localStorage.getItem('language');
    this.SelectCategoryfromhere = lang === 'en' ? 'Select Category from here....' : 'اختر الفئة من هنا.....';
    this.SelectUsersfromheres = lang === 'en' ? 'Select Users from here' : 'حدد المستخدمين من هنا';
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.organizationid = this.currentUserValue.organizationid;
    this.inboxService.UsersListForAdd(this._MemoId).subscribe(
      res => {
        this._ExistingUsersMemo = res["Data"]["ExistingUserList"];
        this._IsActiveExistinguser = this._ExistingUsersMemo.filter(item => item.IsExist === true && item.CreatedBy != this._LoginUserId);
      });
    this.Attachmentshide = false;
    this.AttachmentsErrorlog = false;
    $('#attach_main').hide();
    $('#quik-upload').show();
    $('#quik-btn').hide();
    $('#atchvw-btn').removeClass('d-none');
  }
  ViewAttachmentsDiv(memoid: number) {
    this._obj.UserId = this._LoginUserId;
    this._obj.SortType = this.SortType;
    this.memoreplyService.AttachmentList(memoid, this._obj)
      .subscribe(data => {
        this.DocumentList = data["Data"]["AttachmentJson"];
        console.log(this.DocumentList, "Document list url");
        this.Attachementcount = 0;
        this.DocumentList.forEach(element => {
          this.Attachementcount = JSON.parse(element.JsonData).length + this.Attachementcount;
          // const attachmentCount = this.Attachementcount; // Replace with your actual attachment count
          // localStorage.setItem('attachmentCount', JSON.stringify(attachmentCount));
        });
        localStorage.removeItem('AttachmentMemoId_' + this._MemoId);
        const attachmentUrls = this.DocumentList.reduce((urls, item) => {
          return urls.concat(item.AttachmentJson.map(attachment => ({
            url: attachment.AttachmentUrl,
            MailDocId: attachment.MailDocId,
            FileName: attachment.FileName
          })));
        }, []);
        // Save to local storage
        localStorage.setItem('AttachmentMemoId_' + this._MemoId, JSON.stringify(attachmentUrls));
      });

    (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.add("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + memoid)).value = "1";
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  AttachmentSearchClearData() {
    this.SearchTxt = "";
    this.ViewAttachmentsDiv(this._MemoId);
  }
  CustomUploadValueClear() {
    this.FileUploadErrorlogss = false;
    this.CategoryErrorlog = false;
    this.AttachmentErrorlog = false;
    this.Attachmentshide = true;
    this.selectedCategory = "";
    this.selectedEmpIds = [];
    this.myFilesAtt = [];
    this._Comments = "";
    this.AttachmentFileuplod = [];
    this.cloudfiles = [];
    this.selectedUsers = [];
    this.ICustomUpload.forEach(element => {
      element.isChecked = false;
    });
    (<HTMLInputElement>document.getElementById("fileUploadDU")).value = "";
    //     const fileUploadElement = document.getElementById("fileUploadDU") as HTMLInputElement;
    // if (fileUploadElement) {
    //     fileUploadElement.value = "";
    // } else {
    //     console.error("Element with ID 'fileUploadDU' not found.");
    // }
    // (<HTMLInputElement>document.getElementById("fileuploadtextDUV")).innerHTML = "Choose file";
    $('#quik-upload').hide();
    $('#attach_main').show();
    $('#atchvw-btn').addClass('d-none');
    $('#quik-btn').show();
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
  RemoveCategory(): void {
    this.selectedCategory = "";
    this.ICustomUpload.forEach(element => {
      element.isChecked = false;
    });
    this.CategoryErrorlog = true;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }
  SelectedCategory(category: MatAutocompleteSelectedEvent): void {
    // const _selectCate = this.ICustomUpload.find(user => user.CategoryId === category.option.value).CategoryName;
    // this.selectedCategory = this.selectedCategory === _selectCate ? '' : _selectCate;
    // this.ICustomUpload.forEach(element => {
    //   element.isChecked = element.CategoryId === category.option.value && this.selectedCategory != '' ? true : false;
    // });
    // this.CategoryErrorlog = false;
    // this.isSelectionCatarryArry = false;
    const _selectCate = this.ICustomUpload.find(user => user.CategoryId === category.option.value)?.CategoryName || '';
    this.selectedCategory = this.selectedCategory === _selectCate ? '' : _selectCate;
    this.ICustomUpload.forEach(element => {
      element.isChecked = element.CategoryId === category.option.value && this.selectedCategory !== '' ? true : false;
    });
    this.CategoryErrorlog = false;
    this.isSelectionCatarryArry = false;

  }
  isSelectedCategory(category: MatAutocompleteSelectedEvent): boolean {
    return this.selectedCategory.includes(category.option.value);
  }
  openAutocompleteDrpDwnCategory(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCategory(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  filterCategory(input: string): void {
    this.isSelectionCat = true;
    this.Catarry = this.ICustomUpload.filter((category) =>
      category.CategoryName.toLowerCase().includes(input.toLowerCase())
    );
  }
  AddCategory() {
    this.Catarry = this.ICustomUpload;
    console.log(this.ICustomUpload, "Cater list");
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

  FileUploadErrorlogss:boolean = false;
  onFileChangeAtt(event) {
    // this.myFilesAtt = [];
    // this.AttachmentErrorlog = false;
    // if (event.target.files.length > 0) {
    //   var length = event.target.files.length;
    //   for (let index = 0; index < length; index++) {
    //     const file = event.target.files[index];
    //     var contentType = file.type;
    //     if (contentType === "application/pdf") {
    //       contentType = ".pdf";
    //     }
    //     else if (contentType === "image/png") {
    //       contentType = ".png";
    //     }
    //     else if (contentType === "image/jpeg") {
    //       contentType = ".jpeg";
    //     }
    //     else if (contentType === "image/jpg") {
    //       contentType = ".jpg";
    //     }
    //     this.myFilesAtt.push(event.target.files[index].name);

    //     var d = new Date().valueOf();
    //     this.AttachmentFileuplod = [...this.AttachmentFileuplod, {
    //       UniqueId: d,
    //       FileName: event.target.files[index].name,
    //       Size: event.target.files[index].size,
    //       Files: event.target.files[index]
    //     }];
    //   }
    // }
    // $('#File_popCUS').removeClass('show');
    const files = Array.from(event.target.files) as File[]; // Type assertion to File[]
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]; // Now TypeScript knows 'file' is of type 'File'
        const contentType = this.QuickgetFileExtension(file.type);
        const fileSizeInKB = Math.round(file.size / 1024);

        // Check if the file size is 0 KB
        if (fileSizeInKB === 0) {
          this.FileUploadErrorlogss = true; // Show error message
          console.log('The uploaded file is 0kb. Please upload a larger file.');
          continue; // Skip this file
        }
        // Check if the file is already in the array to avoid duplicates
        const existingFile = this.AttachmentFileuplod.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );

        if (!existingFile) {
          const uniqueId = new Date().valueOf() + index; // Ensure unique ID
          this.AttachmentFileuplod.push({
            UniqueId: uniqueId,
            FileName: file.name,
            Size: file.size,
            Files: file,
          });
        }
      }

      console.log(this.AttachmentFileuplod, "Files");
      $('#File_popCUS').removeClass('show');
      // Clear the input to allow re-uploading of the same file
      event.target.value = '';
    }
  }

  RemoveSelectedFileDrp(_id) {
    // var removeIndex = this.AttachmentFileuplod.map(function (item) { return item.UniqueId; }).indexOf(_id);
    // this.AttachmentFileuplod.splice(removeIndex, 1);
    const removeIndex = this.AttachmentFileuplod.findIndex(
      (item) => item.UniqueId === _id
    );
    if (removeIndex !== -1) {
      this.AttachmentFileuplod.splice(removeIndex, 1);
    }
    (<HTMLInputElement>document.getElementById("fileUploadDU")).value = "";
    if (this.AttachmentFileuplod == null || this.AttachmentFileuplod == undefined) {
      this.AttachmentsErrorlog = false;
    } else {
      this.AttachmentsErrorlog = true;
    }

  }


  ClosefileErrorlogs(){
    this.FileUploadErrorlogss = false;
  }

  QuickgetFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return '.pdf';
      case 'image/png':
        return '.png';
      case 'image/jpeg':
        return '.jpeg';
      case 'image/jpg':
        return '.jpg';
      default:
        return mimeType;
    }
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
  openAutocompleteDrpDwn(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwn(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  closePanelusers() {
    this.isSelectionuser = false;
    this.isSelection_Users = false;
    (<HTMLInputElement>document.getElementById("txtsearchUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel

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
    }
    // this.fruitInput.nativeElement.value = '';
    this._ExistingUser = this._IsActiveExistinguser;
    this.isSelection_Users = false;
  }
  isSelecteduser(employee: any): boolean {
    return this.selectedUsers.some((emp) => emp.CreatedBy === employee.CreatedBy);
  }

  CustomUpload() {
    var MailId = parseInt((<HTMLInputElement>document.getElementById("hdnMainId")).value);
    if (!this.AttachmentFileuplod || this.AttachmentFileuplod.length === 0
    ) {
      this.AttachmentErrorlog = true;
      this.FileUploadErrorlogss = true;
    }
    const frmData = new FormData();
    for (var i = 0; i < this.AttachmentFileuplod.length; i++) {
      frmData.append("files", this.AttachmentFileuplod[i].Files);
    }
    if (this.AttachmentFileuplod.length === 0) {
      frmData.append("files", JSON.stringify([]))
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
        this._obj = res as InboxDTO;
        frmData.append("MailId", MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "false");
        frmData.append("ReplyId", res["Data"].ReplyId);
        const cloudFilesJson = JSON.stringify(this.cloudfiles);
        frmData.append("cloudFiles", cloudFilesJson);

        this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
          .catch(err => console.log('Error while connect with server'));
        this.receiveReplyConnectionBuilder.start().then(() => console.log('Connection started.......!'))
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
                this.ViewAttachmentsDiv(this._MemoId);
                this.CustomUploadValueClear();
                setTimeout(() => {
                  this.progressbar = 0;
                }, 1500);
                this.isModalOpen = false; // Close the modal temporarily
                setTimeout(() => {
                  this.isModalOpen = true; // Reopen the modal, which triggers component reloading
                  this.gacArchivingService.reloadComponent();
                }, 100);
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


  CloseAttachmentsPanel() {
    this.selectedUsers = [];
    this.AttachmentsSort(1);
    this.CustomUploadValueClear();
    (<HTMLInputElement>document.getElementById("Kt_more_AttachmentLists")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnAttachmentDmyId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }



  CloseUserlistPanel() {
    this.AddUserErrorLog = false;
    $('#add_users').removeClass('active');
    $('#users_reqs').removeClass('active');
    (<HTMLInputElement>document.getElementById("kt_User_list")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnUsersList_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }




  featuremodel() {
    document.getElementById("newfeatures").style.display = "block";
    document.getElementById("newfeatures").style.overflow = "auto";
    document.getElementById("feature-modal-backdrop").classList.add("show");
  }


  SearchChange(searchText: string): void {
    this.showLoadMoreButton = searchText.trim() === '';
  }

  Rebinding(_ReplyId) {
    this.ReplyListSearch = "";
    this._ReplyId = _ReplyId
    this.ReloadReplyList(1, 5);
    // this.showLoadMoreButton = true;
    // this.Usericon = false;
  }

  Replyfilteruserchangeevent(DisplayName) {
    this.ReplyListSearch = DisplayName;
    this.selectedUserDisplayName = DisplayName;
    // alert(this.selectedUserDisplayName);
  }



  ReplyFiltersV2() {
    this._obj.MailId = this._MemoId;
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.ReplyId = this._ReplyId;
    this._obj.ReplyFilter_Unread = this.Pg_ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = this.Pg_ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = this.Pg_ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_ByMe = this.Pg_ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = this.Pg_ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = this.ReplyFilter_ByMeWithActions;
    this._obj.ReplyFilter_Bookmarks = this.ReplyFilter_Bookmarks;
    this._obj.lastCreatedDate = null;
    if (this.ReplyList.length > 0) {
      // Sort the array in ascending order based on someProperty
      const sortedArray = this.ReplyList.slice().sort((a, b) => new Date(a.CreatedDateTime).getTime() - new Date(b.CreatedDateTime).getTime());
      // Get the top 1 item (the first item after sorting)
      // const topItem
      this._obj.lastCreatedDate = sortedArray[0].CreatedDateTime;
      // this._obj.lastCreatedDate = _pagenumber == 0 ? null : topItem;
    }
    this.inboxService.ReplyFiltersV2(this._obj).subscribe(data => {
      this.ReplyList = data["Data"].MemoReplyList;
      // if (this.ReplyList.length > 0) {
      //   if (this.ReplyList[0].TotalRecords == this.ReplyList.length)
      //     this._LoadMoreLength = 0;
      //   else if (this.ReplyList[0].TotalRecords != this.ReplyList.length)
      //     this._LoadMoreLength = this.ReplyList.length;
      // }
      const groupedData = {};
      data["Data"].MemoReplyList.forEach(item => {
        if (!groupedData[item.DateCategory]) {
          groupedData[item.DateCategory] = [];
        }
        groupedData[item.DateCategory].push(item);
      });
      // Creating JSON representation for each group
      const groupedJson = Object.keys(groupedData).map(key => {
        return {
          DateCategoryValue: key,
          DateCategoryJson: groupedData[key],
          DateCategorySort: groupedData[key][0].SortOrder
        };
      });

      // Sort the groupedJson array by DateCategorySort in descending order
      groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
      this.jsonData = groupedJson;
      this.jsonData.forEach(element => {
        element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });

      // Assume this.jsonData is an array of elements with DateCategoryJson property
      for (const element of this.jsonData) {
        if (element.DateCategoryJson && element.DateCategoryJson.length > 0) {
          // Flatten all replies into a single array
          const allReplies = [...element.DateCategoryJson];

          // Sort the replies by Timestamp in descending order (latest first)
          allReplies.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

          // Select the latest reply
          const latestReply = allReplies[0];

          // If there's a latest reply, set the _ReplyId
          if (latestReply) {
            this._ReplyId = latestReply.ReplyId;
            break;
          }
        }
      }
      this.ReplyDetailsV2(this._ReplyId);
      this.cdr.detectChanges();
    })
  }

  ReplyFilters(_val) {
    $('.drop-ul button.active1').removeClass('active1');
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    if (_val == 1) {
      this.Pg_ReplyFilter_AllMain = true;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = false;
      $('.filter-dot').addClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyListLeftSectionInitialLoadV2(this._MemoId, 1, 30);
    } else if (_val == 2) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = true;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 3) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = true;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 4) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = true;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 8) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = true;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 9) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = true;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 10) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = true;
      this.ReplyFilter_Bookmarks = false;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    } else if (_val == 11) {
      this.Pg_ReplyFilter_AllMain = false;
      this.Pg_ReplyFilter_Unread = false;
      this.Pg_ReplyFilter_Approval = false;
      this.Pg_ReplyFilter_ReplyRrquired = false;
      this.Pg_ReplyFilter_ByMe = false;
      this.Pg_ReplyFilter_Attachment = false;
      this.ReplyFilter_ByMeWithActions = false;
      this.ReplyFilter_Bookmarks = true;
      this.ReplyFilter = true;
      $('.filter-dot').removeClass('filter-no-dot');
      this.Usericon = false;
      this.ReplyFiltersV2();
    }
    if (this.Pg_ReplyFilter_Date == true) {
      (<HTMLInputElement>document.getElementById("btn5")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_Subject == true) {
      (<HTMLInputElement>document.getElementById("btn6")).classList.add("active1");
    }
    if (this.Pg_ReplyFilter_From == true) {
      (<HTMLInputElement>document.getElementById("btn7")).classList.add("active1");
    }
  }

  ReplySort(_val) {
    $('.drop-ul button.active1').removeClass('active1');
    (<HTMLInputElement>document.getElementById("btn" + _val)).classList.add("active1");
    if (_val == 5) {

      this.Pg_ReplyFilter_Date = true;
      this.Pg_ReplyFilter_Subject = false;
      this.Pg_ReplyFilter_From = false;
      this.Usericon = false;
      $('.filter-dot').addClass('filter-no-dot');

      const groupedData = {};
      this.ReplyList.forEach(item => {
        if (!groupedData[item.DateCategory]) {
          groupedData[item.DateCategory] = [];
        }
        groupedData[item.DateCategory].push(item);
      });
      // Creating JSON representation for each group
      const groupedJson = Object.keys(groupedData).map(key => {
        return {
          DateCategoryValue: key,
          DateCategoryJson: groupedData[key],
          DateCategorySort: groupedData[key][0].SortOrder
        };
      });

      // Sort the groupedJson array by DateCategorySort in descending order
      groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
      this.jsonData = groupedJson;
      this.jsonData.forEach(element => {
        element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });
      this.cdr.detectChanges();
    } else if (_val == 6) {
      this.Pg_ReplyFilter_Date = false;
      this.Pg_ReplyFilter_Subject = true;
      this.Pg_ReplyFilter_From = false;
      this.Usericon = false;
      $('.filter-dot').removeClass('filter-no-dot');

      const groupedData = {};
      this.ReplyList.forEach(item => {
        if (!groupedData[item.Title]) {
          groupedData[item.Title] = [];
        }
        groupedData[item.Title].push(item);
      });
      // Creating JSON representation for each group
      const groupedJson = Object.keys(groupedData).map(key => {
        return {
          DateCategoryValue: key,
          DateCategoryJson: groupedData[key],
          DateCategorySort: groupedData[key][0].SortOrder
        };
      });

      // Sort the groupedJson array by DateCategorySort in descending order
      groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
      this.jsonData = groupedJson;
      this.jsonData.forEach(element => {
        element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });

      this.cdr.detectChanges();
      this.callAnotherMethod();
    } else if (_val == 7) {
      this.Pg_ReplyFilter_Date = false;
      this.Pg_ReplyFilter_Subject = false;
      this.Pg_ReplyFilter_From = true;
      this.Usericon = true;
      $('.filter-dot').removeClass('filter-no-dot');
      const groupedData = {};
      this.ReplyList.forEach(item => {
        if (!groupedData[item.DisplayName]) {
          groupedData[item.DisplayName] = [];
        }
        groupedData[item.DisplayName].push(item);
      });
      // Creating JSON representation for each group
      const groupedJson = Object.keys(groupedData).map(key => {
        return {
          DateCategoryValue: key,
          DateCategoryJson: groupedData[key],
          DateCategorySort: groupedData[key][0].SortOrder
        };
      });
      // Sort the groupedJson array by DateCategorySort in descending order
      groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
      this.jsonData = groupedJson;
      this.jsonData.forEach(element => {
        element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
      });
      this.jsonData.forEach(element => {
        this.ReplyUserList = element.DateCategoryJson
      });
      this.cdr.detectChanges();
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
  }


  CheckJsonCount(rfd): number {


    let _ReplyDataListlength = 0;
    if (this._Activity) {
      _ReplyDataListlength = rfd.DateCategoryJson.length;
    } else {
      _ReplyDataListlength = rfd.DateCategoryJson.filter((reply: any) => reply.IsHistory == 0 || reply.IsCustomAttachment == 1).length;
    }

    return _ReplyDataListlength;
  }

  ReloadReplyList(_val, _val1) {
    this._obj = new InboxDTO();
    setTimeout(() => {
      this.initializeTippy();
    }, 500);
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
    (<HTMLInputElement>document.getElementById("btn" + _val1)).classList.add("active1");
    this.Pg_ReplyFilter_Date = true;
    this.Pg_ReplyFilter_Subject = false;
    this.Pg_ReplyFilter_From = false;
    this.ReplyFilter_Bookmarks = false;
    this.Usericon = false;
    (<HTMLInputElement>document.getElementById("btn1")).classList.add("active1");
    this.ReplyListSearch = "";
    $('.filter-dot').addClass('filter-no-dot');
    this.ReplyFilter = false;
    this.showLoadMoreButton = true;
    this._StartDate = null;
    this._EndDate = null;
    this.cdr.detectChanges();
    this.ReplyListLeftSectionInitialLoadV2(this._MemoId, 1, 30);
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

  OpenEPProject(Project_Code) {
    const Url = "https://cswebapps.com/creativeplanner/Details/" + Project_Code;
    window.open(Url);
  }

  addCustomUplpadDTO(CategoryName: string, CategoryId: number, isChecked: boolean) {
    const newUser: ICustomUpload = { CategoryName, CategoryId, isChecked };
    this.ICustomUpload.push(newUser);
  }

  async MemoCreativePlannerProjects() {

    //Calling Creative Planner API for Project List
    //Start here
    this.ICustomUpload = [];
    (await this.outsourceService.ProjectListByMemoId(this._MemoId))
      .subscribe(async data => {
        console.log(data, "ep");
        this._outsourceobj = data as Outsourcedto;
        var _epProjects = JSON.parse(this._outsourceobj[0].JsonData);
        this._EPProjects = _epProjects;
        console.log(this._EPProjects, "EP project data");
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
    // (<HTMLInputElement>document.getElementById("hdnEPId_" + this._MemoId)).value = "0";
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  CloseQuickPanel1() {
    (<HTMLInputElement>document.getElementById("kt_chat_panel1")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  // Right Section Method Start here
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
  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
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
        }
        this._Bookmark = this._Bookmark == true ? false : true;
        outerLoop: for (let element of this.jsonData) {
          for (let elementII of element.DateCategoryJson) {
            if (elementII.ReplyId == this._ReplyId) {
              elementII.IsBookmark = elementII.IsBookmark == 1 ? 0 : 1;
              break outerLoop;
            }
          }
        }
        this.cdr.detectChanges();
      }
    )
    setTimeout(() => {
      this.initializeTippy();
    }, 500);

  }

  ViewReplyDiv_Updated(memoid: number, typeid: number) {
    if (this.MemoDetailsV2Component.editorInstance) {
      this.MemoDetailsV2Component.editorInstance.editing.view.focus();
    }
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
      this.FileUploadErrorlogs = false;
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      if (this.IsConfidential == true) {
        this._IsConfidential = this.IsConfidential;
      } else {
        this._IsConfidential = false;
      }
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
      this.FileUploadErrorlogs = false;
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      // this._IsConfidential = false;
      if (this.IsConfidential == true) {
        this._IsConfidential = this.IsConfidential;
      } else {
        this._IsConfidential = false;
      }
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
      this.FileUploadErrorlogs = false;
      this.ReplyRequired = false;
      this.ApprovalPending = false;
      // this._IsConfidential = false;
      if (this.IsConfidential == true) {
        this._IsConfidential = this.IsConfidential;
      } else {
        this._IsConfidential = false;
      }
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
      this.FileUploadErrorlogs = false;
      this.Replybutton = false;
      this.cdr.detectChanges();
    } else if (typeid == 5) {
      const lang: any = localStorage.getItem('language');
      if (lang == 'en') {
        this.ReplyType = "New Topic";
        this.Replybutton = true;
        this.ReplyRequired = false;
        this.ApprovalPending = false;
        this._lstMultipleFiales = [];
        this.FileUploadErrorlogs = false;
      } else if (lang == 'ar') {
        this.ReplyType = "موضوع جديد";
        this.Replybutton = true;
        this.ReplyRequired = false;
        this.ApprovalPending = false;
        this._lstMultipleFiales = [];
        this.FileUploadErrorlogs = false;
        this.cdr.detectChanges();
      }
    } else if (typeid == 6) {
      this.WorkflowDropdownlist();
      const lang: any = localStorage.getItem('language');
      if (lang == 'en') {
        this.ReplyType = "Workflow";
        this.Replybutton = true;
        this.ReplyRequired = false;
        this.ApprovalPending = false;
        this._lstMultipleFiales = [];
        this.FileUploadErrorlogs = false;
      } else if (lang == 'ar') {
        this.ReplyType = "سير العمل";
        this.Replybutton = true;
        this.ReplyRequired = false;
        this.ApprovalPending = false;
        this._lstMultipleFiales = [];
        this.FileUploadErrorlogs = false;
        this.cdr.detectChanges();
      }
    }
    this.excontent1();
    this.ReplyDetailsV2(this._ReplyId);
    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // (<HTMLInputElement>document.getElementById("UpdatefileUpload")).value = "";

  }
  excontent1() {
    // document.getElementById("excontent").style.display = "none";
    document.getElementById("contentdiv").style.display = "block";
  }

  FileuploadRequired: any;
  UpdateApprovalStatus(MailId: number, ApprovalStatus: string, ReplyId: number) {
    

    if ((this._lstMultipleFiales == undefined || this._lstMultipleFiales.length == 0) && this.FileuploadRequired == true) {
      alert("Attachment is mandatory");
      return false;
    }


    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("files", this._lstMultipleFiales[i].Files);
    }
    if (this._lstMultipleFiales.length === 0) {
      frmData.append("files", JSON.stringify([]))
    }
    this._UpdatedReplyId = this._ReplyId;
    if (this.Approvecomments == "" && this.Rejectcomments == "") {
      this._obj.Comments = "";
    } else if (ApprovalStatus == 'Approved') {
      this._obj.Comments = this.Approvecomments;
    } else if (ApprovalStatus == 'Reject') {
      this._obj.Comments = this.Rejectcomments;
    }
    this._obj.WorkFlowId = this._WorkFlowId;
    this._obj.SortId = this._SortId;
    this._obj.GroupId = this._GroupId;
    this._obj.ReplyWorkFlowSortId = this._ReplyWorkFlowSortId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this.inboxService.UpdateApprovalStatus(this._MemoId, ApprovalStatus, this._ReplyId, this._obj)
      .subscribe(
        data => {
          this._obj = data as InboxDTO;
          if (data["Data"].message == "1") {
            this._obj = data as InboxDTO;
            frmData.append("MailId", this._MemoId.toString());
            frmData.append("Barcode", "");
            frmData.append("ReferenceNo", "00");
            frmData.append("IsReply", "true");
            frmData.append("ReplyId", data["Data"].ReplyId);
            const cloudFilesJson = JSON.stringify(this.cloudfiles);
            frmData.append("cloudFiles", cloudFilesJson);
            // this._ReplyId = data["Data"].ReplyId;
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
                      });
                      if (language === 'ar') {
                        this._snackBar.open('تم إرسال الرد، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      } else {
                        this._snackBar.open('Sent, Please Wait to upload the file..', 'End now', {
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
                    this.isModalOpen = false; // Close the modal temporarily
                    setTimeout(() => {
                      this.isModalOpen = true; // Reopen the modal, which triggers component reloading
                      this.gacArchivingService.reloadComponent();
                    }, 100);
                    this.cloudfiles = [];
                    this.ReplyDetailsV2(this._ReplyId);
                    setTimeout(() => {
                      this.progress = 0;
                    }, 1000);
                    document.getElementById("approvecommentsModal").style.display = "none";
                    document.getElementById("approvecommentsModal").classList.remove("show");
                    document.getElementById("approvecommentsModalBackdrop").style.display = "none";
                    document.getElementById("approvecommentsModalBackdrop").classList.remove("show");
                    
                    document.getElementById("rejectcommentsModal").style.display = "none";
                    document.getElementById("rejectcommentsModal").classList.remove("show");
                    document.getElementById("rejectcommentsModalBackdrop").style.display = "none";
                    document.getElementById("rejectcommentsModalBackdrop").classList.remove("show");
                    this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
                      data => {
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
                      this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._MemoId, data["Data"].ReplyId).subscribe(
                        data => {
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
            this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
              data => {
              })
          }
          this.Approvecomments = "";
          this.Rejectcomments = "";
          this.ReplyDetailsV2(this._ReplyId);
          this.cdr.detectChanges();
        })
  }
  // viwcmnts() {

  //   document.getElementById("appr-cmts").classList.toggle("d-none");
  //   document.getElementById("main-section").classList.toggle("d-none");
  // }
  // rjtcmnts() {

  //   document.getElementById("rjct-cmts").classList.toggle("d-none");
  //   document.getElementById("rjct-section").classList.toggle("d-none");
  // }
  AddUsersInReply() {
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
  link: string = '';
  generateLink(): void {
    this.link = 'https://cswebapps.com/dmsweb/Memo/Details/' + this._MemoId + "/" + this._ReplyId;
  }

  buttonText: string = 'Copy link'; // Initial button text

  handleButtonClick(): void {
    if (this.buttonText === 'Copy link') {
      this.copyLinkToClipboard();
      this.buttonText = 'Copied to clipboard';
    } else if (this.buttonText === 'Copied to clipboard') {
      this.copyLinkToClipboard(); // Call method again if user clicks "Copied to clipboard"
    }
  }

  copyLinkToClipboard(): void {
    navigator.clipboard.writeText(this.link).then(() => {
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

  // adjustDropdownPositionOnHover() {
  //   const userDetailElements = document.querySelectorAll('.user-detail');
  //   userDetailElements.forEach((userDetail: HTMLElement) => {
  //     userDetail.addEventListener('mouseenter', () => {
  //       const dropdownMenu = userDetail.querySelector('.user-detail-hover') as HTMLElement;
  //       if (!dropdownMenu) return;

  //       const dropdownRect = dropdownMenu.getBoundingClientRect();
  //       const bodyRect = document.body.getBoundingClientRect();

  //       const newPositionX = dropdownRect.left + dropdownRect.width <= bodyRect.width ? 0 : bodyRect.width - dropdownRect.width - dropdownRect.left;
  //       const newPositionY = dropdownRect.top + dropdownRect.height <= bodyRect.height ? 0 : bodyRect.height - dropdownRect.height - dropdownRect.top;

  //       dropdownMenu.style.transform = `translate3d(${newPositionX}px, ${newPositionY}px, 0)`;
  //     });
  //   });
  // }
  CloseUserReplys() {
    this.ReplyToUsers = true;
    this.UserComments = "";
    this.ReplyAddUsers = [];
    this.SelectReplyUserIds = [];
    (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
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
        this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger, res["Data"].NewRepliesTrigger).subscribe(
          res => {
          });
        this.ReplyDetailsV2(this._ReplyId);
        (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
        document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      }
    );

  }
  CloseReplyAll_div() {
    this.SelectedUsers = [];
    this.Workflowdetails = [];
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    this.ToErrorlog = false;
    this.cloudfiles = [];
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
  // onFileChange(event) {
  //   if (event.target.files.length > 0) {
  //     var length = event.target.files.length;
  //     for (let index = 0; index < length; index++) {
  //       const file = event.target.files[index];
  //       const fileSizeInKB = Math.round(file.size / 1024);
  //       this.myFiles.push(event.target.files[index].name);
  //       var d = new Date().valueOf();
  //       this._lstMultipleFiales = [...this._lstMultipleFiales, {
  //         UniqueId: d,
  //         FileName: event.target.files[index].name,
  //         Size: event.target.files[index].size,
  //         Files: event.target.files[index]
  //       }];
  //     }
  //     $('#File_pop').removeClass('show');
  //   }
  // }
  // RemoveSelectedFile(_id) {
  //   var removeIndex = this._lstMultipleFiales.map(function (item) { return item.UniqueId; }).indexOf(_id);
  //   this._lstMultipleFiales.splice(removeIndex, 1);
  // }

  FileUploadErrorlogs:boolean = false;
  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[]; // Type assertion to File[]
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]; // Now TypeScript knows 'file' is of type 'File'
        const contentType = this.getFileExtension(file.type);
        const fileSizeInKB = Math.round(file.size / 1024);

        // Check if the file size is 0 KB
        if (fileSizeInKB === 0) {
          this.FileUploadErrorlogs = true; // Show error message
          console.log('The uploaded file is 0kb. Please upload a larger file.');
          continue; // Skip this file
        }
        // Check if the file is already in the array to avoid duplicates
        const existingFile = this._lstMultipleFiales.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );

        if (!existingFile) {
          const uniqueId = new Date().valueOf() + index; // Ensure unique ID
          this._lstMultipleFiales.push({
            UniqueId: uniqueId,
            FileName: file.name,
            Size: file.size,
            Files: file,
          });
        }
      }

      console.log(this._lstMultipleFiales, "Files");
      $('#File_pop').removeClass('show');
      $('#File_Reject').removeClass('show');
      $('#File_Approve').removeClass('show');
      this.FileuploadRequired = false;
      // Clear the input to allow re-uploading of the same file
      event.target.value = '';
    }
  }

  ClosefileErrorlog(){
    this.FileUploadErrorlogs = false;
  }

  getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return '.pdf';
      case 'image/png':
        return '.png';
      case 'image/jpeg':
        return '.jpeg';
      case 'image/jpg':
        return '.jpg';
      default:
        return mimeType;
    }
  }

  RemoveSelectedFile(_id: number): void {
    const removeIndex = this._lstMultipleFiales.findIndex(
      (item) => item.UniqueId === _id
    );
    if (removeIndex !== -1) {
      this._lstMultipleFiales.splice(removeIndex, 1);
    }
  }

  RemoveSelectedFileCould(_id) {
    var removeIndex = this.cloudfiles.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this.cloudfiles.splice(removeIndex, 1);
  }

  RemoveForwardSelectedFile(MailDocId: number) {
    this._ForwardMemoDocuments = this._ForwardMemoDocuments.filter(x => x.MailDocId != MailDocId);
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
  onNgModelChangeConfidential(event: any) {
    debugger
    // if (e) {
    //   this._obj.IsConfidential = false;
    //   this._IsConfidential = false;
    // }
    this._IsConfidential = event;
    // Only update the API value if IsConfidentialReply is not false
    this._obj.IsConfidential = event && this.IsConfidentialReply !== false;

  }
  hasSeenErrorMessage: boolean = false; // Flag to track if the user has seen the error message before

  MemoReply() {
    // if (this.htmlContent == '') {
    //   $('.error-msg-pop-x').removeClass('d-none');
    //   this.showSendAnywayAndCancelButtons = false;
    //   // alert(this.showSendAnywayAndCancelButtons);
    //   return false;
    // }
    // else {
    //   this.SendMemoReply();
    // }
    if (this.htmlContent === '') {
      if (!this.hasSeenErrorMessage) {
        // First time showing the error message
        $('.error-msg-pop-x').removeClass('d-none');
        this.showSendAnywayAndCancelButtons = false;
        this.hasSeenErrorMessage = true; // Mark that the user has seen the error
        return false;
      } else {
        // Second time, allow the user to send the reply anyway
        this.SendMemoReply();
      }
    } else {
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
    if (this._lstMultipleFiales.length === 0) {
      frmData.append("files", JSON.stringify([]))
    }
    if (this._lstMultipleFiales.length > 0 || this.cloudfiles.length > 0) {
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
    if (this.IsConfidential) {
      // this._obj.IsConfidential = true;
      // this._IsConfidential = true;
      this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;
    } else if (this.IsConfidentialReply === false) {
      this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;
    } else {
      this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;
    }

    this._obj.IsActive = false;
    if (this.ReplyType == "New Topic" || this.ReplyType == "موضوع جديد") {
      this._obj.ParentId = 0
    } else if (this.ReplyType !== "New Topic" && this.ReplyType !== "موضوع جديد") {
      this._obj.ParentId = this._ReplyId;
    }
    this.ToErrorlog = false;
    this.SubjectErrorlog = false;
    if (!this.selectedToEmpIds || this.selectedToEmpIds.length === 0) {
      $('.error-msg-pop-x-forward').removeClass('d-none');
      this.ToErrorlog = true;
    }
    else if (this.SelectedSubject === "") {
      this.SubjectErrorlog = true;
    }
    if (this.ToErrorlog == true || this.SubjectErrorlog == true) return false;
    this._obj.ToUserxml = this.selectedToEmpIds;
    this._obj.Deadline_sort = 1;
    this._obj.message = "";
    this._obj.Title = this.SelectedSubject;
    this._obj.CCUserxml = this.selectedCCEmpIds;
    this._obj.MemoReplyType = this.ReplyType;
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
        this._obj = data as InboxDTO;
        frmData.append("MailId", MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "true");
        frmData.append("ReplyId", data["Data"].ReplyId);
        const cloudFilesJson = JSON.stringify(this.cloudfiles);
        frmData.append("cloudFiles", cloudFilesJson);
        this._ReplyId = data["Data"].ReplyId;
        if (attvalu == true) {
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
                  this.isModalOpen = false; // Close the modal temporarily
                  setTimeout(() => {
                    this.isModalOpen = true; // Reopen the modal, which triggers component reloading
                    this.gacArchivingService.reloadComponent();
                  }, 100);
                  this.cloudfiles = [];
                  this.FileUploadErrorlogs = false;
                  this.ReplyDetailsV2(this._ReplyId);
                  setTimeout(() => {
                    this.progress = 0;
                  }, 1000);
                  (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
                  document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                  document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

                  this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
                    data => {
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
                    this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._MemoId, data["Data"].ReplyId).subscribe(
                      data => {
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
          this.ReplyDetailsV2(this._ReplyId);
          (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
            data => {
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
            this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._MemoId, data["Data"].ReplyId).subscribe(
              data => {
              }
            )
          }
        }
        // this.Description = '';
        this._ExpiryDate = null;
        this.DeadlineDatecheck = false;
        this.htmlContent = "";
        this.FileUploadErrorlogs = false;
      }
    )
    setTimeout(() => {
      this.initializeTippy();
    }, 500);
  }

  WorkflowJSON: any;
  _SortId: any;;
  SendWorkflow() {
    if (this.selectedWorkflowId == undefined) {
      this.WorkflowErrorlog = true;
    } else if (this.selectedWorkflowId != undefined) {
      this.WorkflowErrorlog = false;
    }

    this._SortId = this.SelectedUsers.map(item => ({
      SortId: item.sortId || item.SortId
    }));
    const firstSortId = this._SortId[0]?.SortId;

    // if (firstSortId && this._AttachmentRequired == true) {
    //   this.FileUploadErrorlog = true;
    // }else{
    //   this.FileUploadErrorlog = false;
    // }
    // Retrieve the first SortId


    this.WorkflowJSON = this.SelectedUsers.map(item => ({
      WorkFlowId: item.WorkFlowId,
      SortId: item.sortId
    }));

    // Assuming this.selectedWorkflowId is defined
    this._obj.WorkFlowJson = JSON.stringify(this.WorkflowJSON);
    console.log(this.WorkflowJSON, "Json format");
    this._obj.MemoType = this.ReplyType;
    this._obj.Subject = this.SelectedSubject;
    this._obj.Purpose = this.htmlContent;
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("files", this._lstMultipleFiales[i].Files);
    }
    if (this._lstMultipleFiales.length == 0) {
      frmData.append("files", this._lstMultipleFiales)
    }
    // this.newmemofile = this.couldfiles;
    if (this._lstMultipleFiales.length === 0) {
      frmData.append("files", JSON.stringify([]))
    }
    if (this._lstMultipleFiales.length > 0 || this.cloudfiles.length > 0) {
      this._obj.Attachment = true;
    }
    else {
      this._obj.Attachment = false;
    }
    let attvalu = this._obj.Attachment;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReferenceNo = "";
    this._obj.CCUserxml = this.selectedCCEmpIds
    this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;
    this._obj.DeadLineDate = null;
    this._obj.MailId = this._MemoId;
    this.newmemoService.SendWorkflowV2(this._obj).subscribe(
      res => {
        debugger
        this._obj.message = res["Message"];
        this._obj.MailId = res["Data"].MailId;
        this._obj.ReplyId = res["Data"].ReplyId;

        // frmData.append("mailId", this._obj.MailId.toString());
        frmData.append("MailId", this._obj.MailId.toString());
        frmData.append("Barcode", "");
        frmData.append("ReferenceNo", "00");
        frmData.append("IsReply", "true");
        frmData.append("ReplyId", res["Data"].ReplyId);
        // Assuming `cloudFilesObject` is the array or object you want to send as JSON
        // const cloudFilesJson = JSON.stringify(this.newmemofile);
        // frmData.append("cloudFiles", cloudFilesJson);
        const cloudFilesJson = JSON.stringify(this.cloudfiles);
        frmData.append("cloudFiles", cloudFilesJson);
        // console.log(typeof cloudFilesJson);
        // console.log("cloudFilesJson", cloudFilesJson);
        if (this._obj.message == "Success") {
          if (attvalu == true) {
            this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
              .catch(err => console.log('Error while connect with server'));
            $('.progress-overlay').addClass('visible');
            this.newmemoService.UploadAttachmenst(frmData).subscribe({
              next: (event) => {
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
                      });
                      if (language === 'ar') {
                        this._snackBar.open('تم إرسال المذكرة، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      } else {
                        this._snackBar.open('Memo Sent, Please Wait to upload the file..', 'End now', {
                          duration: 5000,
                          horizontalPosition: "right",
                          verticalPosition: "bottom",
                        });
                      }
                    }
                    break;
                  case HttpEventType.Response:

                    if (language === 'ar') {
                      this._snackBar.open('هذه رسالة باللغة العربية', 'إغلاق', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                      });
                    } else {
                      this._snackBar.open('Work Sent Successfully', 'End now', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                        panelClass: ['blue-snackbar']
                      });
                    }
                    this.isModalOpen = false;
                    setTimeout(() => {
                      this.isModalOpen = true; // Reopen the modal, which triggers component reloading
                      this.gacArchivingService.reloadComponent();
                    }, 100);
                    setTimeout(() => {
                      this.progress = 0;
                    }, 1000);
                    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
                    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                    $('.progress-overlay').removeClass('visible');
                    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                    const sideViewElement = document.getElementsByClassName("side_view")[0];
                    if (sideViewElement) {
                      sideViewElement.classList.remove("position-fixed");
                    }
                    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                    this.cloudfiles = [];

                    this.inboxService.AddMemoToLabel(res["Data"].MailId.toString(), this.SelectedLabelIds.toString(), this.currentUserValue.createdby).subscribe(
                      data => {
                        console.log(data, "Labels");
                      });
                    this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger, "").subscribe(
                      data => {
                        console.log(data, "New Memos Triggered")
                      }
                    )

                    var _touse = [];
                    if (this.selectedToEmpIds.length > 0) {
                      for (let index = 0; index < this.selectedToEmpIds.length; index++) {
                        _touse.push(this.selectedToEmpIds[index]);
                      }
                      for (let index = 0; index < this.selectedCCEmpIds.length; index++) {
                        _touse.push(this.selectedCCEmpIds[index]);
                      }
                      this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.newmemoService._NewMemoobj.Subject, this._obj.MailId, this._obj.ReplyId).subscribe(
                        data => {
                          console.log(data, "New Memos Notifications");
                        }
                      );
                    }

                }
              },
              error: (e) => {
                console.error('Error uploading file', e);
              },
              complete: () => console.info('complete')
            }
            )
          }
          else {
            this.newmemoService._NewMemoobj.Purpose = '';
            (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
            const language = localStorage.getItem('language');
            if (language === 'ar') {
              this._snackBar.open('هذه رسالة باللغة العربية', 'إغلاق', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
              });
            } else {
              this._snackBar.open('Workflow Sent Successfully', 'End now', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
                panelClass: ['blue-snackbar']
              });
            }
          }

          (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
        }
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
    if (this._lstMultipleFiales.length === 0) {
      frmData.append("files", JSON.stringify([]))
    }
    if (this._lstMultipleFiales.length > 0 || this.cloudfiles.length > 0) {
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
    this._obj.MemoReplyType = this.ReplyType;
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
        const cloudFilesJson = JSON.stringify(this.cloudfiles);
        frmData.append("cloudFiles", cloudFilesJson);
        frmData.append("ReplyId", data["Data"].ReplyId);
        if (attvalu == true) {
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
                  this.ReplyDetailsV2(this._ReplyId);
                  (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
                  document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                  document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                  setTimeout(() => {
                    this.progress = 0;
                  }, 1500);
                  this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
                    data => {
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
                    this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._MemoId, data["Data"].ReplyId).subscribe(
                      data => {
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
          this.ReplyDetailsV2(this._ReplyId);
          (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.newmemoService.NewMemosTrigger(data["Data"].NewMemosTrigger, data["Data"].NewRepliesTrigger).subscribe(
            data => {

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
            this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.SelectedSubject, this._MemoId, data["Data"].ReplyId).subscribe(
              data => {
              }
            )
          }
        }
        // this.Description = '';
        this._ExpiryDate = null;
        this.DeadlineDatecheck = false;
        this.htmlContent = "";
      }
    )
  }
  BackToReply() {
    $('.error-msg-pop-x').addClass('d-none');
    $('.error-msg-pop-x-forward').addClass('d-none');
    this.showSendAnywayAndCancelButtons = true;
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
  Replycancal() {
    this.htmlContent = "";
    this.DeadlineDatecheck = false;
    this._ExpiryDate = null;
    (<HTMLInputElement>document.getElementById("ReplyAll_div")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
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

    if (viewmoreElement.style.display === "none") {
      viewmoreElement.style.display = "block";
      viewlessElement.style.display = "none";
    } else {
      viewmoreElement.style.display = "none";
      viewlessElement.style.display = "block";
    }
  }

  // drop(event: CdkDragDrop<any[]>) { 
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //   }
  // }



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

  openAutocompleteDrpDwnTO(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }

  closeAutocompleteDrpDwnTO(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
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

  isSelected(employee: any): boolean {
    return this.selectedToEmployees.some((emp) => emp.CreatedBy === employee.CreatedBy);
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

  filterUsersInCC(input: string): void {
    this.isSelectionCC = true;
    this._AllUsersCCList = this._AllUsersList.filter((employee) =>
      employee.DisplayName.toLowerCase().includes(input.toLowerCase())
    );
  }

  isSelectedCCUsers(employee: any): boolean {
    return this.selectedCCEmployees.some((emp) => emp.CreatedBy === employee.CreatedBy);
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

  openAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }

  closeAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }

  closePanel() {
    this.isSelection = false;
    (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
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
      const index = this.selectedToEmployees.findIndex((emp) => emp.CreatedBy === event.option.value);
      this.isSelection = false;
      if (index !== -1) {
        // Remove the employee from the selectedEmployees array
        this.selectedToEmployees.splice(index, 1);
        this.selectedToEmpIds.splice(index, 1);
      }
    }
    else {
      alert("cannot add login user");
    }
  }
  isSelectionAddUserReply: boolean = false;
  isSelection_AddUsersReply: boolean = false;
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

  openAutocompleteDrpDwnAddUserReply(OpenAdduserReply: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduserReply);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }

  closeAutocompleteDrpDwnAddUserReply(CloseOpenAdduserReply: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduserReply);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
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
  // AddNewUserDropdown 

  // Right Section Method end here

  // Access denied user Method Start here
  clearusercomment() {
    this.Usercomment = "";
    this.Aftersendmessage = false;
    this.Requestbutton = false;
  }
  UserJSON() {
    this._obj.MailId = this._MemoId;
    this._obj.ReplyId = this._ReplyId
    this._obj.FromUserId = this._LoginUserId;
    this._obj.Description = this.Usercomment;
    this.newmemoService.Requestuser(this._obj).subscribe(
      data => {
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
  // Access denied user Method end here
  async datesUpdated($event) {

    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      this._StartDate = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
      this._obj.MailId = this._MemoId;
      this._obj.CreatedBy = this.currentUserValue.createdby;
      this._obj.ReplyId = this._ReplyId;
      this._obj.startDate = this._StartDate;
      this._obj.endDate = this._EndDate;
      (await this.inboxService.ReplyListCustomDatesFilters(this._obj))
        .subscribe(data => {
          this._Activity = data["Data"].Activity == 'True' ? true : false;
          this.ReplyList = data["Data"].MemoReplyList;
          this._LoadMoreLength = 10;
          const groupedData = {};
          data["Data"].MemoReplyList.forEach(item => {
            if (!groupedData[item.DateCategory]) {
              groupedData[item.DateCategory] = [];
            }
            groupedData[item.DateCategory].push(item);
          });
          // Creating JSON representation for each group
          const groupedJson = Object.keys(groupedData).map(key => {
            return {
              DateCategoryValue: key,
              DateCategoryJson: groupedData[key],
              DateCategorySort: groupedData[key][0].SortOrder
            };
          });

          // Sort the groupedJson array by DateCategorySort in descending order
          groupedJson.sort((a, b) => a.DateCategorySort - b.DateCategorySort);
          this.jsonData = groupedJson;
          this.jsonData.forEach(element => {
            element.DateCategoryJson.sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
          });
          this.cdr.detectChanges();
        })
    }
    $('#dropd').removeClass('show');


  }




  GetmeetingDetails(_Val) {
    this.meetingList = [];
    this.meeting_arry = [];
    this.meetinglength = 0;
    this.upcomingMeetings = [];
    this.todaymeetings = [];
    this.last7dmeetings = [];
    this.lastMonthMeetings = [];
    this.olderMeetings = [];
    this.sorttypes = _Val;
    this._objEp.mailid = this._MemoId;
    this._objEp.sorttype = _Val;
    this._objEp.startdate = null;
    this._objEp.enddate = null;
    this._objEp.Emp_No = this.currentUserValue.EmployeeCode;
    // alert(this.currentUserValue.EmployeeCode);
    this.outsourceService.MemoDeatilsEpMeetings(this._objEp)
      .subscribe(data => {
        debugger
        console.log(data, "Memodetails Ep Meeting data")
        this.meetingList = data["Data"]["MeetingJSON"];
        if (this.meetingList && this.meetingList.length > 0) {
          this._Addguest = this.meetingList[0].Addguest;
          this._Addguestlist = JSON.parse(this._Addguest)
          console.log(this._Addguestlist, "_Addguestlist");
        }
        this.meeting_arry = this.meetingList;
        if (this.meeting_arry.length > 0)
          this.meetinglength = this.meeting_arry.length;
        this.meeting_arry.forEach(element => {
          element.usersjson = JSON.parse(element.Addguest);
        });


        this.upcomingMeetings = this.getUpcomingMeeting();
        this.upcomingMeetings.reverse();                                         // get upcoming meetings.
        this.upcMtgCnt = this.upcomingMeetings.length;                           // store totalno of meetings.
        this.upcomingMeetings = this.groupMeetingsByDate(this.upcomingMeetings);
        console.log("UPCOMMING MEETINGS:", this.upcomingMeetings);

        this.todaymeetings = this.getMeetingsByDate(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));     // get todays meetings.
        this.tdMtgCnt = this.todaymeetings.length;                                                        // store totalno of meetings.
        this.todaymeetings = this.groupMeetingsByDate(this.todaymeetings);                                 // format them.
        console.log(this.todaymeetings, "this.todaymeetings")

        for (let i = 1; i <= 7; i++) {
          const date = new Date();                     // get the current date.
          date.setDate(date.getDate() - i);
          this.last7dmeetings = this.last7dmeetings.concat(this.getMeetingsByDate(this.datepipe.transform(date, 'yyyy-MM-dd')));
        }                                                                                               // get last 7 days meetings.
        this.lst7dCnt = this.last7dmeetings.length;                                                    // store totalno of meetings.
        this.last7dmeetings = this.groupMeetingsByDate(this.last7dmeetings);
        console.log(this.last7dmeetings, "last7dmeetings")                        // format them.


        const date1 = new Date();                 // currentdate.
        date1.setMonth(date1.getMonth() - 1);    // date1 is prev month.
        this.meeting_arry.forEach(m => {

          const sd = new Date(m.Schedule_date);
          if (sd.getMonth() === date1.getMonth() && sd.getFullYear() === date1.getFullYear()) {  // when meeting held in last month
            this.lastMonthMeetings.push(m);
          }
          else if (!(sd.getTime() > date1.getTime())) {   // when meeting held date is even order than last months
            this.olderMeetings.push(m);
          }
        });

        this.lstMthCnt = this.lastMonthMeetings.length;
        this.oldMtgCnt = this.olderMeetings.length;

        this.lastMonthMeetings = this.groupMeetingsByDate(this.lastMonthMeetings);      // format them.
        console.log(this.lastMonthMeetings, "this.lastMonthMeetings")

        this.olderMeetings = this.groupMeetingsByDate(this.olderMeetings);
        console.log(this.olderMeetings, "olderrr meetings")



        this.isLoadingData = true;
      });
  }

  popupclose() {
    $("#custom_drop").removeClass("show");
  }




  getMeetingsInRange() {
    /*---------- set time out for hide the dropdown --------*/
    setTimeout(function () {
      loadSelect()
    },
      1500);
    function loadSelect() {
      $(".dropdown_left_fix").removeClass("show");
    }
    /*---------- set time out for hide the dropdown end --------*/

    this._objEp.mailid = this._MemoId;
    this._objEp.sorttype = 5;
    this._objEp.startdate = this.mtgFromD;;
    this._objEp.enddate = this.mtgUptoD;
    this._objEp.Emp_No = this.currentUserValue.EmployeeCode;
    this.mLdng = true;
    this.outsourceService.MemoDeatilsEpMeetings(this._objEp)
      .subscribe(data => {
        this.mLdng = false;   // made loading invisible.
        console.log("after sending meeting range:", data)
        if (data && data["Data"]["MeetingJSON"]) {  // if MeetingFor_projects is not '' , null , undefined
          this.mtgsInRange = data["Data"]["MeetingJSON"]
          this.mtgsInRange.forEach(element => {
            element.usersjson = JSON.parse(element.Addguest);
          });
          this.mtgsInRange = this.groupMeetingsByDate(this.mtgsInRange);
          console.log("get meetings list:", this.mtgsInRange);
        }
        else {
          this.mtgsInRange = [];  // when no meetings held during the range.
        }


      })

  }

  CustomClose() {
    this.mtgFromD = '';
    this.mtgUptoD = '';
    $(".dropdown_left_fix").removeClass("show");
  }

  MeetingRedirectionEP(mtgScheduleId: any) {
    const Url = "https://cswebapps.com/creativeplanner/Meeting-Details/" + mtgScheduleId;
    window.open(Url);
  }

  getUpcomingMeeting() {
    const cd = new Date();   // takes the current date.
    const upcoming = this.meeting_arry.filter((meeting) => {
      const sd = new Date(meeting.Schedule_date);
      return sd > cd;
    });
    return upcoming;
  }

  groupMeetingsByDate(ar) {
    let result = [];
    for (let i = 0; i < ar.length; i++) {
      let date1 = new Date(ar[i].Schedule_date);
      if (!result.find((e) => new Date(e.date).getTime() === date1.getTime())) {

        let totalmeetings = [ar[i]];
        for (let j = i + 1; j < ar.length; j++) {

          if (new Date(ar[j].Schedule_date).getTime() === date1.getTime())
            totalmeetings.push(ar[j]);
        }
        result.push({ date: date1, totalmeetings: totalmeetings })
      }
    }
    return result;
  }

  getMeetingsByDate(date) {
    const inputdate = new Date(date);
    const meetingsfound = this.meeting_arry.filter((meeting) => {
      const tempd = new Date(meeting.Schedule_date);
      return (tempd.getTime() === inputdate.getTime())
    });
    return meetingsfound;
  }

  getAttendeesInMeeting(items: any[]): number {
    if (Array.isArray(items)) {
      let total = 0;
      items.forEach((item) => {
        if (item.Status === "Accepted") {
          total += 1;
        }
      });
      return total;
    }
    return 0; // Return 0 if not an array
  }

  openMeetingSidebar() {
    document.getElementById("Meetings_SideBar").classList.add("kt-quick-Mettings--on");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("newdetails").classList.add("position-fixed");

    this.GetmeetingDetails(0)

    // sidebar is open
    // get all meeting details.
  }


  closeMeetingSidebar() {
    document.getElementById("Meetings_SideBar").classList.remove("kt-quick-Mettings--on");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("newdetails").classList.remove("position-fixed");
  }

  custom_drop() {
    document.getElementById("custom_drop").classList.toggle("show");
  }

  dmsUsageModal() {
    // chart1 = am4core.create("chartdiv1", am4charts.PieChart);
    // // Add data with additional "Document Upload Count"
    // chart1.data = [
    //   { "category": "New DMS Count", "value": 30, "color": am4core.color("#67b7dc") },
    //   { "category": "Replys Count", "value": 30, "color": am4core.color("#6794dc") },   
    //   { "category": "Pending Counts", "value": 20, "color": am4core.color("#6771dc") },  
    //   { "category": "Document Upload Count", "value": 10, "color": am4core.color("#2786fb") } 
    // ];

    // // Create pie series
    // let pieSeries = chart1.series.push(new am4charts.PieSeries());
    // pieSeries.dataFields.value = "value";
    // pieSeries.dataFields.category = "category";
    // pieSeries.slices.template.propertyFields.fill = "color";
    // pieSeries.ticks.template.disabled = true;
    // pieSeries.alignLabels = false;
    // pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    // pieSeries.labels.template.radius = am4core.percent(-40);
    // pieSeries.labels.template.fill = am4core.color("white");
    // // Show percentage labels
    // // pieSeries.labels.template.text = "{category}: {value.percent.formatNumber('#.0')}%"; 
    // // pieSeries.labels.template.fill = am4core.color("#000");

    // // Add legend to show names and corresponding colors
    // chart1.legend = new am4charts.Legend();
    // chart1.legend.position = "bottom"; // Position the legend
    // chart1.legend.labels.template.text = "{category}"; // Show only the category names
    // // chart1.legend.valueLabels.template.text = "{value.percent.formatNumber('#.0')}%";

    // // Optional: Adjust tooltips to show more information on hover
    // pieSeries.slices.template.tooltipText = "{category}: {value.percent.formatNumber('#.0')}% ({value})";


    //     // Create chart instance


    document.getElementById("dmsUsageModal").style.display = "block";
    document.getElementById("dmsUsageModal").classList.add("show");
    document.getElementById("dmsUsageModalBackdrop").style.display = "block";
    document.getElementById("dmsUsageModalBackdrop").classList.add("show");

    let chart = am4core.create("chartdiv1", am4charts.XYChart);
    // Add data (sample date and value data)
    chart.data = [
      { "date": new Date(2023, 8, 1), "value": 30 },
      { "date": new Date(2023, 8, 2), "value": 45 },
      { "date": new Date(2023, 8, 3), "value": 50 },
      { "date": new Date(2023, 8, 4), "value": 40 },
      { "date": new Date(2023, 8, 5), "value": 55 },
      { "date": new Date(2023, 8, 6), "value": 60 }
    ];

    // Create X-axis (date-based)
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    // Create Y-axis (value-based)
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series (single line)
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;

    // Add a simple tooltip to the line
    series.tooltipText = "{value}";
    series.tooltip.pointerOrientation = "vertical";

    // Optional: Add bullets (dots) to the line
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 3;
    bullet.circle.strokeWidth = 2;
    bullet.circle.fill = am4core.color("#fff");

    // Add chart cursor (to allow zoom and scrolling)
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    // Optional: Add a scrollbar below the graph
    chart.scrollbarX = new am4core.Scrollbar();
  }

  dmsUsageModal_dismiss() {
    document.getElementById("dmsUsageModal").style.display = "none";
    document.getElementById("dmsUsageModal").classList.remove("show");
    document.getElementById("dmsUsageModalBackdrop").style.display = "none";
    document.getElementById("dmsUsageModalBackdrop").classList.remove("show");
  }
  usage_overall() {
    document.getElementById("usage-current-btn").classList.remove("active");
    document.getElementById("usage-overall-btn").classList.add("active");
    document.getElementById("usage-current-div").style.display = "none";
    document.getElementById("usage-overall-div").style.display = "block";
  }
  usage_current() {
    document.getElementById("usage-current-btn").classList.add("active");
    document.getElementById("usage-overall-btn").classList.remove("active");
    document.getElementById("usage-current-div").style.display = "block";
    document.getElementById("usage-overall-div").style.display = "none";
  }

  formatSize(size: number): string {
    return formatFileSize(size);
  }
  formatSizeCould(size: number): string {
    return formatFileSizeCould(size);
  }

  showEmojiPicker = false;  // Control visibility of emoji picker
  onContentChanged(event: any) {
    // Update the model when content changes
    this.htmlContent = event.html;
  }
  // Handle emoji selection and insert it into the editor
  addEmoji(event: any) {
    const emoji = event.emoji.native;  // Get the selected emoji
    // const quillEditor = document.querySelector('.ql-editor');
    // quillEditor.innerHTML += emoji;  // Insert the emoji into the editor content
    // this.htmlContent += emoji;
    // console.log(this.htmlContent, "html data");
    const editorInstance = this.editors?.editorInstance; // Access the CKEditor instance

    if (editorInstance) {
      // Insert the emoji at the current cursor position
      editorInstance.model.change((writer: any) => {
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        writer.insertText(emoji, insertPosition);
      });
    }
    this.showEmojiPicker = false;  // Hide the emoji picker after selection
  }

  // Toggle emoji picker visibility
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }



  // onContentChangedReject(event: any) {
  //   // Update the model when content changes
  //   this.Rejectcomments = event.html;
  // }
  // // Handle emoji selection and insert it into the editor
  // addEmojiReject(event: any) {
  //   const emoji = event.emoji.native;  // Get the selected emoji
  //   // const quillEditor = document.querySelector('.ql-editor');
  //   // quillEditor.innerHTML += emoji;  // Insert the emoji into the editor content
  //   // this.htmlContent += emoji;
  //   // console.log(this.htmlContent, "html data");
  //   const editorInstance = this.editors?.editorInstance; // Access the CKEditor instance

  //   if (editorInstance) {
  //     // Insert the emoji at the current cursor position
  //     editorInstance.model.change((writer: any) => {
  //       const insertPosition = editorInstance.model.document.selection.getFirstPosition();
  //       writer.insertText(emoji, insertPosition);
  //     });
  //   }
  //   this.showEmojiPickerReject = false;  // Hide the emoji picker after selection
  // }

  // // Toggle emoji picker visibility
  // toggleEmojiPickerReject() {
  //   this.showEmojiPickerReject = !this.showEmojiPickerReject;
  // }

  showEmojiPickerReject = false;  // Control visibility of emoji picker
  addEmojiReject(event: any) {
    const emoji = event.emoji.native; // Get the selected emoji
    const editorInstance = this.Rejectcommentsfocus?.editorInstance;

    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        // Get the current cursor position
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        // Insert the emoji at the cursor position
        writer.insertText(emoji, insertPosition);
      });
    } else {
      console.error('CKEditor instance is not available.');
    }

    this.showEmojiPickerReject = false; // Hide the emoji picker after selection
  }

  toggleEmojiPickerReject() {
    // Toggle the visibility of the emoji picker
    this.showEmojiPickerReject = !this.showEmojiPickerReject;
  }


  showEmojiPickerApprove = false;  // Control visibility of emoji picker
  addEmojiAprrove(event: any) {
    const emoji = event.emoji.native; // Get the selected emoji
    const editorInstance = this.Approvecommentsfocus?.editorInstance;

    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        // Get the current cursor position
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        // Insert the emoji at the cursor position
        writer.insertText(emoji, insertPosition);
      });
    } else {
      console.error('CKEditor instance is not available.');
    }

    this.showEmojiPickerApprove = false; // Hide the emoji picker after selection
  }

  toggleEmojiPickerAprrove() {
    // Toggle the visibility of the emoji picker
    this.showEmojiPickerApprove = !this.showEmojiPickerApprove;
  }

  isModalOpen = false;
  gacarchivelistModal() {
    this.isModalOpen = true;
    document.getElementById("gacarchivelistModal").style.display = "block";
    document.getElementById("gacarchivelistModal").classList.add("show");
    document.getElementById("gacarchivelistModalBackdrop").style.display = "block";
    document.getElementById("gacarchivelistModalBackdrop").classList.add("show");
  }

  cloudfiles: any[] = [];
  onFilesSelected(files: any[]) {
    this.cloudfiles = files;
    console.log('Selected files in NewMemoComponent:', this.cloudfiles);
  }

  AddUserselected: any;
  datesUpdated1($event) {
    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      this._StartDate1 = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate1 = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
    }
  }
  shareoptionModal() {
    this.generateLink();
    document.getElementById("shareoptionModal").style.display = "block";
    document.getElementById("shareoptionModal").classList.add("show");
    document.getElementById("shareoptionModalBackdrop").style.display = "block";
    document.getElementById("shareoptionModalBackdrop").classList.add("show");
  }

  shareoptionModal_dismiss() {
    this.buttonText = 'Copy link';
    document.getElementById("shareoptionModal").style.display = "none";
    document.getElementById("shareoptionModal").classList.remove("show");
    document.getElementById("shareoptionModalBackdrop").style.display = "none";
    document.getElementById("shareoptionModalBackdrop").classList.remove("show");
  }
  approvecommentsModal() {
    setTimeout(() => {
      const editorInstance = this.Approvecommentsfocus?.editorInstance;
      if (editorInstance) {
        editorInstance.editing.view.focus(); // Focus the editor
      } else {
        console.error('CKEditor instance is not available.');
      }
    }, 0); // Delays execution to allow CKEditor to initialize
    document.getElementById("approvecommentsModal").style.display = "block";
    document.getElementById("approvecommentsModal").classList.add("show");
    document.getElementById("approvecommentsModalBackdrop").style.display = "block";
    document.getElementById("approvecommentsModalBackdrop").classList.add("show");
  }

  approvecommentsModal_dismiss() {
    this.Approvecomments = "";
    this._lstMultipleFiales = [];
    this.cloudfiles = [];
    document.getElementById("approvecommentsModal").style.display = "none";
    document.getElementById("approvecommentsModal").classList.remove("show");
    document.getElementById("approvecommentsModalBackdrop").style.display = "none";
    document.getElementById("approvecommentsModalBackdrop").classList.remove("show");
  }
  rejectcommentsModal() {
    setTimeout(() => {
      const editorInstance = this.Rejectcommentsfocus?.editorInstance;
      if (editorInstance) {
        editorInstance.editing.view.focus(); // Focus the editor
      } else {
        console.error('CKEditor instance is not available.');
      }
    }, 0); // Delays execution to allow CKEditor to initialize
    document.getElementById("rejectcommentsModal").style.display = "block";
    document.getElementById("rejectcommentsModal").classList.add("show");
    document.getElementById("rejectcommentsModalBackdrop").style.display = "block";
    document.getElementById("rejectcommentsModalBackdrop").classList.add("show");
  }

  rejectcommentsModal_dismiss() {
    this.Rejectcomments = "";
    this._lstMultipleFiales = [];
    this.cloudfiles = [];
    document.getElementById("rejectcommentsModal").style.display = "none";
    document.getElementById("rejectcommentsModal").classList.remove("show");
    document.getElementById("rejectcommentsModalBackdrop").style.display = "none";
    document.getElementById("rejectcommentsModalBackdrop").classList.remove("show");
  }
  SelecteduserWorkflowJson = [];
  workflowuserdetailsModal(UserId: number) {
    this.SelecteduserWorkflowJson = this._WorkFlowJsonII.filter(x => x.UserId === UserId);
    console.log(this.SelecteduserWorkflowJson, "this.SelecteduserWorkflowJson");
    document.getElementById("workflowuserdetailsModal").style.display = "block";
    document.getElementById("workflowuserdetailsModal").classList.add("show");
    document.getElementById("workflowuserdetailsModalBackdrop").style.display = "block";
    document.getElementById("workflowuserdetailsModalBackdrop").classList.add("show");
  }

  workflowuserdetailsModal_dismiss() {
    document.getElementById("workflowuserdetailsModal").style.display = "none";
    document.getElementById("workflowuserdetailsModal").classList.remove("show");
    document.getElementById("workflowuserdetailsModalBackdrop").style.display = "none";
    document.getElementById("workflowuserdetailsModalBackdrop").classList.remove("show");
  }
  hasApprovedAndRejectedNextStep(actions: any[]): boolean {
    const hasApproved = actions.some(a => a.UserAction === 'Approved' && a.SystemAction === 'Next step');
    const hasRejected = actions.some(a => a.UserAction === 'Rejected' && a.SystemAction === 'Next step');
    // const hasReplied = actions.some(a => a.UserAction === 'Replied' && a.SystemAction === 'Next step');
    return hasApproved && hasRejected  
  
  }
  WorkflowLeftsectionlist: any;
  EmployeeId: number;
  open_workflow_user_modal() {
    document.getElementById("workflow-user-modal-backdrop").style.display = "block";
    document.getElementById("workflow-user-modal").style.display = "block";
  }
  WorkflowDropdownlist() {
    this.inboxService.GetWorkFlowMasterAPI(this.EmployeeId, this.currentUserValue.organizationid)
      .subscribe(data => {
        this.WorkflowLeftsectionlist = data["Data"]["WorkFlowJson"];
        this.WorkflowLeftsectionlist.forEach(element => {
          element.Check = false;
          element.disabled = false;
          element.sortId = 0
        });
        console.log(this.WorkflowLeftsectionlist, "get workflow details");
      })
  }
  updateSelectedValues(WorkFlowId: number, event: any) {

    const isChecked = event.checked;

    // Update Check status and ensure only one item is selected
    this.WorkflowLeftsectionlist.forEach(element => {
      element.Check = (element.WorkFlowId === WorkFlowId) ? isChecked : false;
      // Reset sortId for all deselected items
      if (!element.Check) {
        element.sortId = null;
      }
    });

    if (isChecked) {
      // Assign sortId for the newly selected item
      const nextSortId = 1; // Since single selection, sortId is always 1
      this.WorkflowLeftsectionlist.forEach(user => {
        if (user.WorkFlowId === WorkFlowId) {
          user.sortId = nextSortId;
        }
      });
    }

    console.log(this.WorkflowLeftsectionlist, 'Updated User List with Sort IDs');



    // const isChecked = event.checked;

    // // Update Check status for all instances of the same UserId
    // this.WorkflowLeftsectionlist.forEach(element => {
    //   if (element.WorkFlowId === WorkFlowId) {
    //     element.Check = isChecked;
    //   }
    // });

    // // Assign sortId if checked, or clear sortId if unchecked
    // if (isChecked) {
    //   // Assign sortId for the newly selected item
    //   const currentSortIds = this.WorkflowLeftsectionlist
    //     .filter(user => user.sortId !== null)
    //     .map(user => user.sortId);

    //   const nextSortId = currentSortIds.length > 0 ? Math.max(...currentSortIds) + 1 : 1;

    //   this.WorkflowLeftsectionlist.forEach(user => {
    //     if (user.WorkFlowId === WorkFlowId) {
    //       user.sortId = nextSortId;
    //     }
    //   });
    // } else {
    //   // Clear sortId for the deselected item
    //   this.WorkflowLeftsectionlist.forEach(user => {
    //     if (user.WorkFlowId === WorkFlowId) {
    //       user.sortId = null;
    //     }
    //   });

    //   // Resequence sortIds for remaining selected users
    //   let sortCounter = 1;
    //   this.WorkflowLeftsectionlist
    //     .filter(user => user.Check) // Only process selected users
    //     .forEach(user => {
    //       user.sortId = sortCounter++;
    //     });
    // }

    // console.log(this.WorkflowLeftsectionlist, 'Updated User List with Sort IDs');
  }

  dynamicValues: number[] = [];
  // Array to store indexes of duplicate values
  duplicateIndexes: number[] = [];
  SelectedUsers: any[] = [];
  selectedWorkflowId: number;
  AddSelectUser() {
    this.dynamicValues = [];
    this.duplicateIndexes = [];
    this.SelectedUsers = [];
    // Filter out duplicates based on UserId
    const uniqueUserIds = new Set();
    this.SelectedUsers = this.WorkflowLeftsectionlist.filter(element => {
      if (element.Check && !uniqueUserIds.has(element.WorkFlowId)) {
        uniqueUserIds.add(element.WorkFlowId);
        return true;
      }
      return false;
    });
    // / Assuming `this.SelectedUsers` is an array
    this.dynamicValues.push(...Array.from({ length: this.SelectedUsers.length }, (_, i) => i + 1));
    // Sort the SelectedUsers array by sortId in ascending order
    this.SelectedUsers = this.SelectedUsers.sort((a, b) => (a.sortId || 0) - (b.sortId || 0));
    console.log(this.SelectedUsers, "Selected values");
    // Check if at least one user is selected
    if (this.SelectedUsers.length > 0) {
      // Set selectedWorkflowId from the first selected user
      this.selectedWorkflowId = this.SelectedUsers[0]?.WorkFlowId;
      this.WorkFlowDetails(this.selectedWorkflowId);
    } else {
      console.error('No users selected or WorkflowLeftsectionlist is empty!');
    }
    if (!this.SelectedUsers || this.SelectedUsers.length === 0) {
      console.error('SelectedUsers is not initialized properly!');
      return;
    }

    document.getElementById("workflow-user-modal-backdrop").style.display = "none";
    document.getElementById("workflow-user-modal").style.display = "none";
  }

  _AttachmentRequired: any;
  FileUploadErrorlog: boolean = false;
  newDisabledUsers = [];
  Workflowdetails: any;
  WorkflowErrorlog: boolean = false;
  WorkFlowDetails(WorkFlowId: number) {
    this.selectedWorkflowId = WorkFlowId;
    this._obj.WorkFlowId = WorkFlowId;
    this.inboxService.GetWorkFlowDetailsAPI(this._obj)
      .subscribe(data => {

        console.log(data, "get workflow details");
        this.Workflowdetails = data["Data"]["WorkFlowDetails"];
        this.Workflowdetails = this.Workflowdetails.sort((a, b) => a.SortId - b.SortId);
        this._AttachmentRequired = this.Workflowdetails[0].AttachmentRequired;
        console.log(this._AllUsersCCList, "CC users");
        console.log(this.Workflowdetails, "Selected workflow data");
        this._disabledUsers = [this._LoginUserId];
        this.newDisabledUsers = this.Workflowdetails.map(workf => workf.UserId);

        // Add new values to _disabledUsers without overwriting the existing values
        this.newDisabledUsers.forEach(employeeId => {
          if (!this._disabledUsers.includes(employeeId)) {
            this._disabledUsers.push(Number(employeeId)); // Only add if it's not already present
            // alert(this._disabledUsers.length)
          }
        });
        //this._AllUsersCCList = this._AllUsersCCList.filter(user => !this._disabledUsers.includes(user.CreatedBy));
        console.log(this._disabledUsers, "disabled users");
        // Trigger change detection
        // this.GetDropdowns();
        this.cdr.detectChanges();
      });
    this.WorkflowErrorlog = false;
    this.cdr.detectChanges();
  }

  // Function to remove a specific EmployeeId from _disabledUsers

  getCreatedByFromEmployee(employeeId: number): number | null {
    const employee = this._AllUsersCCList.find(user => user.EmployeeId === employeeId);

    return employee ? employee.UserId : null;
  }

  close_workflow_user_modal() {
    this.WorkflowLeftsectionlist.forEach(element => {
      element.Check = false;
      element.sortId = "";
    });
    document.getElementById("workflow-user-modal-backdrop").style.display = "none";
    document.getElementById("workflow-user-modal").style.display = "none";
  }


  selectedAttachments: any[] = []; // Array to hold selected attachments

  onCheckboxChange(event: Event, attachment: any): void {
    console.log(attachment, "123")
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Add the attachment to the selected list
      this.selectedAttachments.push(attachment['AttachmentUrl']);
    } else {
      // Remove the attachment from the selected list
      this.selectedAttachments = this.selectedAttachments.filter(
        (item) => item !== attachment['AttachmentUrl']
      );
    }

    console.log('Selected Attachments:', this.selectedAttachments);

  }


  MergeDocument() {

    this._obj.Urls = this.selectedAttachments;
    this.inboxService.MergeDocumentApI(this._obj)
      .subscribe(data => {
        console.log(data, "Merge Document");
      })
  }

}



export function formatFileSize(sizeInKB: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInKB >= GB) {
    return (sizeInKB / GB).toFixed(2) + ' GB';
  } else if (sizeInKB >= MB) {
    return (sizeInKB / MB).toFixed(2) + ' MB';
  } else {
    return (sizeInKB / KB).toFixed(2) + ' KB';
  }

}

export function formatFileSizeCould(sizeInKB: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInKB >= GB) {
    return (sizeInKB / GB).toFixed(2) + ' GB';
  } else if (sizeInKB >= MB) {
    return (sizeInKB / MB).toFixed(2) + ' MB';
  } else {
    return (sizeInKB / KB).toFixed(2) + ' KB';
  }

}


function parseISO(CreatedDate: any) {
  throw new Error('Function not implemented.');
}

function startOfWeek(today: Date, arg1: { weekStartsOn: number; }) {
  throw new Error('Function not implemented.');
}

