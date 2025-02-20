import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiurlService } from './apiurl.service';
import { InboxDTO } from '../_models/inboxdto';

@Injectable({
  providedIn: 'root'
})
export class BackgroundNewMailsService {
  _obj: InboxDTO;
  private apiUrl = 'https://api.example.com/data'; // Replace with your API endpoint

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this._obj = new InboxDTO();
   }
  readonly rootUrl = this.commonUrl.apiurl;
  fetchData(_values: InboxDTO): Observable<any> {
    debugger
    this._obj.OrganizationId = _values.OrganizationId;
    this._obj.UserId =_values.UserId;
    return this.http.post(this.rootUrl + "/LatestCommunicationAPI/NewMemosLoadInstant", this._obj)
  }
}
