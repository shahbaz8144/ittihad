import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharedwithmeDTO } from '../_models/sharedwithme-dto';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class SharedwithmeServicesService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  private _values: any;
  _obj: SharedwithmeDTO;
  objShared_list: SharedwithmeDTO[];

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new SharedwithmeDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetSharedwithMeDocumentsList() {
    this._obj.ToUserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + 'DocumentsAPI/NewGetSharedwithMeDocumentsListAng', this._obj);
  }
  GACDocumentDetails(_values:SharedwithmeDTO ) {
    this._obj.DocumentId=_values.DocumentId;
    this._obj.ReferenceId=_values.ReferenceId;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentFullDetailsAng", this._obj);
  }
}
