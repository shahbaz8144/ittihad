import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { BehaviorSubject, Observable, empty, pipe, Observer } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { AuthenticationDTO } from '../_models/authentication-dto';
import { Router } from '@angular/router';
import { GACFiledto } from '../_models/gacfiledto';

@Injectable({
  providedIn: 'root'
})

export class InboxService {
  errorMsg: string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _name: string;
  _obj: InboxDTO;
  obj1:GACFiledto;
  _XmlToJson: XmlToJson;
  _LstCompanies: InboxDTO[];
  _userobj: AuthenticationDTO;
  name = 'Angular'
  constructor(private http: HttpClient, private commonUrl: ApiurlService, private _ngZone: NgZone,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
    this.obj1 = new GACFiledto();
    this._userobj = new AuthenticationDTO();
    this._XmlToJson = new XmlToJson();
  }
  ngOnInit() {
  }
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  Filters() {
    this._obj = new InboxDTO();
    //Using Stored Procedure
    //[dbo].[uspGetCompanyCountMemos]
    //Using Parameters
    //obj.UserId
    this._obj.UserId = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/LatestCommunicationAPI/NewGetCompanyWiseCount", this._obj);
  }
  UserAgreementPolicy(PolicyId: number, CreatedBy: number) {
    this._obj = new InboxDTO();
    this._obj.PolicyId = PolicyId;
    this._obj.CreatedBy = CreatedBy; //this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewUserAgreementDetails', this._obj);
  }
  UpdateMemoPin(MemoId: number, Status: boolean, CreatedBy: number, OrganizationId: number) {
    this._obj = new InboxDTO();
    // SP Name
    // uspUpdateMemoPin
    this._obj.MailId = MemoId;
    this._obj.CreatedBy = CreatedBy; //this.currentUserValue.createdby;
    this._obj.PinStatus = Status;
    this._obj.OrganizationId = OrganizationId;

    // '/LatestCommunicationAPI/NewUpdateMemoPin'
    // PinMemoDetailsAPI/NewUpdateMemoPin
    // MainMemoDetailsAPI/UpdateMemoPin
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/UpdateMemoPin', this._obj);
  }
  AnnouncementList(OrganizationId: number, UserId: number) {
    this._obj = new InboxDTO();
    this._obj.OrganizationId = OrganizationId;
    this._obj.UserId = UserId; //this.currentUserValue.createdby;
    // /LatestCommunicationAPI/NewAnnouncementList
    return this.http.post(this.rootUrlII + 'CommunicationAPI/AnnouncementList', this._obj);
  }
  SuggestionsList(OrganizationId: number, CreatedBy: number) {
    this._obj = new InboxDTO();
    this._obj.OrganizationId = OrganizationId;
    this._obj.CreatedBy = CreatedBy;

    // OrganizationAPI/NewGetSuggestions
    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetSuggestion', this._obj);
  }
  AddUserSuggestionOption(SuggestionId: number, OptionId: number, CreatedBy: number, flagid: number) {
    this._obj = new InboxDTO();
    this._obj.SuggestionId = SuggestionId;
    this._obj.OptionId = OptionId;
    this._obj.CreatedBy = CreatedBy;
    this._obj.FlagId = flagid;
    return this.http.post(this.rootUrl + 'OrganizationAPI/NewUserPoll', this._obj);
  }
  AnnouncementDetails(AnnouncementId: number, OrganizationId: number, UserId: number) {
    this._obj = new InboxDTO();
    this._obj.OrganizationId = OrganizationId;
    this._obj.AnnouncementId = AnnouncementId;
    this._obj.UserId = UserId; //this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewAnnouncementDetails', this._obj);
  }
  AnnouncementDetailsStatus(_values: InboxDTO) {
    this._obj = new InboxDTO();
    this._obj.AnnouncementId = _values.AnnouncementId;
    this._obj.AnnouncementStatus = _values.AnnouncementStatus
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewUpdateAnnouncementStatus', this._obj);
  }
  MemoLoad(_values: InboxDTO) {
    //Using Stored Procedure
    //uspInboxMailsLoad
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.UnRead = _values.UnRead;
    this._obj.PStatusJson = _values.PStatusJson;
    this._obj.PCompanyJson = _values.PCompanyJson;
    this._obj.PUserJson = _values.PUserJson;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/InboxMemosANG', this._obj);
  }

  InboxFiltersV2(_values: InboxDTO) {

    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/InboxFiltersV2', this._obj);
  }

