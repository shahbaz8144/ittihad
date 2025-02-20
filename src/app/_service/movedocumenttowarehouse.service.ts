import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';
import { MovedocumentwarehouseDTO } from '../_models/movedocumentwarehouse-dto';
@Injectable({
  providedIn: 'root'
})
export class MovedocumenttowarehouseService {
  Objshelvescapacity: MovedocumentwarehouseDTO
  _obj: MovedocumentwarehouseDTO
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.Objshelvescapacity = new MovedocumentwarehouseDTO();
    this._obj = new MovedocumentwarehouseDTO();
   }
   readonly rootUrl = this.commonUrl.apiurl;
   public get currentUserValue(): UserDTO {
     return this.currentUserSubject.value[0];
   }
   GetwarehouseData() {

     this.Objshelvescapacity.organizationid = this.currentUserValue.organizationid;
     this.Objshelvescapacity.RoleId = this.currentUserValue.RoleId;
     this.Objshelvescapacity.CreatedBy = this.currentUserValue.createdby;
     return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.Objshelvescapacity);
 
   }
   GetWarehouseBlockRackShelveJson() {

    this.Objshelvescapacity.organizationid = this.currentUserValue.organizationid;
    this.Objshelvescapacity.RoleId = this.currentUserValue.RoleId;
    this.Objshelvescapacity.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetWarehouseBlockRacksShelveJson", this.Objshelvescapacity);

  }
   GetBlocks(_values: MovedocumentwarehouseDTO) {
    
     this._obj.WareHouseId = _values.WareHouseId;
     return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks', this._obj);
   }
   GetRacks(_values: MovedocumentwarehouseDTO) {
   
     this._obj.BlockId = _values.BlockId;
     return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetracks', this._obj);
   }
   Getshelves(_value:MovedocumentwarehouseDTO){
    this._obj.RackId=_value.RackId
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetShelves', this._obj);
  }
  Getshelvesdata(_value:MovedocumentwarehouseDTO){

    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetPhysicalDocumentList', this._obj);
  }
  
  DocumentMoveToWarehouse(_value:MovedocumentwarehouseDTO){
    this._obj.DocumentIds=_value.DocumentIds
    this._obj.ShelveId=_value.ShelveId;
    this._obj.CreatedBy=this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewMoveDocumentToWareHouseAng', this._obj);
  }
}
