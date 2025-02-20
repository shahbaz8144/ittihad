import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { WarehouseDTO } from '../_models/warehouse-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuDTO } from '../_models/menu-dto';
import { UserDTO } from '../_models/user-dto';
@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  objwareDTO: WarehouseDTO;
  _obj: WarehouseDTO;
  objwarehouse_List:WarehouseDTO[];
  readonly rootUrl = this.commonUrl.apiurl;
  WarehouseDTO: WarehouseDTO;
  private _values: any;
  WarehouseService: WarehouseDTO;
  objware_List: WarehouseDTO[];
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new WarehouseDTO();
    this.objwareDTO=new WarehouseDTO();

  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  callGetapi() {
    return this.http.get(this.rootUrl + '/OrganizationAPI/GetCountries')
  }
  GetCities(_values: WarehouseDTO) {
    this._obj.CountryId = _values.CountryId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this._obj);
  }
  Gettablelist(_values: WarehouseDTO) {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetwarehouse', this._obj);
  }
  insertupdatewarehouse(_values: WarehouseDTO) {

    this.objwareDTO.WareHouseName = _values.WareHouseName;
    if (_values.Description == null ) {
      _values.Description = "";
    }
    this.objwareDTO.WareHouseName = _values.WareHouseName;
    this.objwareDTO.CompanyIds = _values.CompanyIds;
    this.objwareDTO.Description = _values.Description;
    this.objwareDTO.Email = _values.Email;
    this.objwareDTO.Phone = _values.Phone;
    this.objwareDTO.CountryCode=_values.CountryCode;
    if (this.objwareDTO.Phone == null) {
      this.objwareDTO.Phone = 1;
    }
    this.objwareDTO.Address =_values.Address;
    this.objwareDTO.CountryId = _values.CountryId;
    this.objwareDTO.CityId = _values.CityId;
    this.objwareDTO.IsActive = _values.IsActive;
    this.objwareDTO.CreatedBy = this.currentUserValue.createdby;
    this.objwareDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objwareDTO.FlagId = _values.FlagId;
    if(_values.FlagId==2){
      this.objwareDTO.WareHouseId=_values.WareHouseId;
    }
    else if(_values.FlagId==1){
      this.objwareDTO.WareHouseId=0;
    }
    this.objwareDTO.ContactUserName="";
    
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewWarehouseInsertUpdate', this.objwareDTO);
  }
  
  UpDate_Status(objStatus) {
    this.objwareDTO.WareHouseId =objStatus.WareHouseId;
    this.objwareDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objwareDTO.IsActive = objStatus.IsActive;
    this.objwareDTO.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/WarehouseAPI/NewWarehouseStatus", this.objwareDTO)
      .subscribe(
        (data) => {
          this.objwarehouse_List = data as WarehouseDTO[];
        });
  
}
}
