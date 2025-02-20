import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { MapCategoriesCompanyDTO } from '../_models/map-categories-company-dto';

@Injectable({
  providedIn: 'root'
})
export class MapCategoriesCompanyService {

  CId: number
  _CategoryList: MapCategoriesCompanyDTO[];
  _SubCategoryList:MapCategoriesCompanyDTO[];
  _objMapCategoryCompany_DTO: MapCategoriesCompanyDTO;
  _CompanyList: MapCategoriesCompanyDTO[];


  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  // _obj: InboxDTO;
  // _XmlToJson: XmlToJson;
_obj:MapCategoriesCompanyDTO;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj= new MapCategoriesCompanyDTO;
    // this._obj = new InboxDTO();
    // this._XmlToJson = new XmlToJson();
    // this._objMapCategoryCompany_DTO = new MapCategoriesCompanyDTO();
  }

  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetCategoriesByCompanyId(CompanyId){
  this._obj.CompanyId=CompanyId;
  return this.http.post(this.rootUrl + "/CategoryAPI/NewGetmappedcategoriesAng", this._obj)
  }


  // GetCompanies() {
  //  // debugger
  //   this._objMapCategoryCompany_DTO.OrganizationId = this.currentUserValue.organizationid;
  //   this._objMapCategoryCompany_DTO.RoleId = this.currentUserValue.RoleId;
  //   this._objMapCategoryCompany_DTO.CreatedBy = this.currentUserValue.createdby;

  //   this.http.post(this.rootUrl + "/CompanyAPI/NewGetCompanies", this._objMapCategoryCompany_DTO).
  //     subscribe(
  //       (data) => {
  //         debugger
  //         this._CompanyList = data as MapCategoriesCompanyDTO[];
  //         // console.log(this._CompanyList);
  //       });
  // }

  // getCategoriesByCompanyId(CompanyId: number) {
  //   debugger
  //   this._objMapCategoryCompany_DTO.CompanyId = CompanyId;
  //   this.http.post(this.rootUrl + "CategoryAPI/NewGetmappedcategories", this._objMapCategoryCompany_DTO).
  //     subscribe(
  //       (data) => {
  //         this._CategoryList = data as MapCategoriesCompanyDTO[]
  //         console.log("CategoryList",this._CategoryList['datasetxml']);
  //       }
  //     );
  // }

  // getCategoriesByCompanyId(cid: number) {
  //   debugger
  //   this._objMapCategoryCompany_DTO.CompanyId = cid;
  //   this.http.post(this.rootUrl + "CategoryAPI/NewGetmappedcategories", this._objMapCategoryCompany_DTO).
  //     subscribe(
  //       (data) => {
  //         this._objMapCategoryCompany_DTO = data as MapCategoriesCompanyDTO;
  //         this._CategoryList = JSON.parse(this._objMapCategoryCompany_DTO.CategoryJSON);
         
  //         this._SubCategoryList = JSON.parse(this._objMapCategoryCompany_DTO.SubCategoryJSON);
          
  //         console.log("List 1===>",this._CategoryList);
  //         console.log("List 2===>",this._SubCategoryList);
      
  //       })
  // }
}
