import { Injectable } from '@angular/core';
import { DashboardDto } from '../_models/dashboard-dto';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { UserDTO } from '../_models/user-dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _name: string;
  _obj: DashboardDto;
  _: DashboardDto[];

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this._obj = new DashboardDto();
  }
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;
  public get currentUserValue(): UserDTO {
    //alert('000');
    return this.currentUserSubject.value[0];
  }
  //api/DashboardAPI/NewUsersDashboard UserId
  async DashboardCount(createdby: number): Promise<any> {
    try {
      this._obj.UserId = createdby;

      // Call the API and wait for response
      const response = await firstValueFrom(
        this.http.post(`${this.rootUrl}/DashboardAPI/NewUsersDashboard`, this._obj)
      );

      return response; // Return the API result
    } catch (error) {
      console.error("Error fetching dashboard count", error);
      throw error;
    }
  }
  // DashboardCount() {
  //   this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
  //   this.currentUser = this.currentUserSubject.asObservable();
  //   // this._obj.UserId = this.currentUserValue.createdby;
  //   this.currentUser.subscribe(data=>{
  //     if(data[0].createdby != null){
  //       this._obj.UserId=data[0].createdby;
  //     }
  //  })
  //   //Using Stored Procedure
  //   //uspGetAngularDashBoardCounts
  //   //Using Parameters
  //   //obj.UserId
  //   return this.http.post(this.rootUrl + "/DashboardAPI/NewUsersDashboard", this._obj);
  // }

  // NewDashboardAPI(){
  //   this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
  //   this.currentUser = this.currentUserSubject.asObservable();
  //   // this._obj.UserId = this.currentUserValue.createdby;
  //   this.currentUser.subscribe(data=>{
  //     if(data[0].createdby != null){
  //       this._obj.UserId=data[0].createdby;
  //     }
  //  });
  //   return this.http.post(this.rootUrlII + "ArchiveAPI/NewDashboard", this._obj);
  // }

  async NewDashboardAPI(createdby: number): Promise<any> {
    try {
      this._obj.UserId = createdby;

      // Call the API and wait for response
      const response = await firstValueFrom(
        this.http.post(`${this.rootUrlII}ArchiveAPI/NewDashboard`, this._obj)
      );

      return response; // Return the API result
    } catch (error) {
      console.error("Error fetching dashboard count", error);
      throw error;
    }
  }


}