  MemoV2(_values: InboxDTO) {
    this._obj = new InboxDTO();
    //Using Stored Procedure
    //UspInboxMailV2  by Ramesh
    this._obj.UserId = _values.UserId;
    this._obj.pageSize = _values.pageSize;
    this._obj.pageNumber = _values.pageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.lastCreatedDate = _values.lastCreatedDate;
    this._obj.UnRead = _values.UnRead;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/InboxMailV2', this._obj);
  }

  SearchFiltersInboxV2(_values: InboxDTO) {
    this._obj = new InboxDTO();
    this._obj.CompanyIds = _values.CompanyIds;
    this._obj.FromUserIds = _values.FromUserIds;
    this._obj.Source = _values.Source;
    this._obj.Subject = _values.Subject;
    this._obj.IsApprovalPending = _values.IsApprovalPending;
    this._obj.IsReplyRequired = _values.IsReplyRequired;
    this._obj.IsExpired = _values.IsExpired;
    this._obj.HasAttachment = _values.HasAttachment;
    this._obj.startdate = _values.startdate;
    this._obj.enddate = _values.enddate;
    this._obj.UserId = _values.UserId;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.lastCreatedDate = _values.lastCreatedDate;
    this._obj.IsConfidential = _values.IsConfidential;

    return this.http.post(this.rootUrlII + 'CommunicationAPI/SearchInboxMailFiltersV2', this._obj);
  }


  InboxAnnouncementV2(_values: InboxDTO) {
    //Using Stored Procedure
    //UspInboxMailV2
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.OrganizationId = _values.OrganizationId;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/InboxAnnouncementV2', this._obj);
  }

  InboxSearchV2(_values: InboxDTO) {
    //Using Stored Procedure
    //UspSearchInboxMailV2 
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.pageSize = _values.pageSize;
    this._obj.pageNumber = _values.pageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.lastCreatedDate = _values.lastCreatedDate;
    this._obj.Searchtxt = _values.Searchtxt;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/SearchInboxMailV2', this._obj);
  }
  SearchAutoCompleteService(_values: InboxDTO) {
    //Using Stored Procedure
    //USPGETAUTOCOMPLETEDATA_SEARCH
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.OrganizationId = _values.OrganizationId;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/SearchAutoComplete', this._obj);
  }
  MemosBindingWithFilters(_values: InboxDTO) {
    //Using Stored Procedure
    //uspMemosListSample
    //Parameters
    //UserId long,Read_F bit,Conversation_F bit, All bit,PageSize int,
    //PageNumber int,FlagId int,Description string,Search string,FromUserId biignt
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.Search = _values.Search;
    this._obj.ByFilters = _values.ByFilters;
    this._obj.PStatusJson = _values.PStatusJson;
    this._obj.PCompanyJson = _values.PCompanyJson;
    this._obj.PUserJson = _values.PUserJson;
    this._obj.InboxMemosType = _values.InboxMemosType;

    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewGetToMemosWithPagingJSON', this._obj);
  }
  PendingFromOthersMemosBindingWithFilters(_values: InboxDTO,organizationid:number) {
    //Using Stored Procedure(uspMemoPendingFromOther)
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.Search = _values.Search;
    this._obj.ByFilters = _values.ByFilters;
    this._obj.PStatusJson = _values.PStatusJson;
    this._obj.PUserJson = _values.PUserJson;
    this._obj.OrganizationId = organizationid;
    // /LatestCommunicationAPI/NewGetPendingWithOthersMemosWithPagingJSON

    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetPendingWithOthersMemoWithPagingJSON', this._obj);
  }
  MemosLabelBinding(_values: InboxDTO) {
    //Using Stored Procedure
    //uspGetLabelMemos
    //Parameters
    //UserId long,labelId bigint
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.LabelId = _values.LabelId;
    // /LatestCommunicationAPI/NewGetLabelMemos
    //create in core

    // CommunicationAPI/GetSuggestion
    return this.http.post(this.rootUrlII + 'LabelsAPI/GetLabelMemos', this._obj);
  }
  UserLabels(_values: InboxDTO) {
    //Using Stored Procedure
    //uspGetUserLabels
    //Parameters
    //UserId long
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    // /LatestCommunicationAPI/NewGetLabelsMaster

    // CommunicationAPI/GetLabelsMaster
    return this.http.post(this.rootUrlII + 'LabelsAPI/GetLabelsMaster', this._obj);
  }

 


