import { Injectable } from '@angular/core';
import { Specializationdto } from '../_models/specializationdto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { DocumentTypeDTO } from '../_models/document-type-dto.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationServiceService {

  objSpecilizationDTO: Specializationdto;
  formData: Specializationdto;

  ObjSpecilization_List: Specializationdto[];

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  _obj: InboxDTO;
  _XmlToJson: XmlToJson;

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();

    this.objSpecilizationDTO = new Specializationdto();
  }

  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  InsertSpecilizationData(formData) {
    debugger
    this.objSpecilizationDTO.Specialization=formData.Specialization;
    this.objSpecilizationDTO.Description=formData.Description;
    this.objSpecilizationDTO.IsActive=formData.IsActive;
    this.objSpecilizationDTO.CreatedBy=this.currentUserValue.createdby;
    this.objSpecilizationDTO.OrganizationId=this.currentUserValue.organizationid;
    this.objSpecilizationDTO.FlagId=formData.FlagId;

    return this.http.post(this.rootUrl + "/SourceAPI/NewSpecializationInsertUpdate", this.objSpecilizationDTO)
      .subscribe(data => {
        this.objSpecilizationDTO = data as Specializationdto;
      });
  }
  getSpecilizations() {
     debugger
    this.objSpecilizationDTO.OrganizationId = this.currentUserValue.organizationid;
    this.objSpecilizationDTO.RoleId = this.currentUserValue.RoleId;
    this.objSpecilizationDTO.CreatedBy = this.currentUserValue.createdby;
    this.http.post(this.rootUrl + "/SourceAPI/NewGetSpecialitions", this.objSpecilizationDTO)
      .subscribe(
        (data) => {
          this.ObjSpecilization_List = data as Specializationdto[];
        })
  }
}
