import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { SubcategoriesDTO } from '../_models/subcategories-dto';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  _obj: SubcategoriesDTO;
  constructor(private http: HttpClient, private commonUrl: ApiurlService) { 
    this._obj=new SubcategoriesDTO();
  }
  //fetch API Url from APIUrl Service
  readonly rootUrl = this.commonUrl.apiurl;
   
  LoadSubCategoryDetails(_values:SubcategoriesDTO){
   return this.http.post(this.rootUrl + '/CategoryAPI/NewGetsubcategoriesJson', _values);
 }

 AddSubCategory(_values:SubcategoriesDTO){
   return this.http.post(this.rootUrl+'/CategoryAPI/NewSubCategory',_values);
 }

}
