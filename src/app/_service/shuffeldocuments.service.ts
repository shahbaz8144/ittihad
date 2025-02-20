import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShuffeldocumentsDto } from '../_models/shuffeldocuments.dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class ShuffeldocumentsService {
  ObjshelvesDto: ShuffeldocumentsDto
  objjson: ShuffeldocumentsDto[]
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _obj: ShuffeldocumentsDto

  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.ObjshelvesDto = new ShuffeldocumentsDto;
    this._obj = new ShuffeldocumentsDto();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  GetwarehouseData() {
    this.ObjshelvesDto.organizationid = this.currentUserValue.organizationid;
    this.ObjshelvesDto.RoleId = this.currentUserValue.RoleId;
    this.ObjshelvesDto.CreatedBy = this.currentUserValue.createdby;

    // this.ObjblocksDto.WareHouseId=this.currentUserValue.WareHouseId
    // this.ObjblocksDto.WareHouseName=this.currentUserValue.WareHouseName
    return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.ObjshelvesDto);
  }
  GetWarehouseBlockRackShelveJson() {

    this.ObjshelvesDto.organizationid = this.currentUserValue.organizationid;
    this.ObjshelvesDto.RoleId = this.currentUserValue.RoleId;
    this.ObjshelvesDto.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/WarehouseAPI/NewGetWarehouseBlockRacksShelveJson", this.ObjshelvesDto);

  }
  GetBlocks(_values: ShuffeldocumentsDto) {
    this._obj.WareHouseId = _values.WareHouseId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks', this._obj);
  }
  GetRacks(_values: ShuffeldocumentsDto) {
    this._obj.BlockId = _values.BlockId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetracks', this._obj);
  }
  Getshelves(_value:ShuffeldocumentsDto){
this._obj.RackId= _value.RackId
return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetShelves', this._obj);
  }

  Getlist(_value:ShuffeldocumentsDto){
    this._obj.ShelveId=_value.ShelveId
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetShelvesDocumentsJsonAng', this._obj);
  }
  GetmoveDocuments(_value:ShuffeldocumentsDto){
    this._obj.ShelveId=_value.ShelveId
    this._obj.DocumentIds=_value.DocumentIds
    this._obj.CreatedBy = this.currentUserValue.createdby;

    return this.http.post(this.rootUrl + '/WarehouseAPI/NewDocumentShuffleAng', this._obj);
  }
}
