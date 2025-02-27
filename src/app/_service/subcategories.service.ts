import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { SubcategoriesDTO } from '../_models/subcategories-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  _obj: SubcategoriesDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj=new SubcategoriesDTO();
  }
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  LoadSubCategoryDetails(_values:SubcategoriesDTO){
   return this.http.post(this.rootUrl + '/CategoryAPI/NewGetsubcategoriesJson', _values);
 }

 AddSubCategory(_values:SubcategoriesDTO){
   return this.http.post(this.rootUrl+'/CategoryAPI/NewSubCategory',_values);
 }

 Category_add(_values: SubcategoriesDTO) {
  this._obj.CategoryName = _values.CategoryName;
  if (this._obj.IsActive == null) {
    this._obj.IsActive = true;
  }
  
  this._obj.CategoryName = _values.CategoryName
  this._obj.Description = _values.Description
  this._obj.IsActive = _values.IsActive;
  this._obj.CreatedBy = this.currentUserValue.createdby;
  this. _obj.OrganizationId = this.currentUserValue.organizationid;
  this._obj.FlagId = _values.FlagId;
 //  if(_values.FlagId==2){
 //    this._obj.CategoryId=_values.CategoryId;
 //  }
 //  else if(_values.FlagId==1){
 //    this.objCategoryDTO.CategoryId=0;
 //  }
 //  this.objCategoryDTO.CategoryId=_values.CategoryId;

  return this.http.post(this.rootUrl + "/CategoryAPI/NewCategoryInsertUpdate", this._obj);
}
}
