import { Injectable } from '@angular/core';
import { NewMemo } from '../_models/new-memo.DTO';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { AddUsers } from '../_models/add-users.DTO';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewMemoService {

  //formData: NewMemo;
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  readonly NotificationRootUrl = this.commonUrl.apiNotificationBrowserUrl;
  _NewMemoobj: NewMemo;
  _AddUserObj: AddUsers;
  _objInb: InboxDTO

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  constructor(private http: HttpClient
    , private commonUrl: ApiurlService
  ) {
    this._NewMemoobj = new NewMemo();
    this._AddUserObj = new AddUsers();
    this._objInb = new InboxDTO();
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  NewMemo(formData: NewMemo, myDate: Date, DeadlineDatecheck: boolean) {

    formData.CreatedBy = this.currentUserValue.createdby;

    var _touse = [];
    if (formData.ToUserAry.length > 0) {
      for (let index = 0; index < formData.ToUserAry.length; index++) {
        //const element = array[index];
        var jsonData = {};
        var columnName = "ToUserId";
        jsonData[columnName] = formData.ToUserAry[index];
        _touse.push(jsonData);
      }
      formData.ToUserxml = JSON.stringify(_touse);
    }
    else {
      formData.ToUserxml = JSON.stringify('[{}]');
    }
    var _ccuse = [];
    if (formData.CCUserAry.length > 0) {
      for (let index = 0; index < formData.CCUserAry.length; index++) {
        var jsonData = {};
        var columnName = "CCUserId";
        jsonData[columnName] = formData.CCUserAry[index];
        _ccuse.push(jsonData);
      }
      formData.CCUserxml = JSON.stringify(_ccuse);
    }
    else {
      formData.CCUserxml = '[]'
    }
    formData.DeadLineDate = myDate;
    formData.Deadline_sort = DeadlineDatecheck;
    // formData.ApprovalType = 'S';
    // debugger
    return this.http.post(this.rootUrlII + "CommunicationAPI/NewMemoANG", formData);
  }

  NewMemoV2(values: InboxDTO) {
    //  SP Name
    // uspEnhancedNewMemo

    this._objInb.MemoType = values.MemoType;
    this._objInb.Subject = values.Subject;
    this._objInb.Purpose = values.Purpose;
    this._objInb.Attachment = values.Attachment;
    this._objInb.CreatedBy = values.CreatedBy;
    this._objInb.ReferenceNo = values.ReferenceNo;
    this._objInb.ToUserxml = values.ToUserxml;
    this._objInb.CCUserxml = values.CCUserxml;
    this._objInb.Reply = values.Reply;
    this._objInb.ApprovalPending_F = values.ApprovalPending_F;
    this._objInb.DeadLineDate = values.DeadLineDate;
    this._objInb.IsConfidential = values.IsConfidential;
    this._objInb.Deadline_sort = values.Deadline_sort;

    var _touse = [];

    if (values.ToUserxml.length > 0) {
      for (let index = 0; index < values.ToUserxml.length; index++) {
        var jsonData = {};
        var columnName = 'ToUserId';
        jsonData[columnName] = values.ToUserxml[index];
        _touse.push(jsonData);
      }
      this._objInb.ToUserxml = JSON.stringify(_touse);
    }
    else {
      this._objInb.ToUserxml = JSON.stringify([{}]);
    }
    var _CCuse = [];
    if (values.CCUserxml.length > 0) {
      for (let index = 0; index < values.CCUserxml.length; index++) {
        var jsonData = {};
        var columnName = "CCUserId";
        jsonData[columnName] = values.CCUserxml[index];
        _CCuse.push(jsonData);
      }
      this._objInb.CCUserxml = JSON.stringify(_CCuse);
    }
    else {
      this._objInb.CCUserxml = JSON.stringify([]);
    }


    // formData.ApprovalType = 'S';
    // debugger
    return this.http.post(this.rootUrlII + "CommunicationAPI/NewMemoANG", this._objInb);
  }

  SendWorkflowV2(values: InboxDTO) {

    this._objInb.WorkFlowJson = values.WorkFlowJson;
    this._objInb.MemoType = values.MemoType;
    this._objInb.Subject = values.Subject;
    this._objInb.Purpose = values.Purpose;
    this._objInb.Attachment = values.Attachment;
    this._objInb.CreatedBy = values.CreatedBy;
    this._objInb.ReferenceNo = values.ReferenceNo;
    this._objInb.CCUserxml = values.CCUserxml;
    this._objInb.IsConfidential = values.IsConfidential;
    this._objInb.DeadLineDate = values.DeadLineDate;
    this._objInb.MailId = values.MailId;
    // var _touse = [];

    // if (values.ToUserxml.length > 0) {
    //   for (let index = 0; index < values.ToUserxml.length; index++) {
    //     var jsonData = {};
    //     var columnName = 'ToUserId';
    //     jsonData[columnName] = values.ToUserxml[index];
    //     _touse.push(jsonData);
    //   }
    //   this._objInb.ToUserxml = JSON.stringify(_touse);
    // }
    // else {
    //   this._objInb.ToUserxml = JSON.stringify([{}]);
    // }
    var _CCuse = [];
    if (values.CCUserxml.length > 0) {
      for (let index = 0; index < values.CCUserxml.length; index++) {
        var jsonData = {};
        var columnName = "CCUserId";
        jsonData[columnName] = values.CCUserxml[index];
        _CCuse.push(jsonData);
      }
      this._objInb.CCUserxml = JSON.stringify(_CCuse);
    }
    else {
      this._objInb.CCUserxml = JSON.stringify([]);
    }


    // formData.ApprovalType = 'S';
    // debugger
    return this.http.post(this.rootUrlII + "CommunicationAPI/SendWorkFlow", this._objInb);
  }
  uploadFile(fileData): Observable<any> {
    fileData.append("createdBy", this.currentUserValue.createdby.toString());
    const uploadReq = new HttpRequest('POST', this.rootUrlII + "FileUploadAPI/PostCommunicationFiles", fileData, {
      headers: new HttpHeaders(),
      reportProgress: true // Enables progress events
    });

    return this.http.request(uploadReq);
  }
  UploadAttachmenst(filedata: any) {
    // same api using replyids and approve and reject status
    filedata.append("createdBy", this.currentUserValue.createdby.toString());
    console.log(filedata, "quick attachments");
    for (let [key, value] of filedata.entries()) {
      console.log(key, value);
    }
    try {
      return this.http.post(this.rootUrlII + "FileUploadAPI/NewPostCommunicationFiles", filedata
        , {
          reportProgress: true,
          observe: 'events'
        }).pipe(
      );
    } catch (error) {

      console.log(error, "error");
    }
    // return this.http.post(this.rootUrlII + "FileUploadAPI/NewPostCommunicationFiles", filedata
    //   , {
    //     reportProgress: true,
    //     observe: 'events'
    //   }).pipe(
    // );
  }
  private getEventMessage(event: HttpEvent<any>): number {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        // Compute and return the percentage of the upload completed
        return Math.round(100 * event.loaded / event.total);
      case HttpEventType.Response:
        return 100; // Upload is complete
      default:
        return 0;
    }
  }
  UploadSuggestionShareAttachment(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    console.log("Form Data Suggestion", data)
    return this.http.post(this.rootUrl + "/OrganizationAPI/NewAddSuggestionShareAttachment", data
      , {
        reportProgress: true,
        observe: 'events'
      }).pipe(
      // catchError(this.errorMgmt)
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  AddExtraUsers(formData: AddUsers, MailId: number, ReplyIds: string, comments: string) {

    formData.CreatedBy = this.currentUserValue.createdby;
    formData.OrganizationId = this.currentUserValue.organizationid;
    formData.message = comments;
    var _touse = [];
    if (formData.ToUserAry.length > 0) {
      for (let index = 0; index < formData.ToUserAry.length; index++) {
        var jsonData = {};
        var columnName = '';
        if (formData.IsToUsers == true) {
          columnName = 'ToUserId';
        } else {
          columnName = 'CCUserId';
        }

        jsonData[columnName] = formData.ToUserAry[index];
        _touse.push(jsonData);
      }
      if (formData.IsToUsers == true) {
        formData.ToUserxml = JSON.stringify(_touse);
        formData.CCUserxml = '[]';
      } else {
        formData.CCUserxml = JSON.stringify(_touse);
        formData.ToUserxml = '[]';
      }
    }
    formData.MailId = MailId;
    formData.ReplyIds = ReplyIds;
    if (formData.message == null) { formData.message = ""; }
    // "/LatestCommunicationAPI/NewAddExtraUsers"
    // MemoDetailsAddExtraUsersAPI/NewAddExtraUsers
    return this.http.post(this.rootUrlII + "Users/NewAddExtraUsers", formData);

  }
  AddExtraUser(_obj: InboxDTO, ReplyIds: string) {
    // SP Name
    // uspAddUsersInMemoReplies

    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.message = _obj.message;
    this._objInb.ToUserxml = _obj.ToUserxml;
    this._objInb.CCUserxml = _obj.CCUserxml;
    this._objInb.MailId = _obj.MailId;
    this._objInb.ReplyIds = ReplyIds;
    if (this._objInb.message == null) {
      this._objInb.message = "";
    }
    return this.http.post(this.rootUrlII + "Users/NewAddExtraUsers", this._objInb);
  }

  AddUserCountFeature(_obj: InboxDTO) {
    // SP Name
    // uspAddUserCountFeature
    this._objInb.FeatureId = _obj.FeatureId;
    this._objInb.UserId = _obj.UserId;
    return this.http.post(this.rootUrlII + "Users/AddUserCountFeature", this._objInb);
  }

  Requestuser(_obj: InboxDTO) {
    this._objInb.MailId = _obj.MailId;
    this._objInb.ReplyId = _obj.ReplyId;
    this._objInb.FromUserId = _obj.FromUserId;
    this._objInb.Description = _obj.Description;
    // /LatestCommunicationAPI/NewDMSRequest
    // Core ApI
    // Users/DMSRequest
    return this.http.post(this.rootUrlII + 'Users/DMSRequest', this._objInb);

  }
  DownloadAttachment(_obj: InboxDTO) {
    this._objInb.MailId = _obj.MailId;
    this._objInb.MailDocId = _obj.MailDocId;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.AnnouncementDocId = _obj.AnnouncementDocId;
    return this.http.post(this.rootUrl + 'LatestCommunicationAPI/NewAddAttachmentDownloadHistory', this._objInb);
  }
  HistoryDownload(_obj: InboxDTO) {
    this._objInb.MailDocId = _obj.MailDocId;
    this._objInb.MailId = _obj.MailId;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.AnnouncementDocId = _obj.AnnouncementDocId;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewGetAttachmentDownloadHistory', this._objInb);
  }
  AddAnnouncement(_obj: InboxDTO) {
    this._objInb.Subject = _obj.Subject;
    this._objInb.Description = _obj.Description;
    this._objInb.StartDateTime = _obj.StartDateTime;
    this._objInb.EndDateTime = _obj.EndDateTime;
    this._objInb.Attachment = _obj.Attachment;
    this._objInb.AnnouncementStatus = _obj.AnnouncementStatus;
    this._objInb.IsAll = _obj.IsAll;
    this._objInb.IsCompany = _obj.IsCompany;
    this._objInb.IsDepartment = _obj.IsDepartment;
    this._objInb.IsDesignation = _obj.IsDesignation;
    this._objInb.CompanyIds = _obj.CompanyIds;
    this._objInb.DepartmentIds = _obj.DepartmentIds;
    this._objInb.DesignationIds = _obj.DesignationIds;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.ReportingUserId = _obj.ReportingUserId;
    this._objInb.IsReportingUser = _obj.IsReportingUser;
    this._objInb.UserIds = _obj.UserIds

    // Core Api
    //  CommunicationAPI/AddAnnouncementANG
    // Old Api
    // /OrganizationAPI/NewAnnouncement
    return this.http.post(this.rootUrlII + 'CommunicationAPI/AddAnnouncementV2', this._objInb);
  }
  UploadAnnouncemtAttachmenst(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    return this.http.post(this.rootUrl + "/OrganizationAPI/NewAddMemoAttachment", data
      , {
        reportProgress: true,
        observe: 'events'
      }).pipe(
      // catchError(this.errorMgmt)
    );
  }
  AddBanner(_obj: InboxDTO) {
    this._objInb.BannerId = _obj.BannerId;
    this._objInb.IsAll = _obj.IsAll;
    this._objInb.CompanyIds = _obj.CompanyIds;
    this._objInb.BannerName = _obj.BannerName;
    this._objInb.StartDateTime = _obj.StartDateTime;
    this._objInb.EndDateTime = _obj.EndDateTime;
    this._objInb.EndDateTime.setHours(12);
    this._objInb.EndDateTime.setMinutes(15);
    this._objInb.EndDateTime.setSeconds(0);
    this._objInb.StartDateTime.setHours(12);
    this._objInb.StartDateTime.setMinutes(15);
    this._objInb.StartDateTime.setSeconds(0);
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.FlagId = _obj.FlagId
    if (_obj.FlagId == 2) {
      this._objInb.BannerId = _obj.BannerId;
    }
    else if (_obj.FlagId == 1) {
      this._objInb.BannerId = 0;
    }
    return this.http.post(this.rootUrlII + 'Users/AddUpdateBanner', this._objInb);
  }
  UploadBannerAttachmenst(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    return this.http.post(this.rootUrl + "/OrganizationAPI/NewAddBannerAttachment", data
      , {
        reportProgress: true,
        observe: 'events'
      }).pipe(
      // catchError(this.errorMgmt)
    );
  }
  CheckReportingUserCount(_obj: InboxDTO) {
    this._objInb.UserId = _obj.UserId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewReportingUserCount', this._objInb);
  }
  MemoSuggestions(_obj: InboxDTO) {
    this._objInb.Suggestionjson = _obj.Suggestionjson;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.IsAll = _obj.IsAll;
    this._objInb.IsCompany = _obj.IsCompany;
    this._objInb.IsDepartment = _obj.IsDepartment;
    this._objInb.IsDesignation = _obj.IsDesignation;
    this._objInb.CompanyIds = _obj.CompanyIds;
    this._objInb.UserIds = _obj.UserIds;
    this._objInb.DepartmentIds = _obj.DepartmentIds;
    this._objInb.DesignationIds = _obj.DesignationIds;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    this._objInb.ReportingUserId = _obj.ReportingUserId;
    this._objInb.IsReportingUser = _obj.IsReportingUser;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewSuggestion', this._objInb);
  }
  BannerList() {
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'Users/GetBanner', this._objInb);
  }
  SelectUser(_obj: InboxDTO) {
    this._objInb.OrganizationId = this.currentUserValue.organizationid;
    this._objInb.CompanyIds = _obj.CompanyIds;
    this._objInb.DepartmentIds = _obj.DepartmentIds;
    this._objInb.DesignationIds = _obj.DesignationIds;
    return this.http.post(this.rootUrl + 'OrganizationAPI/NewGetFilteredUsers', this._objInb);
  }

  NewMemosTrigger(_NewMemosTrigger: string, _NewRepliesTrigger: string) {
    this._objInb.NewMemosTrigger = _NewMemosTrigger;
    this._objInb.NewRepliesTrigger = _NewRepliesTrigger;
    return this.http.post(this.rootUrlII + 'SignalR_API/NewMemosTrigger', this._objInb);
  }

  NewMemosNotification(title, _userids: string, subject: string, MailId: number, ReplyId: number) {
    debugger
    this._objInb.title = title;
    this._objInb.body = subject;
    this._objInb.url = "https://cswebapps.com/dmsweb/Memo/Details/" + MailId + "/" + ReplyId;
    this._objInb.userIds = _userids;
    console.log(_userids, "_userids");
    // return this.http.post(this.rootUrlII + 'SignalR_API/NewMemosTrigger', this._objInb);
    return this.http.post(this.NotificationRootUrl + 'Notifications/send', this._objInb);
  }
}
