import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DocumentTypeDTO } from "../_models/document-type-dto.model";
import { ApiurlService } from './apiurl.service';

import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserDTO } from '../_models/user-dto';
import { Observable } from 'rxjs/internal/Observable';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { MatTableDataSource } from '@angular/material/table';
//import { DocumentviewComponent } from '../_ComponentMaster/documentview/documentview.component';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  DocTypeList: DocumentTypeDTO[];
  formData: DocumentTypeDTO;
  // Update_Status_Bool: boolean;

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  _obj: InboxDTO;
  _XmlToJson: XmlToJson;
  objDocTypeDTO: DocumentTypeDTO;
  constructor(private http: HttpClient, private commonUrl: ApiurlService

  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();
    this.objDocTypeDTO = new DocumentTypeDTO;
  }
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  sendDocTypedata(_values: DocumentTypeDTO) {
    //debugger
    this.objDocTypeDTO.DocumentTypeName = _values.DocumentTypeName;
    if (this.objDocTypeDTO.Description == null) {
      this.objDocTypeDTO.Description = "";
    }
    this.objDocTypeDTO.DocumentTypeName = _values.DocumentTypeName;
    this.objDocTypeDTO.Description = _values.Description;
    this.objDocTypeDTO.IsActive = _values.IsActive;
    this.objDocTypeDTO.CreatedBy = this.currentUserValue.createdby;
    this.objDocTypeDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objDocTypeDTO.FlagId = _values.FlagId;
    if (_values.FlagId == 2) {
      this.objDocTypeDTO.DocumentTypeId = _values.DocumentTypeId;
    }
    else if (_values.FlagId == 1) {
      this.objDocTypeDTO.DocumentTypeId = 0
    }
    this.objDocTypeDTO.DocumentTypeId = _values.DocumentTypeId;
    return this.http.post(this.rootUrl + "/DocumentTypeAPI/NewDocumentTypeInsertUpdate", this.objDocTypeDTO)
  }
  getDocTypeData() {

    this.objDocTypeDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objDocTypeDTO.RoleId = this.currentUserValue.RoleId;
    this.objDocTypeDTO.CreatedBy = this.currentUserValue.createdby;

    this.http.post(this.rootUrl + "/DocumentTypeAPI/NewGetDocumentType", this.objDocTypeDTO)
      .subscribe(
        (data) => {
          this.DocTypeList = data as DocumentTypeDTO[];
        });

  }

  //Method 2 for GetDocType List 
  getDocTypeData_2() {
    //debugger
    this.objDocTypeDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objDocTypeDTO.RoleId = this.currentUserValue.RoleId;
    this.objDocTypeDTO.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DocumentTypeAPI/NewGetDocumentType", this.objDocTypeDTO);

  }

  UpDate_Status(objStatus) {
    this.objDocTypeDTO.DocumentTypeId = objStatus.DocumentTypeId;
    this.objDocTypeDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objDocTypeDTO.IsActive = objStatus.IsActive;
    this.objDocTypeDTO.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/DocumentTypeAPI/NewDocumentTypeStatus", this.objDocTypeDTO)
      .subscribe(
        (data) => {
          this.DocTypeList = data as DocumentTypeDTO[];
        });
  }
}
