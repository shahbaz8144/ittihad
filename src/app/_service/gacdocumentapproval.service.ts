import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GacdocumentapprovalDTO } from '../_models/gacdocumentapproval-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class GacdocumentapprovalService {
 
  _obj: GacdocumentapprovalDTO = new GacdocumentapprovalDTO;

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  private _values: any;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new GacdocumentapprovalDTO;
   }
   public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetCompanyList(){
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "DocumentsAPI/NewCompanyDepartmentDrpJson", this._obj);
  }
  GetdocumentsbyStatus(documentstatus,CompanyId){
     this._obj.OrganizationId = this.currentUserValue.organizationid;
     this._obj.DocumentStatus = documentstatus;
     this._obj.CompanyId = CompanyId;
    return this.http.post(this.rootUrl+ "DocumentsAPI/NewGetdocumentsbyStatusAng", this._obj)
  }
  GACDocumentDetails(_values:GacdocumentapprovalDTO ) {
    this._obj.DocumentId=_values.DocumentId;
    this._obj.ReferenceId=_values.ReferenceId;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentFullDetailsAng", this._obj);
  }
  GACDocumentStatusChange(_values:GacdocumentapprovalDTO){
    debugger
    this._obj.DocumentStatus=_values.DocumentStatus;
    this._obj.DocumentId=_values.DocumentId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.comments = _values.comments
    return this.http.post(this.rootUrl+"DocumentsAPI/NewGACDocumentStatusChangeAng", this._obj)
  }
  GACUpdateDocumentName(_values:GacdocumentapprovalDTO){
    debugger
    this._obj.DocumentId=_values.DocumentId;
    this._obj.DocumentName=_values.DocumentName;
    this._obj.CreatedBy = this.currentUserValue.createdby;

    return this.http.post(this.rootUrl+"DocumentsAPI/NewUpdateDocumentName", this._obj)
  }
  GACUploadReferenceAttachmenst(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    return this.http.post(this.rootUrl + "/DocumentsAPI/AddGACReferenceDocuments", data);
  }
}
