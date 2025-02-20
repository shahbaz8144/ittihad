import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { ApiurlService } from './apiurl.service';
@Injectable({
  providedIn: 'root'
})
export class InboxfilterService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  _obj: InboxDTO;


  constructor(private http: HttpClient,private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
  }
  inboxFilters(_CreatedBy: number) {
    this._obj.CreatedBy = _CreatedBy;
    // LatestCommunicationAPI/NewGetInboxFilters
    return this.http.post(this.rootUrlII + 'CommunicationAPI/GetInboxFilters',this._obj);
  }
}
