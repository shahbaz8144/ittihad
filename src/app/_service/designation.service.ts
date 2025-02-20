import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DesignationDTO } from '../_models/designation.dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  //private _values: any;
  _obj:DesignationDTO
  objDesignation: DesignationDTO;
  objDesignation_List:DesignationDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new DesignationDTO();
    this.objDesignation = new DesignationDTO;
   }
   readonly rootUrl = this.commonUrl.apiurl;
   public get currentUserValue(): UserDTO {
     return this.currentUserSubject.value[0];
   }
   GetdesignationData(_values: DesignationDTO) {
    this._obj.Search= _values.Search;
    this._obj.PageNumber= _values.PageNumber;
    this._obj.PageSize = _values.PageSize;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DepartmentAPI/NewGetDesignation", this._obj)
   }
   designation_add(_values: DesignationDTO) {
    debugger
    this.objDesignation.DesignationName = _values.DesignationName;
    if (this._obj.IsActive == null) {
      this._obj.IsActive = true;
    }
    
    this.objDesignation.DesignationName = _values.DesignationName
    this.objDesignation.IsActive = _values.IsActive;
    this.objDesignation.CreatedBy = this.currentUserValue.createdby;
    this. objDesignation.OrganizationId = this.currentUserValue.organizationid;
    // this.objDesignation.Search = _values.Search;
    // this.objDesignation.PageNumber = _values.PageNumber;
    // this.objDesignation.PageSize = _values.PageSize;
    this.objDesignation.FlagId = _values.FlagId;
    if(_values.FlagId==2){
      this.objDesignation.DesignationId=_values.DesignationId;
    }
    else if(_values.FlagId==1){
      this.objDesignation.DesignationId=0;
    }
    this.objDesignation.DesignationId=_values.DesignationId;
  
    return this.http.post(this.rootUrl + "/DepartmentAPI/NewDesignationInsertUpdate", this.objDesignation);
}
UpDatedialog_Status(objStatus) {
  // this.ObjracksDto.WareHouseId = objStatus.WareHouseId;
  this.objDesignation.DesignationId = objStatus.DesignationId
  this.objDesignation.OrganizationId = this.currentUserValue.organizationid;
  // this.objDesignation.IsActive = objStatus.IsActive;
  this.objDesignation.CreatedBy = this.currentUserValue.createdby;
  this.http.post(this.rootUrl + "/DepartmentAPI/NewDesignationStatus", this.objDesignation)
    .subscribe(
      (data) => {
        this.objDesignation_List = data as DesignationDTO[];
      });
}

}