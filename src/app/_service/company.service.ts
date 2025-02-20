import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyDTO } from '../_models/company-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: CompanyDTO
  objcompany_List: CompanyDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new CompanyDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  getcompanylist(_values: CompanyDTO) {
    this._obj.Search = _values.Search;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.PageSize = _values.PageSize
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;

    return this.http.post(this.rootUrl + "/CompanyAPI/NewGetCompanies", this._obj)
  }
  insertcompanydetails(_values: CompanyDTO) {

    this._obj.CompanyName = _values.CompanyName
    if (_values.Address == null) {
      _values.Address = "";
    }
    this._obj.CompanyName = _values.CompanyName;
    this._obj.Address = _values.Address;
    this._obj.Phone = _values.Phone;
    this._obj.CountryCode = _values.CountryCode;
    if (this._obj.Phone == null) {
      this._obj.Phone = "";
    }

    this._obj.Email = _values.Email;
    this._obj.Fax = _values.Fax;
    if (this._obj.Fax == null) {
      this._obj.Fax = "";
    }
    this._obj.CountryId = _values.CountryId;
    this._obj.CityId = _values.CityId;
    this._obj.IsActive = _values.IsActive;
    this._obj.latitude = _values.latitude;
    this._obj.longitude = _values.longitude;
    this._obj.Code = _values.Code;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.FlagId = _values.FlagId;
    if (_values.FlagId == 2) {
      this._obj.CompanyId = _values.CompanyId
    }
    else if (_values.FlagId == 1) {
      this._obj.CompanyId = 0

    }
    this._obj.CompanyId = _values.CompanyId;
    return this.http.post(this.rootUrl + '/CompanyAPI/NewCompany', this._obj)
  }
  CheckCompanyName(_values: CompanyDTO) {
    this._obj.CompanyName = _values.CompanyName
    this._obj.OrganizationId = this.currentUserValue.organizationid
    return this.http.post(this.rootUrl + "/CompanyAPI/NewCheckCompanyName", this._obj)
  }
  Checkemail(_values: CompanyDTO) {
    this._obj.CompanyEmail = _values.Email
    this._obj.OrganizationId = this.currentUserValue.organizationid
    return this.http.post(this.rootUrl + "/CompanyAPI/NewCheckCompanyEmail", this._obj)
  }
  GetCities(_values: CompanyDTO) {
    this._obj.CountryId = _values.CountryId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this._obj)
  }
  GetCountries() {
    return this.http.get<any>(this.rootUrl + "/OrganizationAPI/GetCountries")
  }
  UpdateCompanyStatus(objStatus) {
    this._obj.CompanyId = objStatus.CompanyId;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/CompanyAPI/NewCompanyStatus", this._obj)
  }
  AddUpdateQuotes(objStatus) {
    debugger
    this._obj.Quotes = objStatus.Quotes;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.FlagId = objStatus.FlagId;
    return this.http.post(this.rootUrl + "/CompanyAPI/NewQuotes", this._obj)
  }
  GetQuotes() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/CompanyAPI/NewGetQuotes", this._obj)
  }
}