  DeleteUserLabels(_values: InboxDTO) {
    // SP Name
    // uspRemoveLabel
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.LabelId = _values.LabelId;

    // /LatestCommunicationAPI/NewDeleteLabels  old api
    // LabelsAPI/DeleteLabel   core api
    return this.http.post(this.rootUrlII + 'LabelsAPI/DeleteLabel', this._obj);
  }
  AddLabels(_values: InboxDTO) {
    //Using Stored Procedure
    //uspInsertUpdateLabels
    //Parameters
    //UserId long,LabelId bigint,LabelName string,flagid int,isActive bit
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.LabelName = _values.LabelName;
    this._obj.IsActive = true;
    this._obj.FlagId = _values.FlagId;
    this._obj.LabelId = _values.LabelId;
    // '/LatestCommunicationAPI/NewLabelsMaster'
    return this.http.post(this.rootUrlII + "LabelsAPI/LabelsMaster", this._obj);
  }
  DeletedMemosFromDraft(draftids: string, _CreatedBy: number) {
    //Using Stored Procedure
    //uspGetDeletedMemos
    //Parameters
    //UserId long
    this._obj = new InboxDTO();
    this._obj.UserId = _CreatedBy;
    this._obj.DraftIds = draftids;

    // Core API
    // MainMemoDetailsAPI/DraftMemosDelete

    // Old API
    // /LatestCommunicationAPI/NewDeleteDraftMemos
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/DraftMemosDelete', this._obj);
  }
  DeletedMemos(_values: InboxDTO) {

    //Using Stored Procedure
    //uspGetDeletedMemos
    //Parameters
    //UserId long
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.pageSize = _values.pageSize;
    this._obj.pageNumber = _values.pageNumber;
    this._obj.OrderBy = _values.OrderBy;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.lastCreatedDate = _values.lastCreatedDate;

    // this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    // this._obj.OrganizationId = _values.OrganizationId;
    // this._obj.pageSize = _values.pageSize;
    // this._obj.pageNumber = _values.pageNumber;
    // this._obj.OrderBy = _values.OrderBy;
    // this._obj.lastCreatedDate = _values.lastCreatedDate;
    // /LatestCommunicationAPI/NewGetDeleteMemos

    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetDeleteMemos', this._obj);
  }
  requestMemos(_CreatedBy: number, organizationid: number) {
    //Using Stored Procedure
    //uspGetDMSRequestList
    //Parameters
    //UserId long
    this._obj = new InboxDTO();
    this._obj.UserId = _CreatedBy;
    this._obj.OrganizationId = organizationid;
    // /LatestCommunicationAPI/NewGetDMSRequest
    return this.http.post(this.rootUrlII + 'CommunicationAPI/DMSRequestList', this._obj);
  }
  RequestMemoStatus(FromUserId: number, _mailId: number, createdby: number, replyid, _values: InboxDTO) {
    // SP Name:
    // uspDMSRequestAction by Ramesh
    this._obj = new InboxDTO();
    this._obj.FromUserId = FromUserId;
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = createdby;
    this._obj.ReplyId = replyid;
    this._obj.UserApprovalStatus = _values.UserApprovalStatus
    // '/LatestCommunicationAPI/NewGetDMSRequestAction'
    // Users/DMSRequestListAction
    return this.http.post(this.rootUrlII + 'Users/DMSRequestListAction', this._obj);
  }
  CCMemosWithFilters(_values: InboxDTO) {
    //Using Stored Procedure
    //uspGetCCMemosPagingOptimizedJSON
    //Parameters
    //UserId long,PageSize int,
    //PageNumber int,FlagId int,Search string,FromUserId bigint
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.FlagId = _values.FlagId;
    this._obj.Search = _values.Search;
    this._obj.FromUserId = _values.FromUserId;

    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewGetCCMemosWithPagingJSON', this._obj);
  }
  FavMemosWithFilters(_values: InboxDTO) {
    //Using Stored Procedure
    //uspGetFavoriteMemosPagingOptimizedJSON
    //Parameters
    //UserId long,PageSize int,
    //PageNumber int
    this._obj = new InboxDTO();
    this._obj.UserId = _values.CreatedBy;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.Search = _values.Search;
    // '/LatestCommunicationAPI/NewGetfavMemosWithPagingJSON'

    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetFavoriteMemos', this._obj);
  }
  deleteMemo(MailIds: string, _createdby: number) {
    //Using Stored Procedure
    //uspDeleteMemo
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailIds = MailIds;
    // this._obj.MemoSource = _memosource;
    this._obj.UserId = _createdby;

    // '/LatestCommunicationAPI/NewDeleteMemo'
    // DeleteMemoDetailsAPI/DeleteMemoMemoDetails


    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/DeleteMemo', this._obj);
  }

