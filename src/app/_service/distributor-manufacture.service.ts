import { Injectable } from '@angular/core';
import { DistributorManufactureDTO } from '../_models/distributor-manufacture-dto';
import { UserDTO } from '../_models/user-dto';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { DocumentTypeDTO } from '../_models/document-type-dto.model';
import { FormGroup } from '@angular/forms';
import { Specializationdto } from '../_models/specializationdto';

@Injectable({
  providedIn: 'root'
})
export class DistributorManufactureService {

  List_DMs: DistributorManufactureDTO[];
  Obj_DMs: DistributorManufactureDTO;
  formData: DistributorManufactureDTO;

  ListCity: DistributorManufactureDTO[];
  ListCountry: DistributorManufactureDTO[];

  ObjSpecialization_Dto: Specializationdto
  ObjSpecializationNames_List: Specializationdto[];

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _obj: InboxDTO;
  _XmlToJson: XmlToJson;

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();
    this.Obj_DMs = new DistributorManufactureDTO;
    this.ObjSpecialization_Dto = new Specializationdto;
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  getDMs() {
    this.Obj_DMs.OrganizationId = this.currentUserValue.organizationid;
    this.Obj_DMs.RoleId = this.currentUserValue.RoleId;
    this.Obj_DMs.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/SourceAPI/NewGetDMs", this.Obj_DMs)
  }

  GetDMById(formData: DistributorManufactureDTO) {

    this.Obj_DMs.DMId = formData.DMId;
    return this.http.post(this.rootUrl + "/SourceAPI/NewGetDMById", this.Obj_DMs)
  }
  getSpecilizationNamesFor_DMS() {
    this.ObjSpecialization_Dto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjSpecialization_Dto.RoleId = this.currentUserValue.RoleId;
    this.ObjSpecialization_Dto.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/SourceAPI/NewGetSpecialitions", this.ObjSpecialization_Dto)
      .subscribe(
        data => {
          this.ObjSpecializationNames_List = data as Specializationdto[];
        })
  }

   ///Get All Users based on OrganizationId
   GetUserList(_values:DistributorManufactureDTO){
    this.ObjSpecialization_Dto.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + '/SourceAPI/NewGetOrganizationUsers', this.ObjSpecialization_Dto)
  }
  Insertupdate_DMs(formData) {

    this.Obj_DMs.TypeValue = formData.TypeValue;
    this.Obj_DMs.Name = formData.Name;
    this.Obj_DMs.AccessUsers = formData.AccessUsers;
    this.Obj_DMs.IsConfidential=formData.IsConfidential;
    this.Obj_DMs.ContactUser = formData.ContactUser;
    this.Obj_DMs.specialIdsxml = formData.specialIdsxml;
    this.Obj_DMs.Address = formData.Address;
    this.Obj_DMs.CountryId = formData.CountryId;
    this.Obj_DMs.CityId = formData.CityId;
    this.Obj_DMs.Email = formData.Email;
    this.Obj_DMs.Phone = formData.Phone;
    this.Obj_DMs.CountryCode = formData.CountryCode;
    if (this.Obj_DMs.Phone == null) {
      this.Obj_DMs.Phone = "";
    }
    this.Obj_DMs.Fax = formData.Fax;
    if (this.Obj_DMs.Fax == null) {
      this.Obj_DMs.Fax = "";
    }
    this.Obj_DMs.Description = formData.Description;
    if (this.Obj_DMs.Description == null) {
      this.Obj_DMs.Description = "";
    }
    if (this._obj.IsActive == null) {
      this._obj.IsActive = true;
    }
    this.Obj_DMs.CreatedBy = this.currentUserValue.createdby;
    this.Obj_DMs.OrganizationId = this.currentUserValue.organizationid;
    this.Obj_DMs.CountryCode = formData.CountryCode;
    this.Obj_DMs.FlagId = formData.FlagId;
    if (formData.FlagId == 2) {
      this.Obj_DMs.DMId = formData.DMId;
    }
    else if (formData.FlagId == 1) {
      this.Obj_DMs.DMId = 0;
    }
    this.Obj_DMs.DMId = formData.DMId;
    return this.http.post(this.rootUrl + "/SourceAPI/NewDMInsertUpdate", this.Obj_DMs)
  }

  GetCities(_values: DistributorManufactureDTO) {
    this.Obj_DMs.CountryId = _values.CountryId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this.Obj_DMs)
  }

  GetCountries() {
    return this.http.get<any>(this.rootUrl + "/OrganizationAPI/GetCountries")
  }

  UpDate_Status(objStatus) {
    this.Obj_DMs.DMId = objStatus.DMId;
    this.Obj_DMs.OrganizationId = this.currentUserValue.organizationid;
    this.Obj_DMs.IsActive = objStatus.IsActive;
    this.Obj_DMs.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/SourceAPI/NewDMStatus", this.Obj_DMs)
      .subscribe(
        (data) => {
          this.List_DMs = data as DistributorManufactureDTO[];
        });
  }
}
