import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { __values } from 'tslib';
import { BlocksDTO } from '../_models/blocks-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';


@Injectable({
  providedIn: 'root'
})
export class BlocksService {
  ObjblocksList: BlocksDTO[];
  ObjblocksDto: BlocksDTO;
  _obj: BlocksDTO;
  objblocks_List: BlocksDTO[]
  private _values: any;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  f_firstPanel = false;
  S_SecondPanel = true;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    //this.ObjblocksList = BlocksDTO[];
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.ObjblocksDto = new BlocksDTO;
    this._obj = new BlocksDTO();
    this.ObjblocksDto = new BlocksDTO()
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetblocksData() {
    this.ObjblocksDto.organizationid = this.currentUserValue.organizationid;
    this.ObjblocksDto.RoleId = this.currentUserValue.RoleId;
    this.ObjblocksDto.createdby = this.currentUserValue.createdby;
    // this.ObjblocksDto.WareHouseId=this.currentUserValue.WareHouseId
    // this.ObjblocksDto.WareHouseName=this.currentUserValue.WareHouseName
    this.http.post(this.rootUrl + "/WarehouseAPI/NewGetwarehousedrp", this.ObjblocksDto)
      .subscribe(
        (data) => {
          this.ObjblocksList = data as [];
          console.log(this.ObjblocksList)
          //  alert(this.ObjblocksList.length)
        })
      }


  Getrackslist(_values: BlocksDTO) {
    this._obj.WareHouseId = _values.WareHouseId;
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewGetblocks',this._obj);
  }


  Getinsertupdatbolck(_values: BlocksDTO) {
     this.ObjblocksDto.BlockName = _values.BlockName;
    if (_values.Description == null || _values.Description == undefined) {
      _values.Description = "";
    }

    this.ObjblocksDto.BlockName = _values.BlockName;
    this.ObjblocksDto.Description = _values.Description;
    this.ObjblocksDto.IsActive = _values.IsActive;
    this.ObjblocksDto.CreatedBy = this.currentUserValue.createdby;
    // this. ObjblocksDto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjblocksDto.FlagId = _values.FlagId;
    if (_values.FlagId == 2) {
      this.ObjblocksDto.BlockId = _values.BlockId;
    }
    else if (_values.FlagId == 1) {
       this.ObjblocksDto.BlockId =0
      
     }
     this.ObjblocksDto.WareHouseId=_values.WareHouseId;
    // this.ObjblocksDto.BlockId=0;
    // this.ObjblocksDto.FlagId=2;
    
    // console.log("sending Info---->",this.ObjblocksDto)
    return this.http.post(this.rootUrl + '/WarehouseAPI/NewBlockInsertUpdate',this.ObjblocksDto);
  }


  UpDatedialog_Status(objStatus) {
   
    this.ObjblocksDto.WareHouseId = objStatus.WareHouseId;
    this.ObjblocksDto.BlockId = objStatus.BlockId
    this.ObjblocksDto.organizationid = this.currentUserValue.organizationid;
    this.ObjblocksDto.IsActive = objStatus.IsActive;
    this.ObjblocksDto.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/WarehouseAPI/NewBlockStatus", this.ObjblocksDto)
      .subscribe(
        (data) => {       
          this.objblocks_List = data as BlocksDTO[];
        });
  }
}

