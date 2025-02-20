import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { UserRegistrationDTO } from '../_models/user-registration-dto';
import { ApiurlService } from './apiurl.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  CheckEmployeeIdExist(empid: any) {
    throw new Error("Method not implemented.");
  }
  objUserList: UserRegistrationDTO[];
  _obj: UserRegistrationDTO = new UserRegistrationDTO
  objUserRegDTO: UserRegistrationDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  readonly rootUrl = this.commonUrl.apiurl;


  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new UserRegistrationDTO();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetCountriesList() {
    return this.http.get(this.rootUrl + "/OrganizationAPI/GetCountries")

  }
  GetCities(_values: UserRegistrationDTO) {

    this._obj.CountryId = _values.CountryId;
    return this.http.post(this.rootUrl + '/OrganizationAPI/NewGetCities', this._obj);
  }
  CheckUserEmailExist(email: string) {
    return this.http.get(this.rootUrl + "/OrganizationAPI/GetUseremail?useremail=" + email)
  }
  GetCompanyList(_values: UserRegistrationDTO) {
    // this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.OrganizationId =_values.OrganizationId;
    this._obj.CreatedBy =_values.CreatedBy;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewCompanyDepartmentDrpJson", this._obj);
  }
  GetReportingUser(_values: UserRegistrationDTO) {
    this._obj.CompanyId = _values.CompanyId;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetReportingUsers", this._obj);
  }
  CheckUserEmployeeIdExist(text: string) {
    return this.http.get(this.rootUrl + "/OrganizationAPI/GetEmployeeId?employeeid=" + text)
  }
  CheckUserLoginIdExist(text: string) {
    return this.http.get(this.rootUrl + "/OrganizationAPI/GetUsername?username=" + text)
  }
  InsertUpdateUserRegistration(_values: UserRegistrationDTO) {
    
    this._obj.UserName = _values.UserName;

    this._obj.FirstName = _values.FirstName;
    this._obj.MiddleName = _values.MiddleName;
    this._obj.lastName = _values.lastName;
    this._obj.DisplayName = _values.DisplayName
    this._obj.UserEmail = _values.UserEmail;
    this._obj.Telephone1 = _values.Telephone1;
    this._obj.Telephone2 = _values.Telephone2;
    this._obj.UserPhone = _values.UserPhone;
    this._obj.CountryCode = _values.CountryCode;
    if (this._obj.UserPhone == null) {
      this._obj.UserPhone = 1;
    }
    this._obj.UserAddress = _values.UserAddress;
    this._obj.CountryId = _values.CountryId;
    this._obj.CityId = _values.CityId;
    this._obj.UserPincode = _values.UserPincode;
    this._obj.UserIsActive = _values.UserIsActive;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CompanyId = _values.CompanyId;
    this._obj.DepartmentId = _values.DepartmentId;
    this._obj.RoleId = _values.RoleId;
    this._obj.FlagId = _values.FlagId;
    this._obj.UserId = _values.UserId;
    this._obj.ReportingUserId = _values.ReportingUserId;
    this._obj.EmployeeId = _values.EmployeeId;
    this._obj.DesignationId = _values.DesignationId;
    this._obj.PositionId = _values.PositionId;
    this._obj.IsInterCompany = _values.IsInterCompany;
    this._obj.IsGlobalUser = _values.IsGlobalUser;
    this._obj.IsArchiveApproval = _values.IsArchiveApproval;
    this._obj.IsCommunicationDownload = _values.IsCommunicationDownload
    this._obj.CountryCode = _values.CountryCode;
    this._obj.IsArchiveDownload = _values.IsArchiveDownload;
    this._obj.IsStreamDownload = _values.IsStreamDownload
    this._obj.ToUserIdsStr = _values.ToUserIdsStr;
    this._obj.Password = "$2a$10$qnnBp0F2XjReEKiggH5cD.MeqqyiagSxJoQVw.EQRJPYgclZA5tnG";

    this._obj.UserId = _values.UserId;
    this._obj.FlagId = 1;
    return this.http.post(this.rootUrl + '/UsersAPI/NewinsertupdateUsers', this._obj)
  }
  GetUserList() {
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    return this.http.post(this.rootUrl + '/UsersAPI/NewGetUsers', this._obj);

  }

  GetUserProfile(_values: UserRegistrationDTO) {
    this._obj.UserId = _values.UserId;

    return this.http.post(this.rootUrl + '/UsersAPI/NewGetUserDetailsSPA', this._obj)
  }
  globaluser(_values: UserRegistrationDTO) {
    this._obj.UserId = _values.UserId;
    this._obj.ToUserIdsStr = _values.ToUserIdsStr;
    return this.http.post(this.rootUrl + '/UsersAPI/NewAddRemoveGlobalUser', this._obj)
  }
  UpdateUserProfile(_values: UserRegistrationDTO,_CreatedBy: number,organizationid:number) {
    
    this._obj.UserName = _values.UserName;
    this._obj.FirstName = _values.FirstName;
    this._obj.MiddleName = _values.MiddleName;
    this._obj.lastName = _values.lastName;
    this._obj.DisplayName = _values.DisplayName;
    this._obj.UserEmail = _values.UserEmail;
    this._obj.Telephone1 = _values.Telephone1;
    this._obj.Telephone2 = _values.Telephone2;
    this._obj.UserPhone = _values.UserPhone;
    this._obj.CountryCode = _values.CountryCode;
    if (this._obj.UserPhone == null) {
      this._obj.UserPhone = 1;
    }
    this._obj.UserAddress = _values.UserAddress;
    this._obj.CountryId = _values.CountryId;
    this._obj.CityId = _values.CityId;
    this._obj.UserPincode = _values.UserPincode;
    this._obj.UserIsActive = _values.UserIsActive;
    this._obj.CreatedBy = _CreatedBy;
    this._obj.OrganizationId = organizationid;
    this._obj.CompanyId = _values.CompanyId;
    this._obj.DepartmentId = _values.DepartmentId;
    this._obj.RoleId = _values.RoleId;
    this._obj.UserId = _values.UserId;
    this._obj.ReportingUserId = _values.ReportingUserId;
    this._obj.EmployeeId = _values.EmployeeId;
    this._obj.DesignationId = _values.DesignationId;
    this._obj.PositionId = _values.PositionId;
    this._obj.IsInterCompany = _values.IsInterCompany;
    this._obj.IsGlobalUser = _values.IsGlobalUser;
    this._obj.IsArchiveApproval = _values.IsArchiveApproval;
    this._obj.IsArchiveDownload = _values.IsArchiveDownload;
    this._obj.IsStreamDownload = _values.IsStreamDownload;
    this._obj.IsCommunicationDownload = _values.IsCommunicationDownload

    this._obj.FlagId = _values.FlagId;

    return this.http.post(this.rootUrl + '/UsersAPI/NewupdateUsersInfo', this._obj)
  }

  UpDatedialog_Status(objStatus) {
    this._obj.UserId = objStatus.UserId
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/UsersAPI/NewUserStatus", this._obj);
  }
  GetUserListByPagination(_values: UserRegistrationDTO,_CreatedBy: number,organizationid:number) {
    this._obj.Sortby= _values.Sortby;
    this._obj.message = _values.message;
    this._obj.PageNumber = _values.PageNumber;
    this._obj.PageSize = _values.PageSize;
    this._obj.CompanyIds = _values.CompanyIds;
    this._obj.DesignationIds = _values.DesignationIds;
    this._obj.DepartmentIds = _values.DepartmentIds;
    this._obj.OrganizationId = organizationid;
    this._obj.CreatedBy = _CreatedBy;
    console.log(this._obj , "userList123");
    return this.http.post(this.rootUrl + "/UsersAPI/NewGetUsersAng", this._obj);
  }
  public exportAsExcelFile(UserRegistrationjson: any[], Positionjson: any[], ObjgetCompanyListjson: any[], ObjgetDepartmentListjson: any[], ObjgetRoleListjson: any[], ObjgetDesignationListjson: any[], excelFileName: string): void {
    const UserRegistrationWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(UserRegistrationjson);
    const PositionsWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Positionjson);
    const companyWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ObjgetCompanyListjson);
    const departmentWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ObjgetDepartmentListjson);
    const RoleWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ObjgetRoleListjson);
    const DesignationWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ObjgetDesignationListjson);
    // const ReportingUserWoorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ObjgetReportingUserjson);
    const workbook: XLSX.WorkBook = { Sheets: { 'UserRegistration': UserRegistrationWoorksheet, 'Positions': PositionsWoorksheet, 'Company': companyWoorksheet, 'Department': departmentWoorksheet, 'Role': RoleWoorksheet, 'Designation': DesignationWoorksheet }, SheetNames: ['UserRegistration', 'Positions', 'Company', 'Department', 'Role', 'Designation',] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const sheet: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(sheet, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  BulkUpload(_values: UserRegistrationDTO) {
    this._obj.JSONData = _values.JSONData;
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/UsersAPI/NewBulkUploadUsers", this._obj);
  }
  UpdatedReportUser(_values: UserRegistrationDTO) {
    this._obj.ReportingUserId = _values.ReportingUserId;
    this._obj.UserId = _values.UserId;
    return this.http.post(this.rootUrl + '/UsersAPI/NewUpdateReportingUser', this._obj);
  }

}
