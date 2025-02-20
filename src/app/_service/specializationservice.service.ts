import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { __values } from 'tslib';
import { ShelvescapacityDTO } from '../_models/shelvescapacity-dto';
import { SpecializationDTO } from '../_models/specialization-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class SpecializationserviceService {
  _obj:SpecializationDTO;
  currentUserSubject: BehaviorSubject<UserDTO>;
  currentUser: Observable<UserDTO>;
  objSpecialization:SpecializationDTO;
  objSpecialization_List:SpecializationDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new SpecializationDTO();
    this.objSpecialization = new SpecializationDTO;
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetSpecializationList(_values: SpecializationDTO) {
 
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/SourceAPI/NewGetSpecialitions", this._obj)
   }
   Specialization_add(_values: SpecializationDTO) {
    this.objSpecialization.Specialization = _values.Specialization;
    if (_values.IsActive == null) {
      _values.IsActive = true;
    }
    
    this.objSpecialization.Specialization = _values.Specialization;
    if(_values.Description==null){
      _values.Description="";
    }
    this.objSpecialization.Description = _values.Description;
    this.objSpecialization.IsActive = _values.IsActive;
    this.objSpecialization.CreatedBy = this.currentUserValue.createdby;
    this.objSpecialization.OrganizationId = this.currentUserValue.organizationid;
    
    this.objSpecialization.FlagId = _values.FlagId;
    if(_values.FlagId==2){
      this.objSpecialization.SpecializationId=_values.SpecializationId;
    }
    else if(_values.FlagId==1){
      this.objSpecialization.SpecializationId=0;
    }
    this.objSpecialization.SpecializationId=_values.SpecializationId;
  
    return this.http.post(this.rootUrl + "/SourceAPI/NewSpecializationInsertUpdate", this.objSpecialization);
}

UpDatedialog_Status(objStatus) {
  // this.ObjracksDto.WareHouseId = objStatus.WareHouseId;
  this.objSpecialization.SpecializationId = objStatus.SpecializationId
  this.objSpecialization.OrganizationId = this.currentUserValue.organizationid;
  // this.objDesignation.IsActive = objStatus.IsActive;
  this.objSpecialization.CreatedBy = this.currentUserValue.createdby;
  this.http.post(this.rootUrl + "/SourceAPI/NewSpecializationStatus", this.objSpecialization)
    .subscribe(
      (data) => {
        this.objSpecialization_List = data as SpecializationDTO[];
      });
}
checkSpecializationName(checkSpc:string){
  
  this.objSpecialization.OrganizationId = this.currentUserValue.organizationid;
  this.objSpecialization.Specialization=checkSpc;
  
  return this.http.post(this.rootUrl + "/SourceAPI/NewCheckSpecializationName" , this.objSpecialization)
}
}
