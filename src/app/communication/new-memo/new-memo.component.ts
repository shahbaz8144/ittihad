import { Component, OnInit, Renderer2, ElementRef, ViewChildren, ChangeDetectorRef, ViewChild, QueryList, Input, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import Swal from 'sweetalert2';
declare var $: any;
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {  HttpEventType } from '@angular/common/http';
import { DOCUMENT, DatePipe } from '@angular/common';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { MemoReplyService } from 'src/app/_service/memo-reply.service';
import { UserPolicyMasterServiceService } from 'src/app/_service/user-policy-master-service.service';
import { UserPolicyMasterDTO } from 'src/app/_models/user-policy-master-dto';
import * as moment from 'moment';
// import { AzureStorageService } from 'src/app/_service/azure-storage.service';
import { NewMemo } from 'src/app/_models/new-memo.DTO';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as  Editor from 'ckeditor5-custom-build/build/ckeditor';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { DraftComponent } from 'src/app/communication/draft/draft.component';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { GacArchivingService } from 'src/app/_service/GacArchivingService';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';


@Component({
  selector: 'app-new-memo',
  templateUrl: './new-memo.component.html',
  styleUrls: ['./new-memo.component.css'],
  providers: [DatePipe
  ]
})



export class NewMemoComponent implements OnInit {

  // couldfiles: any[] = [];
  // @ViewChildren(DraftComponent) childComponent: DraftComponent;
  // @ViewChild(DraftComponent) childComponent: DraftComponent;
  @ViewChild(DraftComponent) childComponent: DraftComponent;

  @ViewChild('autoTO') autoComplete: MatAutocomplete;
  @ViewChild('autoCC') autoCompleteCC: MatAutocomplete;
  @ViewChild('inputField1', { read: MatAutocompleteTrigger }) autoCompleteTrigger1: MatAutocompleteTrigger;
  @ViewChild('inputField2', { read: MatAutocompleteTrigger }) autoCompleteTrigger2: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) customTriggerCC!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTriggerCC: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletesCC: QueryList<MatAutocompleteTrigger>;
  openAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCC(Acomp: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Acomp);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  @ViewChild('editors') editors!: CKEditorComponent;
  openAutocompleteDrpDwnTO(TOUserOpen: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === TOUserOpen);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnTO(closeToUser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === closeToUser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }

  openAutocompleteDrpDwnCCUser(OpenCCuser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenCCuser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCCUser(OpenCCuserReply: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenCCuserReply);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }

  url = '../../../assets/media/files/anounce2.jpg';
  public Editor: any = Editor;
  selectedToEmpIds: any = [];
  selectedCCEmpIds: any = [];
  selectedToEmployees: any = [];
  selectedCCEmployees: any = [];
  _disabledUsers: number[] = [];
  isSelection: boolean = false;
  isSelectionCC: boolean = false;
  ToErrorlog: boolean = false;
  WorkflowErrorlog: boolean = false;
  _IsConfidential: boolean;
  Meetings: boolean;
  Labels: boolean;
  SubjectErrorlog: boolean = false;
  QuestionTypeErrorlog: boolean = false;
  DescriptionErrorlog: boolean = false;
  selectedCCUser: any = [];
  SelectedCCIds: any = [] = [];
  _CCUserSubList: any = [];
  isSelection_AddUsers: boolean = false;
  isSelectionAddUser: boolean = false;
  selectedToUser: any = [];
  selectedToUserIds: any = [];
  _ToUserSubList: any = [];
  ApprovalPending: boolean;
  ReplyRequired: boolean;
  AnouncementsSearch: string;
  _checkedAnnSugg = [];
  CompanyIds = [];
  DepartmentIds = [];
  DesignationIds = [];
  TextBox = [];
  QuestionType: string;
  _arrayText = [];
  selectedOptions = [];
  text: string;
  check: any;
  SerachUser: string;
  UserList: any[] = []
  SelectNewArray = [];
  searchTOfromhere: string;
  searchCCfromhere: string;
  EmployeeId: number;
  WorkflowLeftsectionlist: any;
  Workflowdetails: any;
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
    //placeholder: 'Enter text here...',
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
    toolbarPosition: 'top'
    // ,
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
  };
  UserIds: any[] = [];
  ReportingUserJson = [];
  _selectedUserIds: any = [];
  Users: boolean = true;
  // @Input() currentMemoTypeValue: string;
  @Input() selectedMemoType: any = "New Memo";
  ObjgetCompanyList: any;
  FilteredUsersJson: any;
  ObjgetDesignationList: any;
  ObjgetDepartmentList: any;
  Company: any;
  companycheckbox: any;
  CompanyName: string;
  DepartmentName: string;
  DesignationName: string;
  _obj: InboxDTO;
  _obj1: UserPolicyMasterDTO;
  CompanyHide: boolean = false;
  DerptHide: boolean = false;
  Design: boolean = false
  CmySelectValue = [];
  DeprtSelectValue = [];
  DesigSelectValue = [];
  _LstToUsers: any;
  _LstCCUsers: any;
  selectedToUsers: []
  _lstMultipleFiales: any;
  _UpdatedTOUsers: any[];
  _UpdatedCCUsers: any[];
  myFiles: string[] = [];
  AllDatesSDandED: any[] = [];
  employeeForm: any;
  isFormDisabled: boolean;
  _NewMemoform: UntypedFormGroup;
  uuidValue: string;
  progress: number = 0;
  txtSearch: any[];
  TextUser: string;
  All: boolean = false;
  //myFiles:string [] = [];
  StartDate = new Date();
  myDate = new Date();
  _NewMemoobj: NewMemo;
  DeadlineDatecheck: boolean = false;
  EndDate = new Date();
  PollDuration = new Date();
  disablePreviousDate = new Date();
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  error: string = "";
  CompanyDrp: any;
  _DisplayOptions: boolean;
  _ReportingUserNote: boolean;
  Attachment: boolean;
  CurrentRoleId: number;
  CheckboxCount = [];
  _LoginUserId: number;
  ReferenceNo: any;
  SearchorEnteraText: string;
  AskaQuestion: string;
  Choice: string;
  currentLang: "ar" | "en" = "ar";
  private hubConnectionBuilder!: HubConnection;
  offers: any[] = [];
  readonly signalUrl = this.commonUrl.Signalurl;
  constructor(
    private inboxService: InboxService,
    public memoreplyService: MemoReplyService,
    public newmemoService: NewMemoService,
    private _snackBar: MatSnackBar,
    public service: UserPolicyMasterServiceService,
    private renderer: Renderer2,
    private el: ElementRef,
    // private azureStorageService: AzureStorageService,
    private commonUrl: ApiurlService,
    private _draft: DraftComponent,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private gacArchivingService: GacArchivingService,
    private cdr: ChangeDetectorRef
  ) {
    this.EmployeeId = parseInt(this.currentUserValue.EmployeeCode);
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.SearchorEnteraText = lang === 'en' ? "Search or Enter a Text..." : 'ابحث أو أدخل نصًا';
      this.AskaQuestion = lang === 'en' ? "Ask a Question" : "طرح سؤال";
      this.Choice = lang === 'en' ? "Choice" : "خيار  "
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

    });

    this.uuidValue = UUID.UUID();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    // this.ReferenceNo = this.uuidValue;
    this._obj = new InboxDTO();
    this._obj1 = new UserPolicyMasterDTO();
    this._UpdatedTOUsers = [];
    this._UpdatedCCUsers = [];
    this._lstMultipleFiales = [];
    this._disabledUsers = [this._LoginUserId];
    this.myFiles = [];
    this.ObjgetCompanyList = [];
    this.ObjgetDepartmentList = [];
    this.ObjgetDesignationList = [];
    this.AllDatesSDandED = [];
    this.FilteredUsersJson = [];
    this._NewMemoobj = new NewMemo();
    this._LoginUserId = this.currentUserValue.createdby;
    this.EndDate.setDate(this.StartDate.getDate() + 1);
  }
  @Input() isSMailClicked: boolean;
  @Input() newmemofile: any[] = [];  // Ensure this matches the parent's variable
  @Input() couldfile: any[] = [];

  ngOnChanges(){
      console.log("new update value:",this.newmemofile);
  }


  ngOnInit(): void {
    console.log(this.couldfile, "could files");
    console.log(this.newmemofile, "Steambox files");  
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    window.addEventListener('scroll', () => {
      this.autocompletes.forEach((ac) => {
        if (ac.panelOpen)
          ac.updatePosition();
      });
    }, true);
    this.progress = 0;
    this.error = "";
    this.resetForm();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    this.newmemoService._NewMemoobj.MemoType = "New Memo";
    this.GetDropdowns();
    this._obj = new InboxDTO();
    this._arrayText.push(1);
    this._arrayText.push(2);
    this.CurrentRoleId = this.currentUserValue.RoleId;
    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'progressHub?userId=' + this.currentUserValue.createdby)
      .build();
  }

  selectStartDate(event) {
    // this.StartDate = new Date(this.convert(event.value));
    // this.EndDate = new Date(this.convert(event.value));

    this.StartDate = new Date(event.value);
    // Calculate end date as tomorrow
    this.EndDate = new Date(this.StartDate);
    this.EndDate.setDate(this.StartDate.getDate() + 1);
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  GetAnnouncementDrps() {
    this.service.GetCompanyList()
      .subscribe(data => {
        this._obj1 = data as UserPolicyMasterDTO;
        this.ObjgetCompanyList = this._obj1.Data["CompanyList"];
        this.ObjgetDepartmentList = this._obj1.Data["JDepartmentList"];
        this.ObjgetDesignationList = this._obj1.Data["JDesignationList"];
      })
  }

  SelectCompany(event) {
    let _id = event.target.id.split('_');
    this.ObjgetCompanyList.forEach(element => {
      if (element.CompanyId == _id[1] && event.target.checked) {
        element.isChecked = true;
      }
      else if (element.CompanyId == _id[1] && !event.target.checked) {
        element.isChecked = false;
      }
    });
    this.CmySelectValue = this.ObjgetCompanyList.filter(x => x.isChecked == true);
    console.log(this.CmySelectValue, "company value");

    if (this.CmySelectValue.length > 0) {
      this.CompanyHide = true;
    } else {
      this.CompanyHide = false;
    }
    this.SelectUserList();
    // console.log(this.CmySelectValue);
    // if (event.target.checked) {
    //   const _val = this.ObjgetCompanyList.filter(x => x.CompanyId == event.target.id);
    //   var jsonData = {};
    //   var CompanyId = "CompanyId";
    //   jsonData[CompanyId] = event.target.id;
    //   var CompanyName = "CompanyName";
    //   jsonData[CompanyName] = _val[0].CompanyName;
    //   var Checked = "Checked";
    //   jsonData[Checked] = true;
    //   this.CmySelectValue.push(jsonData);
    // }
    // else{
    //   this.CmySelectValue = this.CmySelectValue.filter(m => m["CompanyId"] !== event.target.id);
    // }
  }

  removeSelectedCompany(CompanyId) {
    this.ObjgetCompanyList.forEach(element => {
      if (element.CompanyId == CompanyId) {
        element.isChecked = false;
      }
    });
    this.CmySelectValue = this.ObjgetCompanyList.filter(x => x.isChecked == true);
    this.SelectUserList();
    if (this.CmySelectValue.length > 0) {
      this.CompanyHide = true;
    } else {
      this.CompanyHide = false;
    }
  }
  SelectDepartment(event) {
    let _id = event.target.id.split('_');
    this.ObjgetDepartmentList.forEach(element => {
      if (element.DepartmentId == _id[1] && event.target.checked) {
        element.isChecked = true;
      }
      else if (element.DepartmentId == _id[1] && !event.target.checked) {
        element.isChecked = false;
      }
    });
    this.DeprtSelectValue = this.ObjgetDepartmentList.filter(x => x.isChecked == true);
    if (this.DeprtSelectValue.length > 0) {
      this.DerptHide = true;
    } else {
      this.DerptHide = false;
    }
    this.SelectUserList();
    //  console.log(this.DeprtSelectValue)
  }
  removeSelectedDepartment(DepartmentId) {
    this.ObjgetDepartmentList.forEach(element => {
      if (element.DepartmentId == DepartmentId) {
        element.isChecked = false;
      }
    });
    this.DeprtSelectValue = this.ObjgetDepartmentList.filter(x => x.isChecked == true);
    this.SelectUserList();
    if (this.DeprtSelectValue.length > 0) {
      this.DerptHide = true;
    } else {
      this.DerptHide = false;
    }

  }
  SelectDesignation(event) {
    let _id = event.target.id.split('_');
    this.ObjgetDesignationList.forEach(element => {
      if (element.DesignationId == _id[1] && event.target.checked) {
        element.isChecked = true;
      }
      else if (element.DesignationId == _id[1] && !event.target.checked) {
        element.isChecked = false;
      }
    });
    this.DesigSelectValue = this.ObjgetDesignationList.filter(x => x.isChecked == true);
    if (this.DesigSelectValue.length > 0) {
      this.Design = true;
    } else {
      this.Design = false;
    }
    this.SelectUserList();
    // console.log(this.DesigSelectValue)
  }
  removeSelectedDesignation(DesignationId) {
    this.ObjgetDesignationList.forEach(element => {
      if (element.DesignationId == DesignationId) {
        element.isChecked = false;
      }
    });
    this.DesigSelectValue = this.ObjgetDesignationList.filter(x => x.isChecked == true);
    this.SelectUserList();
    if (this.DesigSelectValue.length > 0) {
      this.Design = true;
    } else {
      this.Design = false;
    }
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  // ngOnChanges()	{
  //   this.GetDropdowns();
  // }
  anounc_comp() {
    $("#cmp-anou").addClass("anounce-option-selected");
    $("#dept-anou").removeClass("anounce-option-selected");
    $("#desgn-anou").removeClass("anounce-option-selected");

    $("#cmp-view").addClass("show");
    $("#dept-view").removeClass("show");
    $("#desgn-view").removeClass("show");
  }
  anounc_dept() {
    $("#cmp-anou").removeClass("anounce-option-selected");
    $("#dept-anou").addClass("anounce-option-selected");
    $("#desgn-anou").removeClass("anounce-option-selected");

    $("#cmp-view").removeClass("show");
    $("#dept-view").addClass("show");
    $("#desgn-view").removeClass("show");
  }
  anounc_desgn() {
    $("#cmp-anou").removeClass("anounce-option-selected");
    $("#dept-anou").removeClass("anounce-option-selected");
    $("#desgn-anou").addClass("anounce-option-selected");

    $("#cmp-view").removeClass("show");
    $("#dept-view").removeClass("show");
    $("#desgn-view").addClass("show");
  }
  resetForm(form?: NgForm) {
    // if (form != null)
    //   form.resetForm();
    this.newmemoService._NewMemoobj.ReferenceNo = this.uuidValue;
    this.newmemoService._NewMemoobj.DeadLineDate = new Date();
    this.newmemoService._NewMemoobj = {
      IsConfidential: false,
      ReferenceNo: this.uuidValue,
      MemoType: 'New Memo',
      CreatedBy: this.currentUserValue.createdby,
      Subject: '',
      Purpose: "",
      Attachment: false,
      ToUserxml: '',
      CCUserxml: '',
      Reply: false,
      ApprovalPending_F: false,
      Deadline_sort: false,
      DeadLineDate: new Date(),
      // Flowb: false,
      // FlowId: null,
      // WorkFlowdatesxml: '',
      // ApprovalType: '',
      CCUserAry: '',
      ToUserAry: '',
      // selectedCCUser: [],
      // selectedToUser: [],
      DraftId: ''
    }
  }
  _AllUsersList: any[] = [];
  _AllUsersToList: any[] = [];
  _AllUsersCCList: any[] = [];
  GetDropdowns() {

    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.organizationid = this.currentUserValue.organizationid;
    this.inboxService.NewMemoDropdowns(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _UsersLst = JSON.parse(this._obj.UserJson);
        this._AllUsersList = _UsersLst;
        this._AllUsersToList = _UsersLst;
        this._AllUsersCCList = _UsersLst;
        // this._LstToUsers.forEach(element => {
        //   this._UpdatedTOUsers.push({
        //     UserId: element.UserId,
        //     ContactName: element.ContactName,
        //     disabled: false
        //   })
        //   // this._ToUserSubList = this._UpdatedTOUsers;
        // });
      });

    // console.log(this._UpdatedTOUsers,"TOUser");
    // console.log(this._UpdatedCCUsers,"_UpdatedCCUsers");
  }
  onChangeToUser(newValue) {
    this._UpdatedCCUsers = [];
    this._LstToUsers.forEach(element => {
      let _SelectedVal = 0;
      for (let index = 0; index < newValue.length; index++) {
        if (element.UserId == newValue[index]) {
          _SelectedVal = newValue[index];

        }
      }
      if (_SelectedVal == element.UserId) {
        this._UpdatedCCUsers = [...this._UpdatedCCUsers, {
          UserId: element.UserId,
          ContactName: element.ContactName,
          disabled: true
        }];
      }
      else {
        this._UpdatedCCUsers = [...this._UpdatedCCUsers, {
          UserId: element.UserId,
          ContactName: element.ContactName,
          disabled: false
        }];
      }
    });
  }
  onChangeCCUser(newValue) {

    this._UpdatedTOUsers = [];
    this._LstToUsers.forEach(element => {
      let _SelectedVal = 0;
      for (let index = 0; index < newValue.length; index++) {
        if (element.UserId == newValue[index]) {
          _SelectedVal = newValue[index];
        }
      }
      if (_SelectedVal == element.UserId) {
        this._UpdatedTOUsers = [...this._UpdatedTOUsers, {
          UserId: element.UserId,
          ContactName: element.ContactName,
          disabled: true
        }];
      }
      else {
        this._UpdatedTOUsers = [...this._UpdatedTOUsers, {
          UserId: element.UserId,
          ContactName: element.ContactName,
          disabled: false
        }];
      }
    });
  }


  FileUploadErrorlogs:boolean = false;
  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[]; // Type assertion to File[]
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]; // Now TypeScript knows 'file' is of type 'File'
        const fileSizeInKB = file.size / 1024; // File size in KB
  
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
  
      console.log(this._lstMultipleFiales, 'Files');
      $('#File_pop').removeClass('show');
  
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


  // onFileChange(event: any): void {

  //   if (event.target.files.length > 0) {
  //     var length = event.target.files.length;
  //     for (let index = 0; index < length; index++) {
  //       const file = event.target.files[index];
  //       var contentType = file.type;
  //       if (contentType === "application/pdf") {
  //         contentType = ".pdf";
  //       }
  //       else if (contentType === "image/png") {
  //         contentType = ".png";
  //       }
  //       else if (contentType === "image/jpeg") {
  //         contentType = ".jpeg";
  //       }
  //       else if (contentType === "image/jpg") {
  //         contentType = ".jpg";
  //       }
  //       const fileSizeInKB = Math.round(file.size / 1024);
  //       this.myFiles.push(event.target.files[index].name);
  //       var d = new Date().valueOf();
  //       this._lstMultipleFiales = [...this._lstMultipleFiales, {
  //         UniqueId: d,
  //         FileName: event.target.files[index].name,
  //         Size: event.target.files[index].size,
  //         Files: event.target.files[index]
  //       }];
  //       console.log(this._lstMultipleFiales, "Files");
  //       $('#File_pop').removeClass('show');
  //       // Reset file input value to allow re-upload of the same file
  //       // this.azureStorageService.uploadFile(file)
  //       // .then((blobUrl) => {
  //       //   console.log('File uploaded successfully. Blob URL:', blobUrl);
  //       // })
  //       // .catch((error) => {
  //       //   alert(error)
  //       //   console.error('Error uploading file:', error);
  //       // });
  //     }
  //   }
  // }


  // RemoveSelectedFile(_id) {
  //   var removeIndex = this._lstMultipleFiales.map(function (item) { return item.UniqueId; }).indexOf(_id);
  //   this._lstMultipleFiales.splice(removeIndex, 1);

  // }

  RemoveSelectedFileinstreambox(_id) {
    var removeIndex = this.newmemofile.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this.newmemofile.splice(removeIndex, 1);
  }

  // RemoveSelectedCouldFile(_id) {
  //   var removeIndex = this.couldfiles.map(function (item) { return item.UniqueId; }).indexOf(_id);
  //   this.couldfiles.splice(removeIndex, 1);
  // }

  OnSubmitAnnouncement() {
    this._selectedUserIds = [];
    this.CmySelectValue.forEach(element => {
      this.CompanyIds.push(element.CompanyId)
    });
    // this.CompanyIds = Array.from(new Set(this.CompanyIds));
    this.DeprtSelectValue.forEach(element => {
      this.DepartmentIds.push(element.DepartmentId)
    });
    this.DesigSelectValue.forEach(element => {
      this.DesignationIds.push(element.DesignationId)
    });
    this._obj.StartDateTime = this.StartDate;
    this._obj.EndDateTime = this.EndDate;
    this.SubjectErrorlog = false;
    this.DescriptionErrorlog = false;
    if (this.newmemoService._NewMemoobj.Subject === undefined || this.newmemoService._NewMemoobj.Subject === "") {
      this.SubjectErrorlog = true;
    } else if (this.newmemoService._NewMemoobj.Purpose === "") {
      this.DescriptionErrorlog = true;
    }

    if (this.SubjectErrorlog || this.DescriptionErrorlog) {
      return false;
    }
    this._obj.Subject = this.newmemoService._NewMemoobj.Subject;
    this._obj.Description = this.newmemoService._NewMemoobj.Purpose;
    // this._obj.Attachment = false;
    if (this._lstMultipleFiales.length > 0) {
      this._obj.Attachment = true;
    }
    else {
      this._obj.Attachment = false;
    }
    this._obj.AnnouncementStatus = true;
    this._obj.IsAll = this.All;
    const _userids = [];
    this.FilteredUsersJson.forEach(element => {
      if (element.isChecked)
        _userids.push(element.UserId)
    });
    this._obj.UserIds = _userids.toString();
    this._obj.CompanyIds = this.CompanyIds.toString();
    this._obj.DepartmentIds = this.DepartmentIds.toString();
    this._obj.DesignationIds = this.DesignationIds.toString();

    if (this.CompanyIds.length != 0) this._obj.IsCompany = true;
    else this._obj.IsCompany = false;
    if (this.DepartmentIds.length != 0) this._obj.IsDepartment = true;
    else this._obj.IsDepartment = false;
    if (this.DesignationIds.length != 0) this._obj.IsDesignation = true;
    else this._obj.IsDesignation = false;
    this._obj.ReportingUserId = this.currentUserValue.createdby;
    if (this.currentUserValue.RoleId == 502) this._obj.IsReportingUser = false;
    else this._obj.IsReportingUser = true;
    // this.FilteredUsersJson.forEach(element => {
    //   if (element.isChecked)
    //     this._selectedUserIds.push(element.UserId);
    // });

    this.newmemoService.AddAnnouncement(this._obj).subscribe(
      data => {
        // console.log(data,"Announcement list");
        this._obj = data as InboxDTO;
        if (data["Message"] == "1") {
          if (this._lstMultipleFiales.length > 0) {
            const frmData = new FormData();
            for (var i = 0; i < this._lstMultipleFiales.length; i++) {
              frmData.append("fileUpload", this._lstMultipleFiales[i].Files);
            }
            frmData.append("AnnouncementId", data["Data"].AnnouncementId.toString());
            this.hubConnectionBuilder.start().then(() => console.log('Connection started.......!'))
              .catch(err => console.log('Error while connect with server'));
            $('.progress-overlay').addClass('visible');
            this.newmemoService.UploadAnnouncemtAttachmenst(frmData).subscribe({
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
                      this.hubConnectionBuilder.on("ReceiveProgress", (progressbar) => {
                        this.progress = progressbar;
                        // console.log(progressbar, "progressbarAnnouncement");
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
                      this._snackBar.open('تم إرسال الإعلان بنجاح', 'تنتهي الآن', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                        panelClass: ['blue-snackbar']
                      });
                    } else {
                      this._snackBar.open('Announcement Sent Successfully', 'End now', {
                        duration: 5000,
                        horizontalPosition: "right",
                        verticalPosition: "bottom",
                        panelClass: ['blue-snackbar']
                      });
                    }
                    setTimeout(() => {
                      this.progress = 0;
                    }, 1000);
                    (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
                    (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
                    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                    $('.progress-overlay').removeClass('visible');
                    this.ResetAnnouncementsAPI();
                }
              }
            });
          } else {
            const language = localStorage.getItem('language');
            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تم إرسال الإعلان بنجاح', 'تنتهي الآن', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
                panelClass: ['blue-snackbar']
              });
            } else {
              this._snackBar.open('Announcement Sent Successfully', 'End now', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
                panelClass: ['blue-snackbar']
              });
            }

          }
          (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
          (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.ResetAnnouncementsAPI();

        }
        this.EndDate.setDate(this.StartDate.getDate() + 1);
        // (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
        // this._lstMultipleFiales = [];
        // this.myFiles = []
      });

  }
  ResetAnnouncementsAPI() {
    this.check = false;
    this.CheckboxCount = [];
    this.StartDate = new Date();
    this.EndDate = new Date();
    this.newmemoService._NewMemoobj.Subject = "";
    this.newmemoService._NewMemoobj.Purpose = " ";
    this.CmySelectValue = [];
    this.DeprtSelectValue = [];
    this.DesigSelectValue = [];
    this.FilteredUsersJson = [];
    this.CompanyIds = [];
    this.DepartmentIds = [];
    this.DesignationIds = [];
    this._lstMultipleFiales = [];
    this.myFiles = []
    this.All = false;
    this.ObjgetCompanyList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDepartmentList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDesignationList.forEach(element => {
      element.isChecked = false;
    });
    (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
  }

  ResetAnnouncements() {
    this.check = false;
    this.CheckboxCount = [];
    this.StartDate = new Date();
    this.EndDate = new Date();
    this.newmemoService._NewMemoobj.Subject = "";
    this.newmemoService._NewMemoobj.Purpose = " ";
    this.CmySelectValue = [];
    this.DeprtSelectValue = [];
    this.DesigSelectValue = [];
    this.FilteredUsersJson = [];
    this.CompanyIds = [];
    this.DepartmentIds = [];
    this.DesignationIds = [];
    this._lstMultipleFiales = [];
    this.myFiles = []
    this.All = false;
    this.ObjgetCompanyList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDepartmentList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDesignationList.forEach(element => {
      element.isChecked = false;
    });
    (<HTMLInputElement>document.getElementById("fileUpload")).value = "";

    // (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
    this.CloseReplyPanelV2();
  }
  OnSubmitSuggestions() {
    this._selectedUserIds = [];
    this.QuestionTypeErrorlog = false;
    if (this.QuestionType === undefined || this.QuestionType === "") {
      this.QuestionTypeErrorlog = true;
    }
    if (this.QuestionTypeErrorlog) {
      return false;
    }
    let _count = 0;
    if (this.QuestionType == undefined) {
      document.getElementById("txtquestiontype").classList.add("txtinvalid");
      _count = 1;
      document.getElementById("txtquestiontype").classList.remove("border-0");
    }
    else {
      document.getElementById("txtquestiontype").classList.add("border-0");
      document.getElementById("txtquestiontype").classList.remove("txtinvalid");
      _count = 0;
    }
    let _json = [];
    this._arrayText.forEach(element => {
      let _jsonobjec = {};
      let value = (<HTMLInputElement>document.getElementById("txt_" + element)).value;
      if (value == "") {
        _count = 1;
        document.getElementById("txt_" + element).classList.add("txtinvalid");
      }
      else {
        var Option = "Option";
        _jsonobjec[Option] = value;
        _json.push(_jsonobjec);
        document.getElementById("txt_" + element).classList.remove("txtinvalid");
      }
    });
    if (_count > 0) {
      alert('Fields Required');
      return false;
    }
    let _finalArray = [];
    var jsonData = {};
    var QuestionType = "QuestionType";
    jsonData[QuestionType] = this.QuestionType;
    var Options = "Options";
    jsonData[Options] = _json;
    var Date = "Date";
    jsonData[Date] = moment(this.PollDuration).format("YYYY-MM-DD");
    _finalArray.push(jsonData);

    this._obj.Suggestionjson = JSON.stringify(_finalArray)
    this.CmySelectValue.forEach(element => {
      this.CompanyIds.push(element.CompanyId)
    });
    this.DeprtSelectValue.forEach(element => {
      this.DepartmentIds.push(element.DepartmentId)
    });
    this.DesigSelectValue.forEach(element => {
      this.DesignationIds.push(element.DesignationId)
    });
    this._obj.IsAll = this.All;
    this._obj.CompanyIds = this.CompanyIds.toString();
    this._obj.DepartmentIds = this.DepartmentIds.toString();
    this._obj.DesignationIds = this.DesignationIds.toString();
    const _userids = [];
    this.FilteredUsersJson.forEach(element => {
      if (element.isChecked)
        _userids.push(element.UserId)
    });
    this._obj.UserIds = _userids.toString();

    if (this.CompanyIds.length != 0) this._obj.IsCompany = true;
    else this._obj.IsCompany = false;
    if (this.DepartmentIds.length != 0) this._obj.IsDepartment = true;
    else this._obj.IsDepartment = false;
    if (this.DesignationIds.length != 0) this._obj.IsDesignation = true;
    else this._obj.IsDesignation = false;
    this._obj.ReportingUserId = this.currentUserValue.createdby;
    if (this.currentUserValue.RoleId == 502) this._obj.IsReportingUser = false;
    else this._obj.IsReportingUser = true;
    // this.FilteredUsersJson.forEach(element => {
    //   if (element.isChecked)
    //     this._selectedUserIds.push(element.UserId);
    // });
    this.newmemoService.MemoSuggestions(this._obj).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (this._obj.message == "1") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم إرسال الاقتراح بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Suggestion Send Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }

        } else {
          this._snackBar.open('Suggestion Already Tagged', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['red-snackbar']
          });
        }
        this.CompanyHide = false;
        this.DerptHide = false;
        this.Design = false;
        this.QuestionTypeErrorlog = false;
        this.ResetSuggestions();
        (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
        (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
        document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
        document.getElementById("plus_div").classList.remove("d-none");
        document.getElementById("plus_div").classList.add("d-flex");
      });

  }
  selectAll(event) {
    if (event.target.checked) {
      this.FilteredUsersJson.forEach(element => {
        element.isChecked = true;
      });
    }
    else {
      this.FilteredUsersJson.forEach(element => {
        element.isChecked = false;
      });
    }
    const _count = this.FilteredUsersJson.filter(x => x.isChecked == true).length;
    this.CheckboxCount = _count;
    if (this.FilteredUsersJson.length != _count) {
      this.check = false;
    } else {
      this.check = true;
    }

  }
  unselectOption(value) {

    this.FilteredUsersJson.forEach(element => {
      if (value.target.id == element.UserId) {
        element.isChecked = value.target.checked;
        if (value.target.checked) {
          this.SelectNewArray.push(element.UserId);
        }
        else {
          const index = this.SelectNewArray.indexOf(value.target.id);
          this.SelectNewArray.splice(index, 1);
        }
      }
    });
    const _count = this.FilteredUsersJson.filter(x => x.isChecked == true).length;
    this.CheckboxCount = _count;
    if (this.FilteredUsersJson.length != _count) {
      this.check = false;
    } else {
      this.check = true;
    }
  }

  SelectUserList() {

    this.CompanyIds = [];
    this.DepartmentIds = [];
    this.DesignationIds = [];
    this.CmySelectValue.forEach(element => {
      this.CompanyIds.push(element.CompanyId)
    });

    this.DeprtSelectValue.forEach(element => {
      this.DepartmentIds.push(element.DepartmentId)
    });

    this.DesigSelectValue.forEach(element => {
      this.DesignationIds.push(element.DesignationId)
    });

    this._obj.CompanyIds = this.CompanyIds.toString();
    this._obj.DepartmentIds = this.DepartmentIds.toString();
    this._obj.DesignationIds = this.DesignationIds.toString();
    this.newmemoService.SelectUser(this._obj).subscribe(
      data => {
        this._obj = data as InboxDTO;
        this.FilteredUsersJson = JSON.parse(data["FilteredUsersJson"]);
        this.FilteredUsersJson.forEach(element => {
          element.isChecked = false;
        });
        this.FilteredUsersJson.forEach(element => {
          this.SelectNewArray.forEach(selectedelement => {
            if (element.UserId == selectedelement) {
              element.isChecked = true;
            }
          });
        });
        // console.log(this.FilteredUsersJson,"Userlist");
        // console.log(this.SelectNewArray,"NewArrayData");
        const _count = this.FilteredUsersJson.filter(x => x.isChecked == true).length;
        this.CheckboxCount = _count;
        this.check = false;
        this._selectedUserIds = [];
        // this.SelectCompany(1);
      });
  }

  removetxt(id) {
    const index = this._arrayText.indexOf(id);
    this._arrayText.splice(index, 1);
    if (this._arrayText.length < 4) {
      document.getElementById("plus_div").classList.add("d-flex");
      document.getElementById("plus_div").classList.remove("d-none");
      return true;
    }
  }
  SelectNewTextBox() {
    if (this._arrayText.length == 3) {
      document.getElementById("plus_div").classList.add("d-none");
      document.getElementById("plus_div").classList.remove("d-flex");
      // return true;
    }
    if (this._arrayText.length == 4) return false;
    let min = 3;
    let max = 10000000;
    this._arrayText.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  ResetSuggestions() {
    this.newmemofile = [];
    this.QuestionType = "";
    this.QuestionTypeErrorlog = false;
    this._arrayText = [];
    this.check = false;
    this.CheckboxCount = [];
    this.FilteredUsersJson = [];
    let min = 3;
    let max = 10000000;
    this._arrayText.push(Math.floor(Math.random() * (max - min + 1)) + min);
    this._arrayText.push(Math.floor(Math.random() * (max - min + 1)) + min);
    this.PollDuration = new Date();
    this.CmySelectValue = [];
    this.DeprtSelectValue = [];
    this.DesigSelectValue = [];
    this.CompanyIds = [];
    this.DepartmentIds = [];
    this.DesignationIds = [];
    this.All = false;
    this.ObjgetCompanyList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDepartmentList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjgetDesignationList.forEach(element => {
      element.isChecked = false;
    });
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
    // (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("plus_div").classList.remove("d-none");
    document.getElementById("plus_div").classList.add("d-flex");

  }


  // onSubmit(form: NgForm) {
  //   $("body").addClass("progressattachment");
  //   const frmData = new FormData();
  //   for (var i = 0; i < this._lstMultipleFiales.length; i++) {
  //     frmData.append("files", this._lstMultipleFiales[i].Files);
  //   }
  //   if (this._lstMultipleFiales.length > 0) {
  //     form.value.Attachment = true;
  //   }
  //   else {
  //     form.value.Attachment = false;
  //   }
  //   let attvalu = form.value.Attachment;

  //   if (this.DeadlineDatecheck == false) {
  //     form.value.Deadline_sort = false;
  //   }
  //   else if (this.DeadlineDatecheck == true) {
  //     form.value.Deadline_sort = true;
  //     form.value.DeadLineDate = this.myDate;
  //   }

  //   // alert(this.myDate);

  //   this.newmemoService.NewMemo(form.value, this.myDate, this.DeadlineDatecheck).subscribe(
  //     res => {
  //       console.log(res, "Newmemodata");

  //       this._obj.message = res["Message"];
  //       this._obj.MailId = res["Data"].MailId;
  //       this._obj.ReplyId = res["Data"].ReplyId;
  //       // this._obj.NewMemosTrigger = res["Data"].NewMemosTrigger;
  //       frmData.append("mailId", this._obj.MailId.toString());
  //       frmData.append("MailId", this._obj.MailId.toString());
  //       frmData.append("barcode", "");
  //       frmData.append("referenceNo", form.value.ReferenceNo);
  //       frmData.append("isReply", "false");
  //       frmData.append("replyId", this._obj.ReplyId.toString());

  //       if (this._obj.message == "Success") {
  //         if (attvalu == true) {
  //           this.newmemoService.uploadFile(frmData).subscribe({
  //             next: (event) => {
  //               if (event.type === HttpEventType.UploadProgress) {
  //                 this.progress = Math.round((100 * event.loaded) / event.total);
  //               } else if (event.type === HttpEventType.Response) {
  //                 console.log('File uploaded successfully', event.body);
  //                 this.DeadlineDatecheck = false;
  //                 this.myDate = new Date();
  //                 this.htmlContent = '';
  //                 this._lstMultipleFiales = [];
  //                 (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
  //                 $("body").removeClass("progressattachment");
  //                 this._snackBar.open('Memo Sent Successfully', 'End now', {
  //                   duration: 5000,
  //                   horizontalPosition: "right",
  //                   verticalPosition: "bottom",
  //                   panelClass: ['blue-snackbar']
  //                 });
  //                 setTimeout(() => {
  //                   this.progress = 0;
  //                 }, 1500);
  //                 (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
  //                 (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
  //                 document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
  //                 document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  //                 this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger).subscribe(
  //                   data => {
  //                     console.log(data, "New Memos Triggered")
  //                   }
  //                 )
  //                 var _touse = [];
  //                 if (form.value.ToUserAry.length > 0) {
  //                   for (let index = 0; index < form.value.ToUserAry.length; index++) {
  //                     _touse.push(form.value.ToUserAry[index]);
  //                   }
  //                   for (let index = 0; index < form.value.CCUserAry.length; index++) {
  //                     _touse.push(form.value.CCUserAry[index]);
  //                   }
  //                   this.newmemoService.NewMemosNotification("New Memo", _touse.toString(), form.value.Subject, this._obj.MailId, this._obj.ReplyId).subscribe(
  //                     data => {
  //                       console.log(data, "New Memos Notifications");
  //                     }
  //                   )
  //                 }
  //               }
  //             },
  //             error: (e) => {
  //               console.error('Error uploading file', e);
  //             },
  //             complete: () => console.info('complete')
  //           }

  //           )
  //         }
  //         else {
  //           this.htmlContent = '';
  //           (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
  //           $("body").removeClass("progressattachment");
  //           this._snackBar.open('Memo Sent Successfully', 'End now', {
  //             duration: 5000,
  //             horizontalPosition: "right",
  //             verticalPosition: "bottom",
  //             panelClass: ['blue-snackbar']
  //           });
  //           setTimeout(() => {
  //             this.progress = 0;
  //           }, 1500);
  //           this.DeadlineDatecheck = false;
  //           this.myDate = new Date();
  //           this._lstMultipleFiales = [];

  //           (<HTMLInputElement>document.getElementById("fileUpload")).value = "";

  //           // (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
  //           (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
  //           (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
  //           document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
  //           document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  //           this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger).subscribe(
  //             data => {
  //               console.log(data, "New Memos Triggered")
  //             }
  //           );
  //           var _touse = [];
  //           if (form.value.ToUserAry.length > 0) {
  //             for (let index = 0; index < form.value.ToUserAry.length; index++) {
  //               _touse.push(form.value.ToUserAry[index]);
  //             }
  //             for (let index = 0; index < form.value.CCUserAry.length; index++) {
  //               _touse.push(form.value.CCUserAry[index]);
  //             }
  //             this.newmemoService.NewMemosNotification("New Memo", _touse.toString(), form.value.Subject, this._obj.MailId, this._obj.ReplyId).subscribe(
  //               data => {
  //                 console.log(data, "New Memos Notifications");
  //               }
  //             )
  //           }
  //         }
  //         this.resetForm(form);
  //       }
  //     }
  //   )
  // }
  isModalOpen = false;
  translations: any;
  IsSubmitting:boolean = false;
  onSubmitV2() {
    this._obj.MemoType = this.selectedMemoType;

    if (!this.selectedToEmpIds || this.selectedToEmpIds.length === 0) {
      $('.error-msg-pop-x').removeClass('d-none');
      this.ToErrorlog = true;
    } else {
      this.ToErrorlog = false;
    }

    // Check if newmemoService._NewMemoobj.Subject is empty
    if (!this.newmemoService._NewMemoobj.Subject) {
      $('.error-msg-pop-x').removeClass('d-none');
      this.SubjectErrorlog = true;
    } else if (this._obj.Subject = this.newmemoService._NewMemoobj.Subject) {
      this.SubjectErrorlog = false;
    }

    // Check if there are any errors
    if (this.ToErrorlog || this.SubjectErrorlog) {
      return false;
    }
    this._obj.Purpose = this.newmemoService._NewMemoobj.Purpose;
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
    if (this._lstMultipleFiales.length > 0 || this.newmemofile.length > 0) {
      this._obj.Attachment = true;
    }
    else {
      this._obj.Attachment = false;
    }
    let attvalu = this._obj.Attachment;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReferenceNo = "";
    this._obj.ToUserxml = this.selectedToEmpIds;
    this._obj.CCUserxml = this.selectedCCEmpIds
    this._obj.Reply = this.ReplyRequired === undefined ? false : this.ReplyRequired;
    this._obj.ApprovalPending_F = this.ApprovalPending === undefined ? false : this.ApprovalPending;
    if (this.myDate == null) {
      this.myDate = new Date("2000-01-01");
      this._obj.Deadline_sort = 0;
      this._obj.DeadLineDate = new Date("2000-01-01");
    }
    else {
      let parsedDate = moment(this.myDate, "YYYY-MM-DD");
      let outputDate = parsedDate.format("YYYY-MM-DD");
      this.myDate = new Date(outputDate);
      this._obj.Deadline_sort = 1;
      this._obj.DeadLineDate = this.myDate;
    }

    this._obj.IsConfidential = this._IsConfidential === undefined ? false : this._IsConfidential;

    // if(this.Meetings == false){
    //   this._obj.IsConfidential = this.Meetings === undefined ? false : this.Meetings;
    // }else if(this.Meetings == true){
    //   this._obj.IsConfidential = this.Meetings === undefined ? false : this.Meetings;
    //   this._obj.Meetings = this.newmemoService._NewMemoobj.Subject
    // }

    // if(this.Labels == false){
    //   this._obj.IsConfidential = this.Labels === undefined ? false : this.Labels;
    // }else if(this.Labels == true){
    //   this._obj.IsConfidential = this.Labels === undefined ? false : this.Labels;
    //   this._obj.LabelIds = this.SelectedLabelIds
    // }

if(this.IsSubmitting = true){
  this.newmemoService.NewMemoV2(this._obj).subscribe(
    res => {  

      console.log(res, "New Memo Data");
      this._obj.message = res["Message"];
      this._obj.MailId = res["Data"].MailId;
      this._obj.ReplyId = res["Data"].ReplyId;
      // this._obj.NewMemosTrigger = res["Data"].NewMemosTrigger;
      frmData.append("mailId", this._obj.MailId.toString());
      frmData.append("MailId", this._obj.MailId.toString());
      frmData.append("barcode", "");
      frmData.append("referenceNo", this._obj.ReferenceNo == null ? "" : this._obj.ReferenceNo);
      frmData.append("isReply", "false");
      frmData.append("replyId", this._obj.ReplyId.toString());
      // Assuming `cloudFilesObject` is the array or object you want to send as JSON
      const cloudFilesJson = JSON.stringify(this.newmemofile);
      frmData.append("cloudFiles", cloudFilesJson);
      console.log(cloudFilesJson , "Could files test");
      // console.log(typeof cloudFilesJson);
      // console.log("cloudFilesJson", cloudFilesJson);
      if (this._obj.message == "Success") {
        if (attvalu == true) {
          this.hubConnectionBuilder.start().then(() => console.log('Connection started.......!'))
            .catch(err => console.log('Error while connect with server'));
          $('.progress-overlay').addClass('visible');
          this.newmemoService.uploadFile(frmData).subscribe({
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
                    this.hubConnectionBuilder.on("ReceiveProgress", (progressbar) => {
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
                    this._snackBar.open('Memo Sent Successfully', 'End now', {
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
                  (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
                  (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
                  $('.progress-overlay').removeClass('visible');
                  // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                  const sideViewElement = document.getElementsByClassName("side_view")[0];
                  if (sideViewElement) {
                    sideViewElement.classList.remove("position-fixed");
                  }
                  document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                  this.newmemofile = [];

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
                  this.Clearfileld();
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
            this._snackBar.open('Memo Sent Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          }
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
          this.DeadlineDatecheck = false;
          this.myDate = new Date();
          this._lstMultipleFiales = [];
          this.newmemofile = [];
          (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
          (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
          (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
          $('.progress-overlay').removeClass('visible');
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

          this.inboxService.AddMemoToLabel(res["Data"].MailId.toString(), this.SelectedLabelIds.toString(), this.currentUserValue.createdby).subscribe(
            data => {
              console.log("Calling Label API");
              console.log(data, "Labels");
            });
          console.log(res["Data"].NewMemosTrigger, "New Memos Triggered");
          this.newmemoService.NewMemosTrigger(res["Data"].NewMemosTrigger, "").subscribe(
            data => {
              console.log(data, "New Memos Triggered");
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
            this.newmemoService.NewMemosNotification("New Reply", _touse.toString(), this.newmemoService._NewMemoobj.Subject, this._obj.MailId, this._obj.ReplyId).subscribe(
              data => {
                console.log(data, "New Memos Notifications");
              }
            )
          }
          this.Clearfileld();
        }
        // this.CloseReplyPanelV2();
      }
    }
  )
}

  }

  Clearfileld() {
    this.selectedToEmployees = [];
    this.selectedCCEmployees = [];
    this.selectedToEmpIds = [];
    this.selectedCCEmpIds = [];
    this.newmemoService._NewMemoobj.Purpose = "";
    this.newmemoService._NewMemoobj.Subject = "";
    this.ReplyRequired = false;
    this.ApprovalPending = false;
    this._IsConfidential = false;
    this.ToErrorlog = false;
    $('.error-msg-pop-x').addClass('d-none');
    this.SubjectErrorlog = false;
    this.DescriptionErrorlog = false;
    this.DeadlineDatecheck = false;
    this.myDate = new Date();
    this._lstMultipleFiales = [];
    this.newmemofile = [];
    this.SelectedLabelIds = [];
    this.Labels = false;
    (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
    this.IsSubmitting = false;
    this.FileUploadErrorlogs = false;
  }

  CloseReplyPanelV2() {
    this.newmemofile = [];
    this._lstMultipleFiales = [];
    this.IsSubmitting = false;
    if (this.currentLang == 'en') {
      this.selectedMemoType = "New Memo";
    } else {
      this.selectedMemoType = "مذكرة جديدة";
    }
    this.newmemoService._NewMemoobj.MemoType = "New Memo";
    $('#newmemo-memo-tab').addClass('active');
    $('#newmemo-announcement-tab').removeClass('active');
    $('#newmemo-vote-tab').removeClass('active');
    $('#newmemo-workflow-tab').removeClass('active');
    this.SelectedUsers = [];
    // alert(this.selectedMemoType);
    this.Meetings = false;
    this.CreateMeetingText = "";
    this.Labels = false;
    this.AddLabelList = "";
    this.check = false;
    this.CheckboxCount = [];
    this.selectedToEmployees = [];
    this.selectedCCEmployees = [];
    this.selectedToEmpIds = [];
    this.selectedCCEmpIds = [];
    this.newmemoService._NewMemoobj.Purpose = "";
    this.newmemoService._NewMemoobj.Subject = "";
    this.ReplyRequired = false;
    this.ApprovalPending = false;
    this._IsConfidential = false;
    this.ToErrorlog = false;
    $('.error-msg-pop-x').addClass('d-none');
    this.SubjectErrorlog = false;
    this.DescriptionErrorlog = false;
    this.DeadlineDatecheck = false;
    this.myDate = new Date();
    this.StartDate = new Date();
    this.EndDate = new Date(this.StartDate); // Set end date to start date initially
    this.EndDate.setDate(this.StartDate.getDate() + 1);
    this.FileUploadErrorlogs = false;
    // this.couldfiles = [];
    // (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
    $("#memtyp").each(function () {
      if ($(this).val() !== 'Suggestions') { // EDITED THIS LINE
        (<HTMLInputElement>document.getElementById("fileUpload")).value = "";

        // (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";    
      }
    });
    // (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
    // (<HTMLInputElement>document.getElementById("fileUpload")).innerHTML = "Choose file";
    this.CompanyHide = false;
    this.DerptHide = false;
    this.Design = false;
    this.FilteredUsersJson = [];

    // (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    // document.getElementById("Kt_reply_Memo_New")[0].classList.remove("kt-quick-panel--on");
    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    // document.getElementsByClassName("kt-quick-panel")[0].classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
    (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    const sideViewElement = document.getElementsByClassName("side_view")[0];
    if (sideViewElement) {
      sideViewElement.classList.remove("position-fixed");
    }
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementsByClassName("kt-quick-panel")[0].classList.remove("kt-quick-panel--on");
    this.ResetSuggestions();
    this.ResetAnnouncements();
  }


  CreateMeetingText: string = '';
  lengthtxtsub: number = 0;
  onSubjectChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newSubject = inputElement.value;
    this.newmemoService._NewMemoobj.Subject = newSubject;
    if (newSubject.trim().length > 0) {
      const newTextToAdd = newSubject.substring(this.lengthtxtsub);
      this.CreateMeetingText += newTextToAdd;
      this.lengthtxtsub = newSubject.length;
    }
    // Check for empty Subject and show error message if necessary
    if (this.newmemoService._NewMemoobj.Subject.trim() === '') {
      $('.error-msg-pop-x').removeClass('d-none');
      this.SubjectErrorlog = true;
    } else {
      $('.error-msg-pop-x').addClass('d-none');
      this.SubjectErrorlog = false; 6
    }

  }



  saveasdraft() {
    // this.SubjectErrorlog = false;
    // this.DescriptionErrorlog = false;
    // if ( this.newmemoService._NewMemoobj.Subject === undefined ||  this.newmemoService._NewMemoobj.Subject === "") {
    //   $('.error-msg-pop-x').removeClass('d-none');
    //   this.SubjectErrorlog = true;
    // } else if (this.newmemoService._NewMemoobj.Purpose === "") {
    //   $('.error-msg-pop-x').removeClass('d-none');
    //   this.DescriptionErrorlog = true;
    // }
    // if (this.SubjectErrorlog || this.DescriptionErrorlog) {
    //   return false;
    // }
    if (!this.newmemoService._NewMemoobj.Subject || this.newmemoService._NewMemoobj.Subject.trim() === "") {
      $('.error-msg-pop-x').removeClass('d-none');
      this.SubjectErrorlog = true;
    } else {
      this.SubjectErrorlog = false; // Reset the error flag if subject is not empty
    }

    if (!this.newmemoService._NewMemoobj.Purpose || this.newmemoService._NewMemoobj.Purpose.trim() === "") {
      $('.error-msg-pop-x').removeClass('d-none');
      this.DescriptionErrorlog = true;
    } else {
      this.DescriptionErrorlog = false;

      // Reset the error flag if purpose is not empty
    }

    if (this.SubjectErrorlog || this.DescriptionErrorlog) {
      return false;
    }


    this._obj.TextContent = this.newmemoService._NewMemoobj.Purpose.replace(/<[^>]+>/g, '');
    this._obj.Description = this.newmemoService._NewMemoobj.Purpose;
    this._obj.MailId = 0;
    this._obj.ReplyId = 0;
    this._obj.DraftId = this.newmemoService._NewMemoobj.DraftId;
    if (this._obj.DraftId == "") {
      this._obj.DraftId = "0";
    }
    this._obj.Subject = this.newmemoService._NewMemoobj.Subject;
    this.memoreplyService.SaveasDraft(this._obj).subscribe(
      data => {
        // this._obj = data as InboxDTO;
        if (data['Message'] == "2") {
          // this._draft.bindDraftMemos();
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('تم إرسال المسودة بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          } else {
            this._snackBar.open('Draft Sent Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          }
        }
        this.check = false;
        this.CheckboxCount = [];
        // this.newmemoService._NewMemoobj.ToUserAry = "";
        // this.newmemoService._NewMemoobj.CCUserAry = "";
        // this.newmemoService._NewMemoobj.Subject = "";
        // this.newmemoService._NewMemoobj.Purpose = "";
        // this.newmemoService._NewMemoobj.Reply = false;
        // this.newmemoService._NewMemoobj.ApprovalPending_F = false;
        this.selectedToEmployees = [];
        this.selectedCCEmployees = [];
        this.selectedToEmpIds = [];
        this.selectedCCEmpIds = [];
        this.ToErrorlog = false;
        $('.error-msg-pop-x').addClass('d-none');
        this.newmemoService._NewMemoobj.Purpose = "";
        this.newmemoService._NewMemoobj.Subject = "";
        this.ReplyRequired = false;
        this.ApprovalPending = false;
        this._IsConfidential = false;
        this.SubjectErrorlog = false;
        this.DescriptionErrorlog = false;
        this.myDate = new Date();
        this._lstMultipleFiales = [];
        this.DeadlineDatecheck = false;
        $("#memtyp").each(function () {
          if ($(this).val() !== 'Suggestions') { // EDITED THIS LINE
            (<HTMLInputElement>document.getElementById("fileUpload")).value = "";

            // (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";    
          }
        });
      }
    )
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    // document.querySelector("kt-quick-panel").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  ngAfterViewInit() {
    // if (this.childComponent) {
    //   this.childComponent.bindDraftMemos();
    // } else {
    //   console.error('Child component not found.');
    // }
    // Call the method in the child component after it has been initialized
    // if (this.childComponent) {
    //   this.childComponent.bindDraftMemos();
    // }
    // this.Deletedraft();
  }

  Deletedraft() {
    const lang: any = localStorage.getItem('language');
    this._obj.DraftId = this.newmemoService._NewMemoobj.DraftId;
    // alert(this.newmemoService._NewMemoobj.DraftId);
    Swal.fire({
      title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
      text: lang === 'ar' ? "هل تريد المتابعة في استعادة هذا المذكرة؟" : "Do you want to proceed with Restored this memo",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === 'ar' ? "نعم، احذفها!" : "Yes, delete it!",
      cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.memoreplyService.DeleteDraft(this._obj).subscribe(
          data => {
            // console.log(data,"Delete Draft");
            // this.bindDraftMemos.emit();

            this.check = false;
            this.CheckboxCount = [];
            this.selectedToEmployees = [];
            this.selectedCCEmployees = [];
            this.selectedToEmpIds = [];
            this.selectedCCEmpIds = [];
            this.newmemoService._NewMemoobj.Purpose = "";
            this.newmemoService._NewMemoobj.Subject = "";
            this.ReplyRequired = false;
            this.ApprovalPending = false;
            this._IsConfidential = false;
            this.SubjectErrorlog = false;
            this.DescriptionErrorlog = false;
            this.myDate = new Date();
            this._lstMultipleFiales = [];
            this.DeadlineDatecheck = false;

            $("#memtyp").each(function () {
              if ($(this).val() !== 'Suggestions') { // EDITED THIS LINE
                (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
              }
            });
            DraftComponent.DraftDeleted.emit();
            $('.kt-quick-panel').removeClass('kt-quick-panel--on');
            document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
            document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          }

        )

      }
    });
  }

  closeInfo() {
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    // document.querySelector("kt-quick-panel").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

  }
  @Input() currentMemoTypeValue: string;

  MemoTypeChangeEvent(memoType: string) {

    this.selectedMemoType = memoType;
    // alert(this.selectedMemoType);
    if (memoType == 'New Memo' && this.currentLang === 'ar') {
      this.selectedMemoType = 'مذكرة جديدة';
    }
    else if (memoType == 'Announcements' && this.currentLang === 'ar') {
      this.selectedMemoType = 'الإعلانات';
    }
    else if (memoType == 'Suggestions' && this.currentLang === 'ar') {
      this.selectedMemoType = 'اقتراحات';
    }
    else if (memoType == 'Workflow' && this.currentLang === 'ar') {
      this.selectedMemoType = 'سير العمل';
    }
    const lang: any = localStorage.getItem('language');
    this.AskaQuestion = lang === 'en' ? "Ask a Question" : "طرح سؤال";
    this.Choice = lang === 'en' ? "Choice" : "خيار  "
    //  this.selectedMemoType = lang === 'en' ? "New Memo" : "مذكرة جديدة";
    this.SearchorEnteraText = lang === 'en' ? "Search or Enter a Text..." : 'ابحث أو أدخل نصًا';
    if (this.selectedMemoType === 'Announcements' || this.selectedMemoType == 'الإعلانات' || this.selectedMemoType === 'Suggestions' || this.selectedMemoType == 'اقتراحات') {
      // alert(this.currentLang);
      if (this.currentUserValue.RoleId == 502) {
        this.GetAnnouncementDrps();
        this._DisplayOptions = true;
        this._ReportingUserNote = false;
      }
      else {
        this._obj.UserId = this.currentUserValue.createdby;
        this.newmemoService.CheckReportingUserCount(this._obj).subscribe(data => {
          this.FilteredUsersJson = JSON.parse(data["ReportingUserJson"]);
          this.FilteredUsersJson.forEach(element => {
            element.isChecked = true;
          });

          const _count = this.FilteredUsersJson.filter(x => x.isChecked == true).length;

          this.CheckboxCount = _count;
          this.check = true;
          this._selectedUserIds = [];
          this.CompanyHide = true;
          this.DerptHide = false;
          this.Design = false;
          if (data["ReportingUserCount"] == 0) {
            this._ReportingUserNote = true;
          }
          else {
            this._ReportingUserNote = false;
          }
        })
        this._DisplayOptions = false;
      }
      this.CompanyHide = false;
      this.DerptHide = false;
      this.Design = false;
      this.CmySelectValue = [];
      this.DeprtSelectValue = [];
      this.DesigSelectValue = [];
      this.FilteredUsersJson = [];
      this.check = false;
      this.CheckboxCount = [];

    }

  }



  addImageProcess(src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img.height + "," + img.width)
      img.onerror = reject
      img.src = src
    })
  }

  BannerUpload(event: any) {    // Banner Upload functionality
    let height = 0;
    let width = 0;
    let fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        const img = new Image();
        img.src = reader.result as string;
        this.addImageProcess(img.src).then(data => {
          let _data = data.toString();
          let _ary = _data.split(",");
          if (parseInt(_ary[0]) != 500 || parseInt(_ary[1]) != 1250) {
            this.error = "Photo Dimension should be 1250 x 500 size";
          }
          else {
            this.error = "";
          }
        })
      };
    }
  }

  onNgModelChangeConfidential(e) {
    if (e) {
      this._obj.IsConfidential = false;
      this._IsConfidential = false;
    }
  }

  onNgModelChangeMeetings(e) {
    if (e) {
      this._obj.IsConfidential = false;
      this.Meetings = false;
    }
  }

  onNgModelChangeLabels(e) {
    if (e) {
      this._obj.IsConfidential = false;
      this.Labels = false;
      this.getLables();
    }
    this.AddLabelList = [];
    this.SelectedLabelIds = [];
  }

  // To User Dropdown start here

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   // console.log(this._UpdatedTOUsers);
  //     const selectedToUserList = this._UpdatedTOUsers.find((ToUser) => ToUser.UserId === event.option.value);
  //     console.log(this.selectedToUser,"TOUser");
  //     // this._keeppanelopen();
  //     if (selectedToUserList) {
  //       const index = this.selectedToUser.findIndex((emp) => emp.UserId === selectedToUserList.UserId);
  //       if (index === -1) {
  //         // Employee not found in the selected array, add it
  //         this.selectedToUser.push(selectedToUserList);
  //         this.selectedToUserIds.push(selectedToUserList.UserId);
  //       } else {
  //         // Employee found in the selected array, remove it
  //         this.selectedToUser.splice(index, 1);
  //         this.selectedToUserIds.splice(index, 1);
  //       }
  //     }
  //     // this._ToUserSubList = this._UpdatedTOUsers;
  //     // (<HTMLInputElement>document.getElementById("txtsearchToEmpployees")).value = "";


  //     // console.log(this.selectedToEmpIds, "this.selectedToEmployees from selected event");
  //     //this.removeArrayById(event.option.value);
  //     // const index = this.selectedCCEmployees.findIndex((emp) => emp.CreatedBy === event.option.value);
  //     // if (index !== -1) {
  //     //   this.selectedCCEmployees.splice(index, 1);
  //     //   this.selectedCCEmpIds.splice(index, 1);
  //     // }

  //     //selectedCCEmployees

  //   // else {
  //   //   alert("cannot add login user");
  //   // }
  //   // this.ToErrorlog = false;

  // }

  // isSelected(ToUser: any): boolean {
  //   return this.selectedToUser.some((Tuser) => Tuser.UserId === ToUser.UserId);
  // }
  // filterToUsers(input: string): void{
  //   this.isSelection = true;
  //   this._ToUserSubList = this._UpdatedTOUsers.filter((ToUser) =>
  //   ToUser.ContactName.toLowerCase().includes(input.toLowerCase())
  //   );
  // }

  // _keeppanelopen() {
  //   this._ToUserSubList = this._UpdatedTOUsers;
  //   this.isSelection = true;
  //   // this.isSelectionCC = false;
  //   // requestAnimationFrame(() => this.customTrigger.openPanel()); // open the panel
  //   this.autoCompleteTrigger1.openPanel();
  //   (<HTMLInputElement>document.getElementById("txtsearchToUser")).focus();
  //   // this.customTriggerCC.closePanel();
  // }

  // closePanel() {
  //   this.isSelection = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchToUser")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchToUser")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }
  // remove(ToUser: any): void {
  //   //_AllUsersToList
  //   const index = this.selectedToUser.findIndex((emp) => emp.CreatedBy === ToUser.CreatedBy);
  //   this.isSelection = false;
  //   if (index !== -1) {
  //     // Remove the employee from the selectedEmployees array
  //     this.selectedToUser.splice(index, 1);
  //     this.selectedToUserIds.splice(index, 1);
  //   }
  //   // Optionally, you can uncheck the checkbox in the Project_List array
  //   ToUser.checked = false;
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }


  _CCList(event: MatAutocompleteSelectedEvent): void {
    const selectedCCUsers = this._UpdatedCCUsers.find((user) => user.UserId === event.option.value);
    if (selectedCCUsers) {
      const index = this.selectedCCUser.findIndex((_user) => _user.UserId === selectedCCUsers.UserId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.selectedCCUser.push(selectedCCUsers);
        this.SelectedCCIds.push(selectedCCUsers.UserId);
      } else {
        // User found in the selected array, remove it
        this.selectedCCUser.splice(index, 1);
        this.SelectedCCIds.splice(index, 1);
      }
    }
    this._CCUserSubList = this._UpdatedCCUsers;
    this.isSelection_AddUsers = false;
  }

  isSelectedCCusers(_User: any): boolean {
    return this.selectedCCUser.some((usr) => usr.UserId === _User.UserId);
  }

  filterAddUsers(input: string): void {
    this.isSelectionAddUser = true;
    this._CCUserSubList = this._UpdatedCCUsers.filter((User) =>
      User.ContactName.toLowerCase().includes(input.toLowerCase())
    );
  }

  OpenCCUsers() {
    this._CCUserSubList = this._UpdatedCCUsers;
    this.isSelection_AddUsers = true;
    (<HTMLInputElement>document.getElementById("txtsearchCCUsers")).focus()
  }

  closePanelCCusers() {
    this.isSelectionAddUser = false;
    this.isSelection_AddUsers = false;
    (<HTMLInputElement>document.getElementById("txtsearchCCUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchCCUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  RemoveCCUser(Users) {
    const index = this.selectedCCUser.findIndex((usr) => usr.CreatedBy === Users.CreatedBy);
    this.isSelectionAddUser = false;
    if (index !== -1) {
      this.selectedCCUser.splice(index, 1);
      this.SelectedCCIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
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


      //this.removeArrayById(event.option.value);
      const index = this.selectedCCEmployees.findIndex((emp) => emp.CreatedBy === event.option.value);
      if (index !== -1) {
        this.selectedCCEmployees.splice(index, 1);
        this.selectedCCEmpIds.splice(index, 1);
      }

      //selectedCCEmployees
    }
    // else {
    //   alert("cannot add login user");
    // }
    this.ToErrorlog = false;
    // $('.error-msg-pop-x').addClass('d-none');
    this.isSelection = false;


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
      this.isSelectionCC = false;
      if (index !== -1) {
        // Remove the employee from the selectedEmployees array
        this.selectedToEmployees.splice(index, 1);
        this.selectedToEmpIds.splice(index, 1);
      }
    }

    console.log(this._AllUsersCCList, "cc user list");
    console.log(this.Workflowdetails, "Work list");



    // else {
    //   alert("cannot add login user");
    // }
  }




  isSelected(employee: any): boolean {
    const lang: any = localStorage.getItem('language');
    this.searchTOfromhere = lang === 'en' ? 'Search TO from here' : 'ابحث في TO من هنا'
    this._disabledUsers = [this._LoginUserId];
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
    // const lang: any = localStorage.getItem('language');
    // this.searchCCfromhere = lang === 'en' ? 'Search CC from here' : 'ابحث عن CC من هنا';

    // if(this.newDisabledUsers.length == 1){
    //   this.newDisabledUsers.forEach(employeeId => {
    //     if (!this._disabledUsers.includes(employeeId)) {
    //       this._disabledUsers.push(Number(employeeId)); // Only add if it's not already present
    //       // alert(this._disabledUsers.length)
    //     }
    //   });
    // }else{
    // this._disabledUsers = [this._LoginUserId];
    // }

    // console.log(this._disabledUsers, "this._disabledUsers trigger");
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

  gacarchivelistModal() {
    this.isModalOpen = true;
    document.getElementById("gacarchivelistModal").style.display = "block";
    document.getElementById("gacarchivelistModal").classList.add("show");
    document.getElementById("gacarchivelistModalBackdrop").style.display = "block";
    document.getElementById("gacarchivelistModalBackdrop").classList.add("show");
  }




  gacarchivelistModal_dismiss() {
    document.getElementById("gacarchivelistModal").style.display = "none";
    document.getElementById("gacarchivelistModal").classList.remove("show");
    document.getElementById("gacarchivelistModalBackdrop").style.display = "none";
    document.getElementById("gacarchivelistModalBackdrop").classList.remove("show");
  }


  formatSize(size: number): string {
    return formatFileSize(size);
  }

  formatSizeStream(size: number): string {
    return formatFileSizeStream(size);
  }
  formatSizecould(size: number): string {
    return formatFileSizecould(size);
  }
  showEmojiPicker = false;  // Control visibility of emoji picker
  onContentChanged(event: any) {
    // Update the model when content changes
    this.newmemoService._NewMemoobj.Purpose = event.html;
  }
  // Handle emoji selection and insert it into the editor
  addEmoji(event: any) {
    const emoji = event.emoji.native;  // Get the selected emoji
    // const quillEditor = document.querySelector('.ql-editor');
    // quillEditor.innerHTML += emoji;  // Insert the emoji into the editor content
    // this.newmemoService._NewMemoobj.Purpose += emoji;
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


  onFilesSelected(files: any[]) {
    // this.couldfiles = files;
    this.newmemofile = files;
    console.log('Selected files in NewMemoComponent:', this.newmemofile);

  }

  AddLabelList: any = [];
  isSelectionAddLabel: boolean = false;
  SelectedLabelIds: any = [] = [];
  Addlabel: string = "";
  isSelection_AddLabel: boolean = false;
  SubLabelList: any = [];
  LabelsJsondata: any;
  getLables() {
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj)
      .subscribe(data => {
        this.LabelsJsondata = data["Data"]["LablesJson"];
      });
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
  }
  isSelectedAddLabel(_label: any): boolean {
    return this.AddLabelList.some((lbl) => lbl.LabelId === _label.LabelId);
  }
  selectedWorkflowId: number
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

    console.log("SELECTED USERS",this.SelectedUsers);
    console.log(this.SelectedUsers , "Selected values");
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
  WorkFlowDetails(WorkFlowId: number) {
    this.selectedWorkflowId = WorkFlowId;
    // alert(this.selectedWorkflowId);
    this._obj.WorkFlowId = WorkFlowId;
    this.inboxService.GetWorkFlowDetailsAPI(this._obj)
      .subscribe(data => {
        
        console.log(data, "get workflow details");
        this.Workflowdetails = data["Data"]["WorkFlowDetails"];
        this.Workflowdetails = this.Workflowdetails.sort((a, b) => a.SortId - b.SortId);
        this._AttachmentRequired = this.Workflowdetails[0].AttachmentRequired;
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

  hasApprovedAndRejectedNextStep(actions: any[]): boolean {
    const hasApproved = actions.some(a => a.UserAction === 'Approved' && a.SystemAction === 'Next step');
    const hasRejected = actions.some(a => a.UserAction === 'Rejected' && a.SystemAction === 'Next step');
    return hasApproved && hasRejected;
  }
  WorkflowJSON:any;
  _SortId:any;;
  SendWorkflow() {
    if (this.selectedWorkflowId == undefined) {
      this.WorkflowErrorlog = true;
    } else if (this.selectedWorkflowId != undefined) {
      this.WorkflowErrorlog = false;
    }
   
    // this._SortId = this.SelectedUsers.map(item => ({
    //   SortId: item.sortId || item.SortId
    // }));
    // const firstSortId = this._SortId[0]?.SortId;

    // if (firstSortId && this._AttachmentRequired == true) {
    // return  this.FileUploadErrorlog = true;
    // }else{
    //   this.FileUploadErrorlog = false;
    // }
   
   

    this.WorkflowJSON = this.SelectedUsers.map(item => ({
      WorkFlowId: item.WorkFlowId,
      SortId: item.sortId
    }));
// Assuming this.selectedWorkflowId is defined
this._obj.WorkFlowJson =  JSON.stringify(this.WorkflowJSON);
console.log(this.WorkflowJSON ,"Json format");
    this._obj.MemoType = this.selectedMemoType;
    this._obj.Subject = this.newmemoService._NewMemoobj.Subject
    this._obj.Purpose = this.newmemoService._NewMemoobj.Purpose;
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
    if (this._lstMultipleFiales.length > 0 || this.newmemofile.length > 0) {
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
    this._obj.DeadLineDate  = null;
    this._obj.MailId = 0;
    this.newmemoService.SendWorkflowV2(this._obj).subscribe(
      res => {
        
        this._obj.message = res["Message"];
        this._obj.MailId = res["Data"].MailId;
        this._obj.ReplyId = res["Data"].ReplyId;
        frmData.append("mailId", this._obj.MailId.toString());
        frmData.append("MailId", this._obj.MailId.toString());
        frmData.append("barcode", "");
        frmData.append("referenceNo", this._obj.ReferenceNo == null ? "" : this._obj.ReferenceNo);
        frmData.append("isReply", "false");
        frmData.append("replyId", this._obj.ReplyId.toString());
        // Assuming `cloudFilesObject` is the array or object you want to send as JSON
        const cloudFilesJson = JSON.stringify(this.newmemofile);
        frmData.append("cloudFiles", cloudFilesJson);
        // console.log(typeof cloudFilesJson);
        // console.log("cloudFilesJson", cloudFilesJson);
        if (this._obj.message == "Success") {
          if (attvalu == true) {
            this.hubConnectionBuilder.start().then(() => console.log('Connection started.......!'))
              .catch(err => console.log('Error while connect with server'));
            $('.progress-overlay').addClass('visible');
            this.newmemoService.uploadFile(frmData).subscribe({
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
                      this.hubConnectionBuilder.on("ReceiveProgress", (progressbar) => {
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
                    (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
                    (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
                    $('.progress-overlay').removeClass('visible');
                    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                    const sideViewElement = document.getElementsByClassName("side_view")[0];
                    if (sideViewElement) {
                      sideViewElement.classList.remove("position-fixed");
                    }
                    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                    this.newmemofile = [];

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
                    this.Clearfileld();
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
        this.CloseReplyPanelV2();
        (<HTMLInputElement>document.getElementById("Kt_reply_Memo_New")).classList.remove("kt-quick-panel--on");
        // (<HTMLInputElement>document.getElementById("hdnMailId")).value = "0";
        // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
        document.getElementById("plus_div").classList.remove("d-none");
        document.getElementById("plus_div").classList.add("d-flex");
      }
    }
    )
  }

  open_workflow_user_modal() {
    document.getElementById("workflow-user-modal-backdrop").style.display = "block";
    document.getElementById("workflow-user-modal").style.display = "block";
  }
  Adduserserach:string;

  close_workflow_user_modal() {
    this.WorkflowLeftsectionlist.forEach(element => {
      element.Check = false;
      element.sortId = "";
    });
    document.getElementById("workflow-user-modal-backdrop").style.display = "none";
    document.getElementById("workflow-user-modal").style.display = "none";
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

export function formatFileSizeStream(sizeInKB: number): string {
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

export function formatFileSizecould(sizeInKB: number): string {
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

