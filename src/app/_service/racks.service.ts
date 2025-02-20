import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { __values } from 'tslib';

import { UserDTO } from '../_models/user-dto';
import { RacksDTO } from '../_models/racks-dto';
import { ApiurlService } from './apiurl.service';
@Injectable({
  providedIn: 'root'
})
export class RacksService {
  ObjracksList: RacksDTO[];
  ObjBlocksdrp:RacksDTO[]
  ObjracksDto: RacksDTO;
  _obj: RacksDTO;
 
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  objracks_List: RacksDTO[]

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.ObjracksDto = new RacksDTO;
    this._obj = new RacksDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetwarehouseData() {
    this.ObjracksDto.organizationid = this.currentUserValue.organizationid;
    this.ObjracksDto.RoleId = this.currentUserValue.RoleId;
    this.ObjracksDto.createdby = this.currentUserValue.createdby;

    // this.ObjblocksDto.WareHouseId=this.currentUserValue.WareHouseId
    // this.ObjblocksDto.WareHouseName=this.currentUserValue.WareHouseName
    this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.ObjracksDto)
      .subscribe(
        (data) => {
          this.ObjracksList = data as [];
          // console.log(this.ObjracksList)
          //  alert(this.ObjblocksList.length)
        });
  }
  GetBlocks(_values: RacksDTO) {
    this._obj.WareHouseId = _values.WareHouseId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks', this._obj);
    
  }
  Getblockslist(_values: RacksDTO) {
    this._obj.BlockId = _values.BlockId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetracks', this._obj);
  }
  GetinsertupdateRacks(_values: RacksDTO) {
    debugger
    this.ObjracksDto.RackName = _values.RackName;
    if (_values.Description == null || _values.Description == undefined) {
      _values.Description = "";
    }
 
    this.ObjracksDto.RackName = _values.RackName;
    this.ObjracksDto.Rows = _values.Rows;
    this.ObjracksDto.Columns = _values.Columns;
    this.ObjracksDto.Description = _values.Description;
    this.ObjracksDto.IsActive = _values.IsActive;
    this.ObjracksDto.CreatedBy = this.currentUserValue.createdby;
    this.ObjracksDto.flagid = _values.flagid;
    if (_values.flagid == 2) {
      this.ObjracksDto.RackId = _values.RackId;
    }
    else if (_values.flagid == 1) {
      this.ObjracksDto.RackId = 0

    }
    this.ObjracksDto.BlockId = _values.BlockId;
 
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewRackInsertUpdate', this.ObjracksDto);
  }
  UpDatedialog_Status(objStatus) {
    // this.ObjracksDto.WareHouseId = objStatus.WareHouseId;
    this.ObjracksDto.RackId = objStatus.RackId
    this.ObjracksDto.organizationid = this.currentUserValue.organizationid;
    this.ObjracksDto.IsActive = objStatus.IsActive;
    this.ObjracksDto.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/WarehouseAPI/NewRackStatus", this.ObjracksDto)
      .subscribe(
        (data) => {
          this.objracks_List = data as RacksDTO[];
        });
  }

}
