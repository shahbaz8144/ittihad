import { Injectable } from '@angular/core';
import { CategoryDTO } from '../_models/category-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { InboxDTO } from '../_models/inboxdto';
import { XmlToJson } from '../_helpers/xml-to-json';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  objCategoryDTO: CategoryDTO;
  formData: CategoryDTO;

  objCategory_List: CategoryDTO[];

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  _obj: InboxDTO;
  _XmlToJson: XmlToJson;

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj = new InboxDTO();
    this._XmlToJson = new XmlToJson();

    this.objCategoryDTO = new CategoryDTO();
    this.formData = new CategoryDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetCategoryList(_values: CategoryDTO) {
    this._obj.organizationid = this.currentUserValue.organizationid;
    this._obj.RoleId = this.currentUserValue.RoleId;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/CategoryAPI/NewGetcategories", this._obj)
   }
   Category_add(_values: CategoryDTO) {
    debugger
    this.objCategoryDTO.CategoryName = _values.CategoryName;
    if (this._obj.IsActive == null) {
      this._obj.IsActive = true;
    }
    
    this.objCategoryDTO.CategoryName = _values.CategoryName
    this.objCategoryDTO.Description = _values.Description
    this.objCategoryDTO.IsActive = _values.IsActive;
    this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
    this. objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
    
    this.objCategoryDTO.FlagId = _values.FlagId;
    if(_values.FlagId==2){
      this.objCategoryDTO.CategoryId=_values.CategoryId;
    }
    else if(_values.FlagId==1){
      this.objCategoryDTO.CategoryId=0;
    }
    this.objCategoryDTO.CategoryId=_values.CategoryId;
  
    return this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryInsertUpdate", this.objCategoryDTO);
}

UpDatedialog_Status(objStatus) {
  // this.ObjracksDto.WareHouseId = objStatus.WareHouseId;
  this.objCategoryDTO.CategoryId = objStatus.CategoryId
  this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
  // this.objDesignation.IsActive = objStatus.IsActive;
  this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
  this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryStatus", this.objCategoryDTO)
    .subscribe(
      (data) => {
        this.objCategory_List = data as CategoryDTO[];
      });
}
checkCategoryName(checkSpc:string){
  
  this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
  this.objCategoryDTO.CategoryName=checkSpc;
  
  return this.http.post(this.rootUrl + "/CategoryAPI/NewCheckCategoryName" , this.objCategoryDTO)
}
}

//   InsertCategory(formData:CategoryDTO) {
//     this.objCategoryDTO.CategoryName = formData.CategoryName;
//     if(formData.Description==null){
//       formData.Description="";
//     }
//     this.objCategoryDTO.Description = formData.Description;
//     this.objCategoryDTO.IsActive = formData.IsActive;
//     this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
//     this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
//     this.objCategoryDTO.FlagId = formData.FlagId;

//     return this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryInsertUpdate", this.objCategoryDTO)
    
//   }
//   // getCategory() {
     
//   //   this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
//   //   this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
//   //   this.objCategoryDTO.RoleId = this.currentUserValue.RoleId;
//   //   this.http.post(this.rootUrl + "/CategoryAPI/NewGetcategories", this.objCategoryDTO)
//   //     .subscribe(
//   //       (data) => {
//   //         this.objCategory_List = data as CategoryDTO[];
//   //       })
//   // }
//   getCategory_2() {
//     this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
//     this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
//     this.objCategoryDTO.RoleId = this.currentUserValue.RoleId;
//     return this.http.post(this.rootUrl + "/CategoryAPI/NewGetcategories", this.objCategoryDTO)
//   }

//   UpdateCategory(formData) {
//     debugger
//     this.objCategoryDTO.CategoryId=formData.CategoryId;
//     this.objCategoryDTO.CategoryName = formData.CategoryName;
//     this.objCategoryDTO.Description = formData.Description;
//     this.objCategoryDTO.IsActive = formData.IsActive;
//     this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
//     this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
//     this.objCategoryDTO.FlagId = formData.FlagId;

//     return this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryInsertUpdate", this.objCategoryDTO)
//       .subscribe(data => {
//         this.objCategoryDTO = data as CategoryDTO;
//       });
//   }

//   UpDate_Status(objStatus) {
//     this.objCategoryDTO.CategoryId =objStatus.CategoryId;
//     this.objCategoryDTO.OrganizationId = this.currentUserValue.organizationid;
//     this.objCategoryDTO.IsActive = objStatus.IsActive;
//     this.objCategoryDTO.CreatedBy = this.currentUserValue.createdby;
//     this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryStatus", this.objCategoryDTO)
//       .subscribe(
//         (data) => {
//           this.objCategory_List = data as CategoryDTO[];
//         });
//   }
// }
