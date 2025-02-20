import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShelvesDTO } from '../_models/shelves-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class ShelvesService {
  ObjshelvesDto: ShelvesDTO
  Objwarehousedrp: ShelvesDTO[]
  objjson: ShelvesDTO[]
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _obj: ShelvesDTO



  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.ObjshelvesDto = new ShelvesDTO;
    this._obj = new ShelvesDTO();
    // this.onjsondata();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetwarehouseData() {
    this.ObjshelvesDto.organizationid = this.currentUserValue.organizationid;
    this.ObjshelvesDto.RoleId = this.currentUserValue.RoleId;
    this.ObjshelvesDto.createdby = this.currentUserValue.createdby;

    // this.ObjblocksDto.WareHouseId=this.currentUserValue.WareHouseId
    // this.ObjblocksDto.WareHouseName=this.currentUserValue.WareHouseName
    this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.ObjshelvesDto)
      .subscribe(
        (data) => {
          this.Objwarehousedrp = data as [];
          console.log(this.Objwarehousedrp)
        });
  }
  GetBlocks(_values: ShelvesDTO) {
    this._obj.WareHouseId = _values.WareHouseId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks', this._obj);
  }
  GetRacks(_values: ShelvesDTO) {
    this._obj.BlockId = _values.BlockId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetracks', this._obj);
  }
  onjsondata(_values: ShelvesDTO) {
    this._obj.ShelvesJson = _values.ShelvesJson
  
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewAddShelvesSPA', _values)
    // console.log(this._obj)

    // return  this.http.post(this.rootUrl + "WarehouseAPI/NewAddShelvesSPA",).subscribe((res) => {
    // this.rom = res
    // console.log(this.rom)
    //   this.objjson=res as []
    //   console.log(this.objjson)
    // })


    // .subscribe(
    //   (data) => {
    //     this.objjson = data as [];
    //    console.log(this.objjson)
    //   });
  }
}
