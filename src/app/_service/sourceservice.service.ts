import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiurlService } from './apiurl.service';
import { UserDTO } from '../_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { SourceDTO } from '../_models/source-dto';

@Injectable({
  providedIn: 'root'
})
export class SourceserviceService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: SourceDTO;
  ObjSource_List: SourceDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj=new SourceDTO();
    }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetSourceList(_values:SourceDTO) {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;

    return this.http.post(this.rootUrl + "/SourceAPI/NewGetSource", this._obj)
  }

  GetCountries() {
    return this.http.get<any>(this.rootUrl + "/OrganizationAPI/GetCountries")
  }
  ///Get All Users based on OrganizationId
  GetUserList(_values:SourceDTO){
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + '/SourceAPI/NewGetOrganizationUsers', this._obj)
  }

  GetCities(_values:SourceDTO) {
    this._obj.CountryId = _values.CountryId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this._obj);
  }
  InsertUpdateSource(_values:SourceDTO) {
     
    this._obj.SourceName = _values.SourceName
    if (this._obj.Description == null) {
      this._obj.Description = "";
    }
    this._obj.SourceName=_values.SourceName;
    this._obj.Description=_values.Description;
    this._obj.ContactUser=_values.ContactUser;
    if (this._obj.ContactUser == null) {
      this._obj.ContactUser = "";
    }
    this._obj.Address=_values.Address;
    this._obj.CountryId=_values.CountryId;
    this._obj.CityId=_values.CityId;
    this._obj.Email=_values.Email;
    this._obj.Fax=_values.Fax;
    if (this._obj.Fax == null) {
      this._obj.Fax = "";
    }
    this._obj.Phone=_values.Phone;
    this._obj.CountryCode=_values.CountryCode;
    if (this._obj.Phone == null) {
      this._obj.Phone = "";
    }
   
    this._obj.IsActive=_values.IsActive;
    this._obj.IsArchiving = _values.IsArchiving;
    this._obj.IsCommunication = _values.IsCommunication;
    this._obj.AccessUsers = _values.AccessUsers;
    this._obj.IsConfidential=_values.IsConfidential;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this,this._obj.FlagId=_values.FlagId;
    if (_values.FlagId == 2) {
      this._obj.SourceId = _values.SourceId
    }
    else if (_values.FlagId == 1) {
      this._obj.SourceId = 0
    }
    this._obj.SourceId = _values.SourceId;
     
    return this.http.post(this.rootUrl + "/SourceAPI/NewSourceInsertUpdate", this._obj)
  }

  updatesourcestatus(objStatus) {
    this._obj.SourceId = objStatus.SourceId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/SourceAPI/NewSourceStatus", this._obj)
    .subscribe(
      (data) => {
        this.ObjSource_List = data as SourceDTO[];
      });
  }
}

