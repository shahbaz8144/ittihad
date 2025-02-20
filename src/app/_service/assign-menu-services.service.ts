import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssignMenusDTO } from '../_models/assign-menus-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class AssignMenuServicesService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: AssignMenusDTO
  objdepartment_List: AssignMenusDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new AssignMenusDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  getrolelist(_values: AssignMenusDTO) {
    this._obj.Search= _values.Search;
    this._obj.PageNumber= _values.PageNumber;
    this._obj.PageSize = _values.PageSize;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/RoleAPI/NewGetRoles", this._obj)
  }
  getmenulist(_values: AssignMenusDTO) {
    
    this._obj.RoleId = _values.RoleId;
    return this.http.post(this.rootUrl + "/MenusAPI/NewMenusByRoleIdSPA", this._obj)
  }
  assingmenus(_values: AssignMenusDTO) {
    
    this._obj.MenuId = _values.MenuId;
    this._obj.RoleId = _values.RoleId;
    this._obj.MenuStatus = _values.MenuStatus;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/MenusAPI/NewAssignRolesSPA", this._obj)
  }
}
