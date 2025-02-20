import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { MenuDTO } from '../_models/menu-dto';
import { UserDTO } from '../_models/user-dto';
import { DocumentsapprovalDTO } from '../_models/documentsapprovaldto';
@Injectable({
  providedIn: 'root'
})
export class DocumentsapprovalapiService {
  _obj: DocumentsapprovalDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new DocumentsapprovalDTO();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  Gettabledata(_values: DocumentsapprovalDTO) {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + 'DocumentsAPI/NewGetSharingDocumentsForApprovalAng', this._obj);
  }

  GACDocumentDetails(_values: DocumentsapprovalDTO) {
    this._obj.DocumentId = _values.DocumentId;
    this._obj.ReferenceId = _values.ReferenceId;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentFullDetailsAng", this._obj);
  }

  Getwindow(_values: DocumentsapprovalDTO) {

    this._obj.ShareId = _values.ShareId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
     
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetUserDetailsofPhysicalShareAng", this._obj);
  }
  GetApproval(_values: DocumentsapprovalDTO) {
     
    this._obj.ShareIds = _values.ShareIds;
    this._obj.Status = _values.Status;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "DocumentsAPI/NewProcessShareDocumentsAng", this._obj);
  }
}
