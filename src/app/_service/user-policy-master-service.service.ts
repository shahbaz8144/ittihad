import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';
import { UserPolicyMasterDTO } from '../_models/user-policy-master-dto';
@Injectable({
  providedIn: 'root'
})
export class UserPolicyMasterServiceService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _obj: UserPolicyMasterDTO
  objPolicy_List: UserPolicyMasterDTO[]
  readonly rootUrl = this.commonUrl.apiurl;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new UserPolicyMasterDTO();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetPolicyList(){
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewPolicyList', this._obj);
  }
  InsertPolicy(_values:UserPolicyMasterDTO){
     
    this._obj.PolicyId = _values.PolicyId
    this._obj.PolicyHeader = _values.PolicyHeader;
    this._obj.PolicyContent = _values.PolicyContent;
    this._obj.IsActive = _values.IsActive;
    this._obj.IsAll = _values.IsAll;
    this._obj.IsCompany = _values.IsCompany;
    this._obj.IsDepartment = _values.IsDepartment;
    this._obj.IsDesignation = _values.IsDesignation;
    this._obj.CompanyIds = _values.CompanyIds;
    this._obj.DepartmentIds = _values.DepartmentIds;
    this._obj.DesignationIds = _values.DesignationIds
    // this._obj.PolicyStatus=_values.PolicyStatus;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewPolicy', this._obj);
  }
  UpDatedialog_Status(objStatus) {
    this._obj.PolicyId = objStatus.PolicyId;
    this._obj.IsActive = objStatus.IsActive;
    return this.http.post(this.rootUrl + "/OrganizationAPI/NewUpdatePolicyStatus", this._obj);
  }
  GetCompanyList() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewCompanyDepartmentDrpJson", this._obj);
  }
  
}
