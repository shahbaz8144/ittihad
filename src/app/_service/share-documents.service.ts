import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { MenuDTO } from '../_models/menu-dto';
import { UserDTO } from '../_models/user-dto';
import { ShareDocumentsDTO } from '../_models/share-documents-dto';
import { __values } from 'tslib';
@Injectable({
  providedIn: 'root'
})
export class ShareDocumentsService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  _obj:ShareDocumentsDTO;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj=new ShareDocumentsDTO();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GettableList(__values:ShareDocumentsDTO){
    
    this._obj.CreatedBy =this.currentUserValue.createdby; 
    this._obj.CompanyId=__values.CompanyId
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentsForSharingDocumentsAng", this._obj);
  }
  GetCompanyList() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewCompanyDepartmentDrpJson", this._obj);
  }
  Getuser(__values:ShareDocumentsDTO){
    this._obj.CompanyId=__values.CompanyId
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetUsersAng", this._obj);
  }
  NewGetCheckAvailibility(__values:ShareDocumentsDTO){
    this._obj.DocumentId=__values.DocumentId
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetCheckAvailibilityAng", this._obj);
  }
  AddSharingDocumentsAng(__values:ShareDocumentsDTO){
    this._obj.CompanyId=__values.CompanyId;
    this._obj.SharingType=__values.SharingType;
    this._obj.SharingStatus=__values.SharingStatus;
    this._obj.StartDate=__values.StartDate;
    this._obj.EndDate=__values.EndDate;
    this._obj.FromUserId=this.currentUserValue.createdby; 
    this._obj.ToUserId=__values.ToUserId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy =this.currentUserValue.createdby; 
    this._obj.AccessType=__values.AccessType;
   
    return this.http.post(this.rootUrl + "/DocumentsAPI/AddSharingDocumentsAng", this._obj);
  }
  ReceivePhysicalDocument(__values:ShareDocumentsDTO){
    
    this._obj.DocumentId=__values.DocumentId;
    this._obj.CreatedBy =this.currentUserValue.createdby;
    this._obj.FlagId=__values.FlagId;
    this._obj.Description=__values.Description;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewReceivePhysicalGACArchive", this._obj);
  }
  ShareStatusUpdate(__values:ShareDocumentsDTO){
    this._obj.ShareId=__values.ShareId;//__values.ShareId;
    this._obj.SharingStatus=__values.SharingStatus;
    this._obj.CreatedBy =this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewShareStatusUpdate", this._obj);
  }
 
}
