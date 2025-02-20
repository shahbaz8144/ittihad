import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { SurceDto } from "../_models/surce-dto";
import { ApiurlService } from './apiurl.service';

import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserDTO } from '../_models/user-dto';
import { Observable } from 'rxjs/internal/Observable';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  ObjSourceList: SurceDto[];
  //formData: SurceDto;
  ListCountry: SurceDto[];
  ListCity:SurceDto[];

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  _obj: InboxDTO;
  _XmlToJson: XmlToJson;
  ObjSourceDto:SurceDto;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();
    this.ObjSourceDto = new SurceDto;
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  InsertSourceData(formData:SurceDto) {
    debugger
    this.ObjSourceDto.SourceName=formData.SourceName;
    this.ObjSourceDto.Description=formData.Description;
    this.ObjSourceDto.ContactUser=formData.ContactUser;
    this.ObjSourceDto.Address=formData.Address;
    this.ObjSourceDto.CountryId=formData.CountryId;
    this.ObjSourceDto.CityId=formData.CityId;
    this.ObjSourceDto.Email=formData.Email;
    this.ObjSourceDto.Fax=formData.Fax;
    this.ObjSourceDto.Phone=formData.Phone;
    this.ObjSourceDto.IsActive=formData.IsActive
    this.ObjSourceDto.CreatedBy = this.currentUserValue.createdby;
    this.ObjSourceDto.OrganizationId = this.currentUserValue.organizationid;
    this,this.ObjSourceDto.FlagId=formData.FlagId;

    return this.http.post(this.rootUrl + "/SourceAPI/NewSourceInsertUpdate", this.ObjSourceDto)
    .subscribe(data => {
      this.ObjSourceDto = data as SurceDto;
    });
  }

  GetSourceData() {
    // debugger
    
    this.ObjSourceDto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjSourceDto.RoleId = this.currentUserValue.RoleId;
    this.ObjSourceDto.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/SourceAPI/NewGetSource", this.ObjSourceDto)
      .subscribe(
        (data) => {
          this.ObjSourceList = data as SurceDto[];
        })
  }
  GetCountries() {
    this.http.get<any>(this.rootUrl + "/OrganizationAPI/GetCountries").
      subscribe(res => this.ListCountry = res as SurceDto[])
    //console.log("Countries:" + this.ListCountry);
  }
  GetCities(ObjCountryId: number) {
    debugger
    this.ObjSourceDto.CountryId = ObjCountryId;
    const objPromise = this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this.ObjSourceDto)
    .subscribe(res=>this.ListCity=res as SurceDto[])
    //console.log("Cities:"+this.ListCity);

  }
}
