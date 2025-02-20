import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { UserDTO } from '../_models/user-dto';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  _obj: UserDTO;
  Day: string;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this._obj=new UserDTO();
   }
   //fetch API Url from APIUrl Service
   readonly rootUrl = this.commonUrl.apiurl;
   
   LoadUserDetails(_values:UserDTO){
    this._obj.LoginUserId = _values.createdby; //this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewUserDetailsJson', this._obj);
  }

  UserPolicyList(_values:UserDTO){
    this._obj.LoginUserId = _values.LoginUserId; //this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewUserAgreementList', this._obj);
  }
  WorkTime(_values:UserDTO){
    this._obj.UserId = _values.UserId;
    this._obj.Day =_values.Day;
    return this.http.post(this.rootUrl + '/UsersAPI/NewAddUserWeekday', this._obj);
  }
  SignatureFileUpload(data){
    
    return this.http.post(this.rootUrl + 'UsersAPI/NewAddUserSignature',data);
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  ProfileUpload(data){
    return this.http.post(this.rootUrl + 'UsersAPI/NewAddUserProfile',data);
  }
  errorMgmt1(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  UpDatedialog_Status(objStatus) {
   
    // this.ObjblocksDto.WareHouseId = objStatus.WareHouseId;
    // this.ObjblocksDto.BlockId = objStatus.BlockId
    // this.ObjblocksDto.organizationid = this.currentUserValue.organizationid;
    // this.ObjblocksDto.IsActive = objStatus.IsActive;
    // this.ObjblocksDto.CreatedBy = this.currentUserValue.createdby;
    // this.http.post(this.rootUrl + "WarehouseAPI/NewBlockStatus", this.ObjblocksDto)
    //   .subscribe(
    //     (data) => {       
    //       this.objblocks_List = data as BlocksDTO[];
    //     });
  }
}
