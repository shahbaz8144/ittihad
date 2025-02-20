import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharebymeDTO } from '../_models/sharebymeDTO';
import { UserDTO } from '../_models/user-dto';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class SharebymeService {
  _obj:SharebymeDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  private values: any;

  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this._obj=new SharebymeDTO();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetSharebymeList(){
    
    this._obj.FromUserId =this.currentUserValue.createdby; 
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetSharedByMeDocumentsListAng", this._obj);
  }

  GACDocumentDetails(_values:SharebymeDTO ) {
    this._obj.DocumentId=_values.DocumentId;
    this._obj.ReferenceId=_values.ReferenceId;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentFullDetailsAng", this._obj);
  }
}
