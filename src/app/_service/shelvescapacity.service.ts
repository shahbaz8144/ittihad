import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';
import { ShelvescapacityDTO } from '../_models/shelvescapacity-dto';
@Injectable({
  providedIn: 'root'
})
export class ShelvescapacityService {
  Objshelvescapacity: ShelvescapacityDTO
  _obj: ShelvescapacityDTO
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;


  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.Objshelvescapacity = new ShelvescapacityDTO();
    this._obj = new ShelvescapacityDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetwarehouseData() {
    this.Objshelvescapacity.organizationid = this.currentUserValue.organizationid;
    this.Objshelvescapacity.RoleId = this.currentUserValue.RoleId;
    this.Objshelvescapacity.createdby = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.Objshelvescapacity)

  }
  GetWarehouseBlockRackShelveJson() {

    this.Objshelvescapacity.organizationid = this.currentUserValue.organizationid;
    this.Objshelvescapacity.RoleId = this.currentUserValue.RoleId;
    this.Objshelvescapacity.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetWarehouseBlockRacksShelveJson", this.Objshelvescapacity);

  }
  GetBlocks(_values: ShelvescapacityDTO) {
   
    this._obj.WareHouseId = _values.WareHouseId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks', this._obj);
  }
  GetRacks(_values: ShelvescapacityDTO) {
  debugger
    this._obj.BlockId = _values.BlockId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetracks', this._obj);
  }


  Getshelves(_value:ShelvescapacityDTO){
  
    this._obj.RackId=_value.RackId
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetShelves', this._obj);
  }


  updateracks(_values: ShelvescapacityDTO) {
 
    this._obj.ShelveId = _values.ShelveId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewUpdateShelvesCapacityANG', this._obj);
  }
}
