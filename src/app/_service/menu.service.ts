import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { Router } from '@angular/router';
import { MenuDTO } from '../_models/menu-dto';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _obj: MenuDTO;
  constructor(
    private http: HttpClient, private commonUrl: ApiurlService, private _ngZone: NgZone,
    private router: Router
  ) { 
    
    this._obj = new MenuDTO();
  }
  
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;

  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  UserMenus() {
     
    this._obj.RoleId =this.currentUserValue.RoleId;
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid; 
    return this.http.post(this.rootUrl + '/MenusAPI/NewGetMenusByRoleIdSPA', this._obj);
  }
}
