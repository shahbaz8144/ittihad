import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { Outsourcedto } from '../_models/outsourcedto';

@Injectable({
  providedIn: 'root'
})
export class OutsourceService {
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _extobj: Outsourcedto;
  _obj:UserDTO;
  
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj=new UserDTO();
    this._extobj=new Outsourcedto();
   }
   //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;

  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  EP_ProjectList(_empcode:string){
    this._extobj.EmployeeCode=_empcode;
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/ApplicationLinkAPI/NewGetLinkedProjectsByEmployeeCode", this._extobj);
  }

  EP_ProjectMemoList(_projectcode:string){
    
    this._extobj.Project_Code=_projectcode;
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/ApplicationLinkAPI/NewGetOnlyMemoIdsByProjectCode", this._extobj);
  }

  MemosByProjectCode(_values: Outsourcedto) {
    
    this._extobj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._extobj.JsonData=_values.JsonData;
    
    return this.http.post(this.rootUrl + '/LatestCommunicationAPI/NewGetMemosByProjectCode', this._extobj);
  }
  
  async ProjectListByMemoId(_mailid:number) {
    //this._extobj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._extobj.MailId=_mailid;
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/ApplicationLinkAPI/NewGetProjectDetailsByMemoId", this._extobj);
  }

  ProjectDetailsByProjectCode(Project_Code:string) {
    //this._extobj.UserId = _values.UserId; //this.currentUserValue.createdby;
    this._extobj.Project_Code=Project_Code;
    
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/TestAPI/NewSubTaskDetails", this._extobj);
  }
  EpMeetings(_values: Outsourcedto) {
    
    this._extobj.Emp_No = _values.Emp_No; //this.currentUserValue.createdby;
    this._extobj.sorttype=_values.sorttype;
    this._extobj.startdate = _values.startdate;
    this._extobj.enddate = _values.enddate;
    
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/ApplicationLinkAPI/NewGetMeetingsForDMS", this._extobj);
  }

  MemoDeatilsEpMeetings(_values: Outsourcedto) {
    this._extobj.mailid = _values.mailid; 
    this._extobj.sorttype=_values.sorttype;
    this._extobj.startdate = _values.startdate;
    this._extobj.enddate  = _values.enddate;
    this._extobj.Emp_No = _values.Emp_No;
    
    return this.http.post("https://cswebapps.com/PortfolioAPI/api/ApplicationLinkAPI/NewGetSMailMeetings", this._extobj);
  }
}
