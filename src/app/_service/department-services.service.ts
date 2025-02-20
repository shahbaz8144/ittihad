import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { DepartmentDTO } from '../_models/department-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentServicesService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: DepartmentDTO
  objdepartment_List: DepartmentDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new DepartmentDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  getdepartmentlist(_values: DepartmentDTO) {
    this._obj.Search= _values.Search;
    this._obj.PageNumber= _values.PageNumber;
    this._obj.PageSize = _values.PageSize
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DepartmentAPI/NewGetDepartment", this._obj)
  }
  insertdepartmentdetails(_values: DepartmentDTO) {
    this._obj.DepartmentName = _values.DepartmentName;
    if (this._obj.Description == null) {
      this._obj.Description = "";
    }
    this._obj.DepartmentName = _values.DepartmentName;
    this._obj.Description = _values.Description;
    this._obj.IsMandatory = _values.IsMandatory
    this._obj.IsActive = _values.IsActive;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.FlagId = _values.FlagId;
    if (_values.FlagId == 2) {
      this._obj.DepartmentId = _values.DepartmentId;
    }
    else if (_values.FlagId == 1) {
      this._obj.DepartmentId = 0
    }
    this._obj.DepartmentId = _values.DepartmentId;
    return this.http.post(this.rootUrl + '/DepartmentAPI/NewDepartmentInsertUpdate', this._obj);
  }
  CheckDepartmentName(_values: DepartmentDTO) {
    this._obj.DepartmentName = _values.DepartmentName;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DepartmentAPI/NewCheckDepartmentName", this._obj);
  }
  updatedepartmentstatus(objStatus) {
    this._obj.DepartmentId = objStatus.DepartmentId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.FlagId = objStatus.FlagId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DepartmentAPI/NewDepartmentStatus", this._obj)
  }
}