  restoreMemo(MailIds: string, _createdby: number) {
    //Using Stored Procedure
    //uspDeleteMemo
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailIds = MailIds;
    // this._obj.MemoSource = _memosource;
    this._obj.UserId = _createdby;

    // '/LatestCommunicationAPI/NewDeleteMemo'
    // DeleteMemoDetailsAPI/DeleteMemoMemoDetails


    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/DeleteMemo', this._obj);
  }
  BookmarkAPI(replyid: number, _createdby: number, MailId: number) {
    this._obj = new InboxDTO();
    this._obj.ReplyId = replyid;
    this._obj.CreatedBy = _createdby;
    this._obj.MailId = MailId;

    // MainMemoDetailsAPI/AddReplyBookmark
    // LatestCommunicationAPI/NewAddReplyBookmark
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/AddReplyBookmark', this._obj);
  }
  UpdateSubject(_mailId: number, replyid: number, _subject: string, createdby: number) {
    //Using Stored Procedure
    //uspUpdateMemSubejct
    //Parameters
    //MailId number,CreatedBy number,Subject nvarchar(max)
    this._obj = new InboxDTO(); 
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = createdby;
    this._obj.Subject = _subject;
    this._obj.ReplyId = replyid;
    // '/LatestCommunicationAPI/NewUpdateSubject'
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/UpdateSubject', this._obj);
  }
  ReplyListForRestore(_mailId: number, _userid: number) {
    //Using Stored Procedure
    //uspGetRestoreReplyList
    //Parameters
    //MailId number,UserId number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    this._obj.UserId = _userid;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewRestoreReplyListForUser', this._obj);
  }
  AddReplyListForRestore(jsondata: string, _mailId: number, _userid: number) {
    //Using Stored Procedure
    //UspRestoreRepliesforUser
    //Parameters
    //@Json string
    this._obj = new InboxDTO();
    this._obj.JsonData = jsondata;
    this._obj.MailId = _mailId;
    this._obj.UserId = _userid;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewRestoreRepliesForUser', this._obj);
  }
  
  UnReadMemo(_ReplyId: string, _status: boolean, _CreatedBy: number) {
    //Using Stored Procedure
    //uspMemoUnRead
    //Parameters
    //MailId number,CreatedBy number,MailView boolean 
    this._obj = new InboxDTO();
    this._obj.MailIds = _ReplyId;
    this._obj.MailView = _status;
    this._obj.CreatedBy = _CreatedBy;
    // '/LatestCommunicationAPI/NewUnReadMemo'
    // MainMemoDetailsAPI/NewUnReadMemo
    // UnReadMemoAPI/NewUnReadMemoDetails
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/NewUnReadMemo', this._obj);
  }
  RemoveMemoUser(_mailId: number, UserId: number, _CreatedBy: number, _value: boolean) {
    //Using Stored Procedure
    //uspRemoveUserFromMemo
    // Using Stored Procedure using core api
    // uspRemoveUserFromMemo
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = _CreatedBy;
    this._obj.UserId = UserId;
    this._obj.IsExist = _value;
    // '/LatestCommunicationAPI/NewRemoveMemoUser'
    return this.http.post(this.rootUrlII + 'Users/removememouser', this._obj);
  }
  SubjectList(_mailId: number) {
    //Using Stored Procedure
    //uspSubjectList
    //Parameters
    //MailId number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    // '/LatestCommunicationAPI/NewGetSubjectList'

    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/GetSubjectList', this._obj);
  }
  AddMemoToLabel(MailIds: string, labelIds: string, _CreatedBy) {
    debugger
    //Using Stored Procedure
    //uspAddLabelToMemo
    //Parameters
    //MailId number,CreatedBy number,@LabelId number
    this._obj = new InboxDTO();
    this._obj.MailIds = MailIds;
    this._obj.labelIds = labelIds;
    this._obj.CreatedBy = _CreatedBy;
    // '/LatestCommunicationAPI/NewAddMemoToLabel'
    // AddLabelToMemoAPI/NewAddMemoToLabel
    // LabelsAPI/NewAddMemoToLabel
    return this.http.post(this.rootUrlII + 'LabelsAPI/NewAddMemoToLabel', this._obj);
  }

  AddLabelToArchive(LabelIds: string, DocumentIds: string, _CreatedBy) {
    this._obj = new InboxDTO();

    this._obj.labelIds = LabelIds;
    this._obj.DocumentIds = DocumentIds;
    this._obj.UserId = _CreatedBy;
    return this.http.post(this.rootUrlII + 'LabelsAPI/AddLabelToArchive_V2', this._obj);
  }

  RemoveLabelToArchive( DocumentIds: string, labelId: number, _CreatedBy) {
    this._obj = new InboxDTO();
    this._obj.labelId = labelId;
    this._obj.DocumentIds = DocumentIds;
    this._obj.UserId = _CreatedBy;
    return this.http.post(this.rootUrlII + 'LabelsAPI/RemoveArchiveTag_V2', this._obj);
  }

