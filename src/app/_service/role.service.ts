import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoleDTO } from '../_models/role-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: RoleDTO
  objRole_list: RoleDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new RoleDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  getrolelist(_values: RoleDTO) {
    this._obj.Search= _values.Search;
  this._obj.PageNumber= _values.PageNumber;
  this._obj.PageSize = _values.PageSize;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/RoleAPI/NewGetRoles", this._obj)
  }
  insertroledetails(_values: RoleDTO) {
    this._obj.RoleName = _values.RoleName;
    if (this._obj.Description = null) {
      this._obj.Description = "";
    }
    this._obj.RoleName = _values.RoleName;
    this._obj.Description = _values.Description;
    this._obj.Sharing = _values.Sharing;
    this._obj.IsActive = _values.IsActive;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.FlagId = _values.FlagId;
    if (_values.FlagId == 2) {
      this._obj.RoleId = _values.RoleId;
    }
    else if (_values.FlagId == 1) {
      this._obj.RoleId = 0
    }
    this._obj.RoleId = _values.RoleId;
    return this.http.post(this.rootUrl + "/RoleAPI/NewRole", this._obj)
  }
  checkrolename(_values: RoleDTO) {
    this._obj.RoleName = _values.RoleName;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/RoleAPI/NewCheckRoleName", this._obj)
  }
  updaterolestatus(objStatus) {
    this._obj.RoleId = objStatus.RoleId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/RoleAPI/NewRoleStatus", this._obj)
  }
}
