import { Injectable } from '@angular/core';
import { UserDTO } from '../_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { map } from 'rxjs/operators';
import Localbase from 'localbase'
import { AuthenticationDTO } from '../_models/authentication-dto';
let users_db = new Localbase('pwa-database_users')

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _name: string;
  redirectUrl: string;
  public storegename = "LoginUsers";
  _userobj: AuthenticationDTO;
  _userdto: UserDTO;
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  constructor(private http: HttpClient, private commonUrl: ApiurlService
    //,private dbService: NgxIndexedDBService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._userdto = new UserDTO();
    this._userobj = new AuthenticationDTO();
  }

  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value;
  }
  async getSasUrl(filePath: string, expiryTime: Date): Promise<string> {
     
    const expiryTimeString = expiryTime.toISOString(); // Convert to UTC string
    const response = await this.http.get<{ sasUrl: string }>(
      `${this.rootUrlII}FileUploadAPI/NewGenerateSASTokenUrl?filePath=${encodeURIComponent(filePath)}&expiryTime=${expiryTimeString}`
    ).toPromise();

    return response.sasUrl;
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match parameter name in the C# controller

    const req = new HttpRequest('POST', this.rootUrlII + "FileUploadAPI/upload", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  //Login Service
  login(username: string, password: string) {
    this._userobj.userId = username;
    this._userobj.OldPassWord = password;

    return this.http.post<any>(this.rootUrlII + "Login/StreamLoginAPI", this._userobj, {
      withCredentials:true
    })
      .pipe(map(user => {
        var _json = JSON.parse(user["Data"]["UserId"]);
        const token = user.token;
        console.log("Json Value" , _json);
        let _obj1 = _json;
        if (user["Data"]["UserId"].length != 0) {
          users_db.collection('users').add({
            username: _obj1[0].userId,
            userid: _obj1[0].createdby
          })
          _obj1[0]["SharePopupCount"] = 0;
          // login successful
          if (_obj1 && _obj1[0].userId) {
            localStorage.setItem('currentUser', JSON.stringify(_obj1));
            this.currentUserSubject.next(_obj1);
          }
        }
        return user;
      }));
  }
  //Logout Service
  logout() {
    this._userdto = new UserDTO();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this._userdto);
  }
  UpdatePassword(_userdto: UserDTO) {
    return this.http.post(this.rootUrl + '/AuthenticationAPI/NewUpdatePasswordANG', _userdto);
  }

  UpdateTourCount(dto: UserDTO) {
    this._userdto.createdby = dto.createdby;
    this._userdto.TourId = dto.TourId;
    // '/AuthenticationAPI/NewTourUpdateCount'
    return this.http.post(this.rootUrl + '/AuthenticationAPI/NewTourUpdateCount', this._userdto);
  }

   GetEmailAPI(_userobj:UserDTO){
    this._userdto.UserName = _userobj.UserName;
    return this.http.post(this.rootUrlII + "Login/GetUserEmail", _userobj);
  }

  sendResetPasswordEmail(_userobj:AuthenticationDTO): Observable<any> {
    this._userobj.UserEmailId = _userobj.UserEmailId;
    this._userobj.UserName = _userobj.UserName;
     this._userobj.ResetLink = _userobj.ResetLink;;
    return this.http.post(this.rootUrlII + "Login/send-reset-email",_userobj );
  }

  ResetPasswordLinkAPI(_userobj:AuthenticationDTO): Observable<any> {
    this._userobj.UserId  = _userobj.UserId;
    this._userobj.Link  = _userobj.Link ;
    return this.http.post(this.rootUrlII + "Login/ResetPasswordLink",_userobj );
  }


   ResetPasswordAPI(_userobj:AuthenticationDTO): Observable<any> {
    this._userobj.NewPassword   = _userobj.NewPassword ;
    this._userobj.UserId   = _userobj.UserId  ;
     this._userobj.LinkId   = _userobj.LinkId  ;
    return this.http.post(this.rootUrlII + "Login/ResetPassword",_userobj );
  }
}