  RemoveMemoFromLabel(_mailId: string, _LabelId: number, _CreatedBy: number) {
    //Using Stored Procedure
    //uspremoveMemoTag
    //Parameters
    //MailId number,CreatedBy number,@LabelId number
    this._obj = new InboxDTO();
    this._obj.MailIds = _mailId
    this._obj.LabelId = _LabelId;
    this._obj.UserId = _CreatedBy;

    // '/LatestCommunicationAPI/NewremoveMemofromLabel'
    // RemoveLabelFromMemoDeatilsAPI/RemoveLabelfromMemo


    return this.http.post(this.rootUrlII + "LabelsAPI/RemoveLabelfromMemo", this._obj);
  }
  MemoDetails(_mailId: number) {
    //Using Stored Procedure
    //uspOptimizedMemoDetailsJSON
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewGetMemoDetailsJSON', this._obj);
  }
  CountFromDMS(createdby: number) {
    this._obj = new InboxDTO();
    this._obj.CreatedBy = createdby;
    // Users/DMSRequestListCount
    // /LatestCommunicationAPI/NewGetDMSRequestCount
    return this.http.post(this.rootUrlII + 'Users/DMSRequestListCount', this._obj);
  }
  ReplyHistoryService(_values: InboxDTO) {
    //Using Stored Procedure
    //uspViewReplyHistoryByReplyId
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.ViewAll = _values.ViewAll;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    // '/LatestCommunicationAPI/NewGetReplyHistoryJSON'
    // MainReplyDetailsAPI/GetReplyHistoryJSON
    // MemoDetailsReplyHistoryAPI/GetReplyHistoryJSON
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/GetReplyHistoryJSON', this._obj);
  }

  async ReplyHistoryV2(_values: InboxDTO) {
    // SP Name 
    // UspReplyHistory
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.lastCreatedDate = _values.lastCreatedDate;
    this._obj.pageNumber = _values.pageNumber;
    this._obj.pageSize = _values.pageSize
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/ReplyHistoryV2', this._obj);
  }
  async MemoDetailsWithReplyFIlters(_values: InboxDTO) {
    //Using Stored Procedure
    //uspOptimizedMemoDetailsJSON
    //Parameters
    //MailId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyFilter_AllMain = _values.ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = _values.ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = _values.ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = _values.ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = _values.ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = _values.ReplyFilter_Subject;
    this._obj.ReplyFilter_From = _values.ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = _values.ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = _values.ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = _values.ReplyFilter_ByMeWithActions;
    this._obj.IsReplyFilter = _values.IsReplyFilter;
    this._obj.ReplyFilter_Bookmarks = _values.ReplyFilter_Bookmarks;

    // MemoDetailsAPI/MemoDetails

    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/GetMemoDetailsJSON', this._obj);
  }
  async ReplyListMemoDetailsV2(_values: InboxDTO) {
    //Using Stored Procedure
    //UspReplyListMemoDetailsV2_Reply  by Ramesh
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyFilter_AllMain = _values.ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = _values.ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = _values.ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = _values.ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = _values.ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = _values.ReplyFilter_Subject;
    this._obj.ReplyFilter_From = _values.ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = _values.ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = _values.ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = _values.ReplyFilter_ByMeWithActions;
    this._obj.IsReplyFilter = _values.IsReplyFilter;
    this._obj.ReplyFilter_Bookmarks = _values.ReplyFilter_Bookmarks;
    this._obj.ReplyId = _values.ReplyId;
    // MemoDetailsAPI/MemoDetails
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyListMemoDetailsV2', this._obj);
  }

  async ReplyListLoadSignalR(_values: InboxDTO) {
    //Using Stored Procedure
    //USPLoadReplyListSignalR
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyFilter_AllMain = _values.ReplyFilter_AllMain;
    this._obj.ReplyFilter_Unread = _values.ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = _values.ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = _values.ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_Date = _values.ReplyFilter_Date;
    this._obj.ReplyFilter_Subject = _values.ReplyFilter_Subject;
    this._obj.ReplyFilter_From = _values.ReplyFilter_From;
    this._obj.ReplyFilter_ByMe = _values.ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = _values.ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = _values.ReplyFilter_ByMeWithActions;
    this._obj.IsReplyFilter = _values.IsReplyFilter;
    this._obj.ReplyFilter_Bookmarks = _values.ReplyFilter_Bookmarks;
    this._obj.TotalReplyRecords = _values.TotalReplyRecords;
    // this._obj.pageSize = _values.pageSize;
    // this._obj.pageNumber = _values.pageNumber;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyListLoadSignalR', this._obj);
  }

