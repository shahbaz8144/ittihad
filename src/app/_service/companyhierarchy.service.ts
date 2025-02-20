import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyhierarchyDTO } from '../_models/companyhierarchy-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyhierarchyService {
  _obj: CompanyhierarchyDTO = new CompanyhierarchyDTO
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  private _values: any;
  CompanyId:number;
  DepartmentId:number;
  OutsourceId:number;
  UserIds:number;
  CreatedBy:number;
  IsDepartmentHead:boolean;
  IsKeyMember:boolean;
  ReportingManagerId:number;



  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }
   public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
   GetCompanyList() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewCompanyDepartmentDrpJson", this._obj);
  }
  GetDepartmentList(_values:CompanyhierarchyDTO) {
    this._obj.CompanyId=_values.CompanyId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/CompanyAPI/NewGetCompanydetailsJsonAng", this._obj);
  }
  GetDetailsList(values:CompanyhierarchyDTO){
    this._obj.CompanyId=values.CompanyId;
    this._obj.DepartmentId=values.DepartmentId;
    return this.http.post(this.rootUrl + "/CompanyAPI/NewGetDepartmentCompanyUserDetailsAng", this._obj);
  }
GetKeyList(val:CompanyhierarchyDTO){
  this._obj.SelectedCompanyId=val.SelectedCompanyId;
  this._obj.CompanyId=val.CompanyId;
  this._obj.DepartmentId=val.DepartmentId;
  this._obj.FlagId = val.FlagId;
  
  

  return this.http.post(this.rootUrl + '/CompanyAPI/NewGetSelectedCompanyDeptManagersAng', this._obj);

}

DeleteActingManager(_val:CompanyhierarchyDTO){
  this._obj.OutsourceId=_val.OutsourceId;
  return this.http.post(this.rootUrl + '/CompanyAPI/NewDeleteUserOfSharedService', this._obj); 
}
DeleteKeymembers(val:CompanyhierarchyDTO){
  this._obj.OutsourceId=val.OutsourceId;
  return this.http.post(this.rootUrl + '/CompanyAPI/NewDeleteUserOfSharedServiceAng', this._obj); 
}
SaveManager(_val:CompanyhierarchyDTO){
  this._obj.UserIds=_val.UserIds;

  this._obj.CreatedBy = this.currentUserValue.createdby;
 
  this._obj.IsDepartmentHead=_val.IsDepartmentHead;
  this._obj.IsKeyMember=_val.IsKeyMember;
  this._obj.ReportingManagerId=_val.ReportingManagerId;
  this._obj.CompanyId=_val.CompanyId;
  this._obj.DepartmentId=_val.DepartmentId;
  return this.http.post(this.rootUrl + '/CompanyAPI/NewAddSharedServiceAng', this._obj);
}

}
