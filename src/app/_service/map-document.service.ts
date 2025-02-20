import { Injectable } from '@angular/core';
import { XmlToJson } from '../_helpers/xml-to-json';
import { InboxDTO } from '../_models/inboxdto';
import { BehaviorSubject, Observable } from 'rxjs';
import { SurceDto } from '../_models/surce-dto';
import { UserDTO } from '../_models/user-dto';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { MapDocumentDTO } from '../_models/map-document-dto';

@Injectable({
  providedIn: 'root'
})
export class MapDocumentService {
  ObjSourceList: SurceDto[];
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  Json_Data: string;
  xml_Data: string;

  _obj: InboxDTO;
  _XmlToJson: XmlToJson;
  ObjSourceDto: SurceDto;

  ObjMapDocument_Dto: MapDocumentDTO;
  MappedDocumentTypesToSource_List: MapDocumentDTO[];

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();
    this.ObjSourceDto = new SurceDto;
    this.ObjMapDocument_Dto = new MapDocumentDTO;
  }

  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetSourceData() {
    this.ObjSourceDto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjSourceDto.RoleId = this.currentUserValue.RoleId;
    this.ObjSourceDto.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/SourceAPI/NewGetSource", this.ObjSourceDto)
      .subscribe(
        (data) => {
          this.ObjSourceList = data as SurceDto[];
        })
  }
  GetMapDocumentTypestoSource(ObjSourceId: number) {
    this.ObjMapDocument_Dto.SourceId = ObjSourceId;
    this.ObjMapDocument_Dto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjMapDocument_Dto.IsActive = true;
    return this.http.post(this.rootUrl + "/SourceAPI/NewGetMappedDocumentTypeJson", this.ObjMapDocument_Dto);
  }
  NewMapDocumentTypestoSource(NewobjMap_Dto: MapDocumentDTO) {
    //Adding element in XML
    NewobjMap_Dto.mapdocumenttypesxml[0]['SourceId'] = this.ObjMapDocument_Dto.SourceId;
    NewobjMap_Dto.mapdocumenttypesxml[0]['CreatedBy'] = this.currentUserValue.createdby;

    this.Json_Data = NewobjMap_Dto.mapdocumenttypesxml;
    // ///-----WorkSpace----------------------
    let JsonLength = Object.keys(this.Json_Data).length;
    let _rows=[];
    for (let index = 0; index < JsonLength; index++) {
      NewobjMap_Dto.mapdocumenttypesxml[index]['SourceId'] = this.ObjMapDocument_Dto.SourceId;
      NewobjMap_Dto.mapdocumenttypesxml[index]['CreatedBy'] = this.currentUserValue.createdby;
        let _json = this.Json_Data[index];
        _rows.push(_json)
    }
    this.ObjMapDocument_Dto.SourceId;
    this.ObjMapDocument_Dto.mapdocumenttypesxml =JSON.stringify(_rows);
    this.ObjMapDocument_Dto.OrganizationId = this.currentUserValue.organizationid;
    this.ObjMapDocument_Dto.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/SourceAPI/NewMapDocumentTypestoSourceJSON", this.ObjMapDocument_Dto);
  }

  UpdateMapDocumentTypestoSource(NewobjMap_Dto: MapDocumentDTO) {
    NewobjMap_Dto.updatedocumenttypesxml[0]['CreatedBy'] = this.currentUserValue.createdby;
    this.Json_Data = NewobjMap_Dto.updatedocumenttypesxml;
    let JsonLength = Object.keys(this.Json_Data).length;
    let _rows=[];
    for (let index = 0; index < JsonLength; index++) {
      NewobjMap_Dto.updatedocumenttypesxml[index]['SourceId'] = this.ObjMapDocument_Dto.SourceId;
      NewobjMap_Dto.updatedocumenttypesxml[index]['CreatedBy'] = this.currentUserValue.createdby;
        let _json = this.Json_Data[index];
        _rows.push(_json)
    }
    this.ObjMapDocument_Dto.updatedocumenttypesxml = JSON.stringify(_rows);
    this.ObjMapDocument_Dto.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/SourceAPI/NewUpdateMapDocumentTypestoSourceJson", this.ObjMapDocument_Dto)
  }
}