  // PathExtention(url: string,uniqueid:number) {
  //   this._obj.url = url;
  //   this._obj.uniqueid=uniqueid;
  //   return this.http.post(this.rootUrlII + 'FileUploadAPI/NewFileDetails', this._obj);
  // }
  PathExtention(url: string) {
    this._obj = new InboxDTO();
    this._obj.url = url;
    // this._obj.uniqueid=uniqueid;
    return this.http.post(this.rootUrlII + 'FileUploadAPI/NewFileDetails', this._obj);
  }
  AttachmentData(MailDocId: number) {
    this._obj = new InboxDTO();
    this._obj.MailDocId = MailDocId;
    // core api
    // MainReplyDetailsAPI/NewAttachmentData
    // old api
    // LatestCommunicationAPI/NewAttachmentData
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/NewAttachmentData', this._obj);
  }
  async ReplyDetailsV2(_replyid: number) {
    //Using Stored Procedure
    //uspMemoReplyDetailsV2
    //Parameters
    //ReplyId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.ReplyId = _replyid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/ReplyDetailsV2', this._obj);
  }
  async MemoDetailsInitialLoadV2(_replyid: number, MailId: number) {
    //Using Stored Procedure
    //UspMemoInitialLoad
    //Parameters
    //ReplyId number,CreatedBy number,MailId number
    this._obj = new InboxDTO();
    this._obj.ReplyId = _replyid;
    this._obj.MailId = MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/MemoInitialLoadv2', this._obj);
  }
  ReplyDetails(_replyid: number) {
    //Using Stored Procedure
    //uspMemoReplyDetails_NewJson
    //Parameters
    //ReplyId number,CreatedBy number
    this._obj = new InboxDTO();
    this._obj.ReplyId = _replyid;
    this._obj.CreatedBy = this.currentUserValue.createdby;

    // /LatestCommunicationAPI/NewGetReplyDetailsJSON
    // ReplyDetailsAPI/ReplyDetails
    // /MainReplyDetailsAPI/ReplyDetails
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/ReplyDetails', this._obj);
  }
  MergeService(_values: InboxDTO) {
    //Using Stored Procedure
    // uspMergeMemoSubejct
    this._obj = new InboxDTO();
    this._obj.MergeSubject = _values.MergeSubject;
    this._obj.ReplyIds = _values.ReplyIds;
    this._obj.MailId = _values.MailId;
    this._obj.PreviousSubject = _values.PreviousSubject;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    // '/LatestCommunicationAPI/NewUpdateReplySubject'
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/MergeMemoSubject', this._obj);
  }
  UpdateApprovalStatus(_mailId: number, _status: string, _replyid: number, _values: InboxDTO) {
    //Using Stored Procedure
    //UspUpdateMemoStatus
    //Parameters
    //MailId number,CreatedBy number,UserApprovalStatus string, ReplyId number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyId = _replyid;
    this._obj.UserApprovalStatus = _status;
    this._obj.Comments = _values.Comments;
    this._obj.WorkFlowId = _values.WorkFlowId;
    this._obj.SortId = _values.SortId;
    this._obj.GroupId = _values.GroupId;
    this._obj.ReplyWorkFlowSortId = _values.ReplyWorkFlowSortId;
    // '/CommunicationAPI/NewMemoStatus'
    // MainReplyDetailsAPI/UpdateMemoStatus
    // MemoDetailsStatusAPI/UpdateMemoStatus
    return this.http.post(this.rootUrlII + 'MainReplyDetailsAPI/UpdateMemoStatus', this._obj);
  }
  FavStatus(_mailId: number, _favorite: boolean, CreatedBy: number) {

    //Using Stored Procedure
    //UspFavoriteStatus

    //Using Stored Procedure in core api
    // UspFavoriteStatus
    //Parameters
    //MailId number,CreatedBy number,UserApprovalStatus string, ReplyId number
    this._obj = new InboxDTO();
    this._obj.MailId = _mailId;
    this._obj.CreatedBy = CreatedBy;
    this._obj.Favorite = _favorite;
    // '/CommunicationAPI/NewFavoriteStatus'
    // FavoriteMemoDetailsAPI/FavoriteMemoDetails

    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/favoriteStatus', this._obj);
  }
  SentMemosWithFilters(_values: InboxDTO) {
    
    //Using Stored Procedure
    //uspAllSentMemosReturnJson
    //Parameters
    //UserId long,PageSize int,
    //PageNumber int,FlagId int,Search string,FromUserId bigint
    this._obj = new InboxDTO();
    this._obj.All = _values.All;
    this._obj.CreatedBy = _values.UserId; //this.currentUserValue.createdby;
    this._obj.Description = _values.Search;
    this._obj.PageSize = _values.PageSize;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.Mailids = _values.Mailids.toString();
    this._obj.HasAttachment = _values.HasAttachment;
    this._obj.startdate = _values.startdate;
    this._obj.enddate = _values.enddate;
    // LatestCommunicationAPI/NewGetSentMemosWithPagingJSON

    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetInboxSentMemo', this._obj);
  }
  NewMemoDropdowns(_values: InboxDTO) {
    //Using Stored Procedure
    //uspNewMemoDropdownsReturnJson
    //Parameters
    //CreatedBy bigint,OrganizationId int
    this._obj = new InboxDTO();
    this._obj.CreatedBy = _values.CreatedBy;
    this._obj.organizationid = _values.organizationid;

    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewMemoDropdownsJSON', this._obj);
  }
  
