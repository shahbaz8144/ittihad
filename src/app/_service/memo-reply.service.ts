import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { MemoReply } from '../_models/memo-reply.DTO';


@Injectable({
  providedIn: 'root'
})
export class MemoReplyService {
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  _ReplyMemoobj: MemoReply;

  _objInb: InboxDTO;

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  constructor(private http: HttpClient
    , private commonUrl: ApiurlService
  ) {
    this._ReplyMemoobj = new MemoReply();
    this._objInb = new InboxDTO();

    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  QuickUpload(_values: InboxDTO){
     
    this._objInb.MailId = _values.MailId;
    this._objInb.CategoryName = _values.CategoryName
    this._objInb.Comments = _values.Comments
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.ToUsersString=_values.ToUsersString;
    // alert(this._objInb.MailId);
    // alert(this._objInb.CategoryName);
    // alert(this._objInb.CreatedBy);
    // LatestCommunicationAPI/AddNewMemoCustomAttachments
    // QuickUploadAPI/QuickUpload
    return this.http.post(this.rootUrlII + "MainMemoDetailsAPI/QuickUpload", this._objInb);
  }
  MemoReply(formData: MemoReply, MailId: number, ReplyId: number, myDate: any) {
    //Stored Procedure
    //uspReplytoMemoANG
    
    formData.UserReplied = 1;
    formData.MailId = MailId;
    formData.FromUserId = this.currentUserValue.createdby;
    formData.DocumentId = 0;
    formData.IsActive = false;
    formData.ParentId = ReplyId;
    formData.message = '';
    var _touse = [];
   
    if (this._ReplyMemoobj.selectedToUser.length > 0) {
      for (let index = 0; index < this._ReplyMemoobj.selectedToUser.length; index++) {
        var jsonData = {};
        var columnName = 'ToUserId';
        jsonData[columnName] = this._ReplyMemoobj.selectedToUser[index];
        _touse.push(jsonData);
      }
      formData.ToUserxml = JSON.stringify(_touse);
    }
    else {
      formData.ToUserxml = JSON.stringify([{}]);
    }
    var _CCuse = [];
    if (formData.selectedCCUser.length > 0) {
      for (let index = 0; index < formData.selectedCCUser.length; index++) {
        var jsonData = {};
        var columnName = "CCUserId";
        jsonData[columnName] = formData.selectedCCUser[index];
        _CCuse.push(jsonData);
      }
      formData.CCUserxml = JSON.stringify(_CCuse);
    }
    else {
      formData.CCUserxml = JSON.stringify([]);
    }
    
    if (formData.Description == null)
      formData.Description = '';
    if (formData.Title == null)
      formData.Title = '';

      // ReplyAPI/MemoReply

    return this.http.post(this.rootUrlII + "MainReplyDetailsAPI/MemoReply", formData);
  }

    MemoReplys(_values: InboxDTO) {
      // SP Name 
      // uspReplytoMemoANG by Ramesh
      
    this._objInb.UserReplied = _values.UserReplied;
    this._objInb.MailId = _values.MailId;
    this._objInb.DocumentId = _values.DocumentId;
    this._objInb.FromUserId = _values.FromUserId;
    this._objInb.Reply = _values.Reply;
    this._objInb.DeadLineDate = _values.DeadLineDate;
    this._objInb.Attachment = _values.Attachment;
    this._objInb.Description = _values.Description;
    this._objInb.ApprovalPending_F = _values.ApprovalPending_F;
    this._objInb.IsConfidential = _values.IsConfidential
    this._objInb.IsActive = _values.IsActive;
    this._objInb.ParentId = _values.ParentId;
    this._objInb.Deadline_sort = _values.Deadline_sort;
    this._objInb.message = _values.message;
    this._objInb.Title = _values.Title;
    this._objInb.MemoReplyType = _values.MemoReplyType;
    this._objInb.MailDocIdString = _values.MailDocIdString;
    var _touse = [];

    if (_values.ToUserxml.length > 0) {
        for (let index = 0; index < _values.ToUserxml.length; index++) {
          var jsonData = {};
          var columnName = 'ToUserId';
          jsonData[columnName] = _values.ToUserxml[index];
          _touse.push(jsonData);
        }
        this._objInb.ToUserxml = JSON.stringify(_touse);
      }
      else {
        this._objInb.ToUserxml = JSON.stringify([{}]);
      }
      var _CCuse = [];
      if (_values.CCUserxml.length > 0) {
        for (let index = 0; index < _values.CCUserxml.length; index++) {
          var jsonData = {};
          var columnName = "CCUserId";
          jsonData[columnName] = _values.CCUserxml[index];
          _CCuse.push(jsonData);
        }
        this._objInb.CCUserxml  = JSON.stringify(_CCuse);
    }
    else {
      this._objInb.CCUserxml  = JSON.stringify([]);
    }
   
    return this.http.post(this.rootUrlII + "MainReplyDetailsAPI/MemoReply", this._objInb);
  }

  EditReply(_values: InboxDTO) {
    // SP Name
    // UspReplyUpdate
    this._objInb.UserReplied = _values.UserReplied;
    this._objInb.MailId = _values.MailId;
    this._objInb.ReplyId = _values.ReplyId;
    this._objInb.DocumentId = _values.DocumentId;
    this._objInb.FromUserId = _values.FromUserId;
    this._objInb.Reply = _values.Reply;
    this._objInb.DeadLineDate = _values.DeadLineDate;
    this._objInb.Attachment = _values.Attachment;
    this._objInb.Description = _values.Description;
    this._objInb.ApprovalPending_F = _values.ApprovalPending_F;
    this._objInb.IsConfidential = _values.IsConfidential
    this._objInb.IsActive = _values.IsActive;
    this._objInb.ParentId = _values.ParentId;
    this._objInb.Deadline_sort = _values.Deadline_sort;
    this._objInb.message = _values.message;
    this._objInb.Title = _values.Title;
    this._objInb.MemoReplyType = _values.MemoReplyType;
    this._objInb.MailDocIdString = _values.MailDocIdString;
    var _touse = [];

    if (_values.ToUserxml.length > 0) {
        for (let index = 0; index < _values.ToUserxml.length; index++) {
          var jsonData = {};
          var columnName = 'ToUserId';
          jsonData[columnName] = _values.ToUserxml[index];
          _touse.push(jsonData);
        }
        this._objInb.ToUserxml = JSON.stringify(_touse);
      }
      else {
        this._objInb.ToUserxml = JSON.stringify([{}]);
      }
      var _CCuse = [];
      if (_values.CCUserxml.length > 0) {
        for (let index = 0; index < _values.CCUserxml.length; index++) {
          var jsonData = {};
          var columnName = "CCUserId";
          jsonData[columnName] = _values.CCUserxml[index];
          _CCuse.push(jsonData);
        }
        this._objInb.CCUserxml  = JSON.stringify(_CCuse);
    }
    else {
      this._objInb.CCUserxml  = JSON.stringify([]);
    }
   
    return this.http.post(this.rootUrlII + "MainReplyDetailsAPI/MemoReplyUpdate", this._objInb);
  }

  Sendmessage(txt: string, MailId: number) {
    this._objInb.Attachment = false;
    this._objInb.Purpose = txt;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.MailId = MailId;
    this._objInb.UserReplied = 0;

    return this.http.post(this.rootUrl + "/CommunicationAPI/AddReplyMemo", this._objInb);
  }

  ConversationList(MailId: number, PageSize: number, PageNumber: number) {
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.PageSize = PageSize;
    this._objInb.PageNumber = PageNumber;
    this._objInb.MailId = MailId;
    return this.http.post(this.rootUrl + "/LatestCommunicationAPI/NewMemoConversationListANG", this._objInb);
  }
  HistoryList(MailId: number) {
    
    // SP Name  
    // uspGetMailHistory
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.MailId = MailId;
   
    // /LatestCommunicationAPI/MemoHistoryANG
    // MemoHistoryAPI/MemoHistory
    // /MainMemoDetailsAPI/MemoHistory
    return this.http.post(this.rootUrlII + "MainMemoDetailsAPI/MemoHistory", this._objInb);
  }
  AttachmentList(MailId: number,_values: InboxDTO) {
    
    // SP Name
    // uspGetMailAttachments
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.MailId = MailId;
    this._objInb.SortType = _values.SortType;
    this._objInb.UserId = this.currentUserValue.createdby;
    // "/LatestCommunicationAPI/NewGetMemoAttachments"
    // "MemoAttachmentListAPI/MemoAttachment"
    // MainMemoDetailsAPI/MemoAttachment
    return this.http.post(this.rootUrlII + "MainMemoDetailsAPI/MemoAttachment", this._objInb);
  }

  SaveasDraft(_values: InboxDTO) {

    this._objInb.TextContent=_values.TextContent;
    this._objInb.Description = _values.Description;
    this._objInb.MailId=_values.MailId;
    this._objInb.ReplyId=_values.ReplyId;
    this._objInb.CreatedBy=this.currentUserValue.createdby;
    // this._objInb.DraftId=_values.DraftId;
    this._objInb.Subject=_values.Subject;
    this._objInb.DraftId=_values.DraftId;
    // "/LatestCommunicationAPI/NewSaveasDraftMemo"
    // MainReplyDetailsAPI/saveasdraft
    return this.http.post(this.rootUrlII + "MainReplyDetailsAPI/saveasdraft", this._objInb);
  }

  DeleteDraft(_values: InboxDTO) {
    this._objInb.DraftId=_values.DraftId;
    // "/LatestCommunicationAPI/NewSaveasDraftMemo"
    // MainReplyDetailsAPI/saveasdraft
    return this.http.post(this.rootUrlII + "MainReplyDetailsAPI/Deletedraft", this._objInb);
  }
}