  ShareUserList(_values: InboxDTO) {
    //Using Stored Procedure
    //USP_ArchiveShare_Users
    //Parameters
    //CreatedBy bigint,OrganizationId int
    this._obj = new InboxDTO();
    this._obj.CreatedBy = _values.CreatedBy;
    this._obj.organizationid = _values.organizationid;
    this._obj.DocumentId = _values.DocumentId;

    return this.http.post(this.rootUrlII + 'Gac/ArchiveShareUserList_V2', this._obj);
  }
  ShareUserListArchive(_values: GACFiledto) {
    //Using Stored Procedure
    //USP_ArchiveShare_Users
    //Parameters
    //CreatedBy bigint,OrganizationId int
    this.obj1 = new GACFiledto();
    this.obj1.DocumentId = _values.DocumentId;
    this.obj1.CreatedBy = _values.CreatedBy;
    this.obj1.ApprovalUserJson = _values.ApprovalUserJson;
    this.obj1.ShareUserJson = _values.ShareUserJson;
    this.obj1.ReportingUserID = _values.ReportingUserID;
    this.obj1.IsArchiveApproval = _values.IsArchiveApproval;

    return this.http.post(this.rootUrlII + 'ArchiveAPI/NewShareUsersInArchive', this.obj1);
  }

  GetWorkFlowMasterAPI(_EmployeeId:number,_organizationid:number){
    this._obj = new InboxDTO();
    this._obj.EmployeeId = _EmployeeId;
    this._obj.organizationid = _organizationid;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetWorkFlowMaster', this._obj);
  }

  GetWorkFlowDetailsAPI(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.WorkFlowId = _values.WorkFlowId;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetWorkFlowDetails', this._obj);
  }

  WorkFlowDetailsOfArchiveAPI(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.WorkFlowId = _values.WorkFlowId;
    this._obj.DocumentId = _values.DocumentId;
    return this.http.post(this.rootUrlII + 'ArchiveAPI/WorkFlowDetailsOfArchive', this._obj);
  }
  UserActionListArchive(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.DocumentId = _values.DocumentId;
    return this.http.post(this.rootUrlII + 'ArchiveAPI/NewUserActionList', this._obj);
  }

  UserActionListArchiveDetailsAPI(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.DocumentId = _values.DocumentId;
    this._obj.ShareId = _values.ShareId;
    return this.http.post(this.rootUrlII + 'ArchiveAPI/NewUserActionDetails', this._obj);
  }

  UserActionDetailsArchive(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.DocumentId = _values.DocumentId;
    this._obj.UserId = _values.UserId;
    return this.http.post(this.rootUrlII + 'ArchiveAPI/NewUserActionDetails', this._obj);
  }

  MergeDocumentApI(_values: InboxDTO){
    this._obj = new InboxDTO();
    this._obj.Urls = _values.Urls;
    return this.http.post(this.rootUrlII + 'CommunicationAPI/NewMergeDocuments', this._obj);
  }
  

  InserWorkflowAPI(_values: InboxDTO) {
    this._obj = new InboxDTO();
    this._obj.WorkflowName = _values.WorkflowName;
    this._obj.AttachmentRequired = _values.AttachmentRequired;
    this._obj.ActionType = _values.ActionType;
    this._obj.Note = _values.Note;
    this._obj.CreatedByEmployeeId = _values.CreatedByEmployeeId;
    this._obj.UserListJson = _values.UserListJson;
    this._obj.UserActions = _values.UserActions;
  

    return this.http.post(this.rootUrlII + 'CommunicationAPI/InsertWorkflow', this._obj);
  }

  ShareUser(_values: InboxDTO) {
    this._obj = new InboxDTO();
    this._obj.CreatedBy = _values.CreatedBy;
    this._obj.ShareDocumentJson = _values.ShareDocumentJson;
    this._obj.DocumentId = _values.DocumentId;

    return this.http.post(this.rootUrlII + 'Gac/ArchiveAddUsers_V2', this._obj);
  }

  UsersListForAdd(MailId: number) {
    // SP Name 
    // uspGetUsersListInOutMemoANG
    this._obj = new InboxDTO();
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.organizationid = this.currentUserValue.organizationid;
    this._obj.MailId = MailId;
    // "/LatestCommunicationAPI/NewUsersListForAddANG"
    // MemoDetailsNewUsersListForAddAPI/NewUsersListForAdd
    return this.http.post(this.rootUrlII + "Users/NewUsersListForAdd", this._obj);

  }
  AddUsersInReply(MailId: number) {
    // SP Name 
    // uspGetUsersListInOutMemoANG
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.organizationid = this.currentUserValue.organizationid;
    this._obj.MailId = MailId;

    // "/LatestCommunicationAPI/NewUsersListForAddANG"
    // MemoDetailsNewUsersListForAddAPI/NewUsersListForAdd
    return this.http.post(this.rootUrlII + "Users/NewUsersListForAdd", this._obj);

  }
  GetDraftMemos(userid: number) {
    //Using Stored Procedure
    //uspGetDraftMemoList
    //Parameters
    //CreatedBy bigint
    this._obj = new InboxDTO();
    this._obj.CreatedBy = userid;
    // /LatestCommunicationAPI/NewDraftMemoListAng
    return this.http.post(this.rootUrlII + 'CommunicationAPI/DraftMemosList', this._obj);
  }

  GetBookmarklist(userid: number) {
    //Using Stored Procedure
    //USPGetBookmarkList
    //Parameters
    //CreatedBy bigint
    this._obj = new InboxDTO();
    this._obj.CreatedBy = userid;
    // /LatestCommunicationAPI/NewDraftMemoListAng
    return this.http.post(this.rootUrlII + 'CommunicationAPI/BookmarkList', this._obj);
  }
  AddPin(_values: InboxDTO) {
    // this._obj.UserId = this.currentUserValue.;
    this._obj = new InboxDTO();
    this._obj.CreatedBy = _values.UserId;
    this._obj.PopupId = _values.PopupId
    return this.http.post(this.rootUrl + "/LatestCommunicationAPI/NewAddPopupCount", this._obj);
  }
  LabelsData(_values: InboxDTO) {
    this._obj = new InboxDTO();
    this._obj.UserId = _values.UserId;
    this._obj.MailId = _values.MailId

    // MemoLabelsDataAPI/MemoLabelsData
    return this.http.post(this.rootUrlII + "LabelsAPI/MemoLabelsData", this._obj);
  }

  async ReplyListLeftSecrionInitialLoadV2(_values: InboxDTO) {
    //Using Stored Procedure
    //UspReplyListPaginationInitialLoad  by Ramesh
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyId = _values.ReplyId;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyListInitialLoadV2', this._obj);
  }


  ReplyListPaginationV2(_values: InboxDTO) {
    //Using Stored Procedure
    //UspReplyListPagination  by Ramesh
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.LastRowId = _values.LastRowId;
    this._obj.LastReplyId = _values.LastReplyId;
    this._obj.pageSize = _values.pageSize;
    this._obj.Activity = _values.Activity;
    this._obj.IsAll = _values.IsAll;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyListPagination', this._obj);
  }

  ReplyFiltersV2(_values: InboxDTO) {
    
    //Using Stored Procedure
    //UspReplyListPagination  by Ramesh
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.ReplyFilter_Unread = _values.ReplyFilter_Unread;
    this._obj.ReplyFilter_Approval = _values.ReplyFilter_Approval;
    this._obj.ReplyFilter_ReplyRrquired = _values.ReplyFilter_ReplyRrquired;
    this._obj.ReplyFilter_ByMe = _values.ReplyFilter_ByMe;
    this._obj.ReplyFilter_Attachment = _values.ReplyFilter_Attachment;
    this._obj.ReplyFilter_ByMeWithActions = _values.ReplyFilter_ByMeWithActions;
    this._obj.ReplyFilter_Bookmarks = _values.ReplyFilter_Bookmarks;
    this._obj.lastCreatedDate = _values.lastCreatedDate;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyFilters', this._obj);
  }

  async MemoHeaderDetails(_values: InboxDTO) {
    //Using Stored Procedure
    //USPMemoHeaderDetails  by Ramesh
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/MemoHeaderDetails', this._obj);
  }

  async ReplyListCustomDatesFilters(_values: InboxDTO) {
    //Using Stored Procedure
    this._obj = new InboxDTO();
    this._obj.MailId = _values.MailId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ReplyId = _values.ReplyId;
    this._obj.startDate = _values.startDate;
    this._obj.endDate = _values.endDate;
    return this.http.post(this.rootUrlII + 'MainMemoDetailsAPI/ReplyListCustomDatesFilters', this._obj);
  }
}
