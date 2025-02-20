import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SubcategoriesService } from 'src/app/_service/subcategories.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { SubcategoriesDTO } from 'src/app/_models/subcategories-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';
declare var $:any;
// import Enumerable from 'linq';
// import { element } from 'protractor';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})


export class SubCategoryComponent implements OnInit {
  listtreel:any;
  _LstCategory:SubcategoriesDTO[];
  _LstSubCategory:any;
  _LstChildSubCategory:SubcategoriesDTO[];
  _obj:SubcategoriesDTO;
  txtSearch: string;
  currentLang:"ar"|"en"="ar";
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  
constructor(private subCategoryService: SubcategoriesService
  ,private _snackBar: MatSnackBar,
  private renderer: Renderer2,
  private translate:TranslateService,
      @Inject(DOCUMENT) private document: Document,
    ) { 
 
    this._obj=new SubcategoriesDTO();
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    })
}
ngOnInit(){
  let lang: any = localStorage.getItem('language');
  this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  this.LoadSubCategories();
}
filterItemsOfType(type) {
  return this._LstChildSubCategory.filter(x => x.SubId == type);
}
filterItemsOfSubCategory(CategoryId) {
  debugger
  return this._LstChildSubCategory.filter(element => element.IsUnderSubCategory==false 
    && element.SubId==0 
    && element.CategoryId==CategoryId);
}
AddSubChildCategory(CategoryId){
  $('#Category_'+CategoryId).toggle();
}
AddSubCategory(CategoryId:number,SubCategoryId:number,IsUnderSubCategory:boolean){
  //txtsubcategoryname_
  var _text="";
  if(IsUnderSubCategory==false)
  {
    _text=$('#txtsubcategoryname_'+CategoryId).val()
  }
  else{
    _text=$('#txtsubcategoryname_'+SubCategoryId).val()
  }
  if(_text.length<3){
    this._snackBar.open('Minimum 3 length character required', 'End now', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition:'right',
      panelClass: ['red-snackbar']
    });
    return false;
  }
  this._obj.CategoryId=CategoryId;
  this._obj.SubCategoryId=SubCategoryId;
  this._obj.IsUnderSubCategory=IsUnderSubCategory;
  this._obj.Description="";
  this._obj.OrganizationId=this.currentUserValue.organizationid;
  this._obj.IsActive=true;
  this._obj.CreatedBy=this.currentUserValue.createdby;
  this._obj.SubCategoryName=_text;
  this.subCategoryService.AddSubCategory(this._obj).subscribe(
    data=>{
      this._obj=data as SubcategoriesDTO;
      if (this._obj.message == "1") {
        this._snackBar.open('Added Successfully', 'End now', {
          duration: 5000,
          verticalPosition: 'bottom',
              horizontalPosition:'right',
        });
        this.LoadSubCategories();
      }
      else {
        this._snackBar.open('Something went wrong please try again later...!', 'End now', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition:'right',
          panelClass: ['red-snackbar']
        });
      }
    }
  )
}


LoadSubCategories(){
  this._obj.CreatedBy=this.currentUserValue.createdby;
  this._obj.OrganizationId=this.currentUserValue.organizationid;
  this._obj.RoleId=this.currentUserValue.RoleId;
  this.subCategoryService.LoadSubCategoryDetails(this._obj).subscribe(
      data=>{
        debugger
        this._obj=data as SubcategoriesDTO;
        this._LstCategory=JSON.parse(this._obj.CategoryJson);
        this._LstChildSubCategory=JSON.parse(this._obj.SubCategoryJson);
        this._LstSubCategory=[];
         
        // this._LstCategory.forEach(cat => {
        //   this._LstChildSubCategory.forEach(element => {
        //     if(element.IsUnderSubCategory==false && element.SubId==0 && element.CategoryId==cat.CategoryId){
        //       let customObj = new SubcategoriesDTO();
        //           customObj.SubCategoryId = element.SubCategoryId;
        //           customObj.SubCategoryName = element.SubCategoryName;
        //           customObj.SubId = element.SubId;
        //           this._LstSubCategory.push(customObj);
        //     }
        //   });
        // });
        
        // this._LstSubCategory=this._LstChildSubCategory.filter(
        //   cat=>cat.IsUnderSubCategory===false && cat.SubId===0 && cat.CategoryId===cat.CategoryId
        // )
        // this._LstSubCategory=Enumerable.from(this._LstChildSubCategory).
        // select(cat=>(
        //   {
        //     IsUnderSubCategory:false,
        //     SubId:0 ,
        //     CategoryId:cat.CategoryId
        //   }
        // )).toArray();
        //   console.log(this._LstSubCategory);

        // this._LstSubCategory=Enumerable.from(this._LstChildSubCategory).
        // select(cat=>(
        //   {
        //     CategoryId:((cat.CategoryId)==element.CategoryId),
        //     SubId:((cat.CategoryId)==0),
        //     IsUnderSubCategory:((cat.IsUnderSubCategory)==false),
            
        //   }
        // )).toArray();

    })
}
ViewTextBox(CategoryId){
  $('#SubCategory_'+CategoryId).toggle();
}
canceltextbox(CategoryId){
  $('#SubCategory_'+CategoryId).toggle();
}



}

$(document).on('click', '.arrow', function() {
  // do something
  this.parentElement.parentElement.querySelector(".nested").classList.toggle("expanded");
  this.parentElement.classList.toggle("caret-down");
});

$(document).on('click', '.fa-plus', function() {
  // do something
  $('#SubCategory_'+this.id).toggle();
  const element = document.querySelector("#DivCat_"+this.id);
  var _bool=element.classList.contains("expanded");
  if(!_bool){
    this.parentElement.parentElement.parentElement.parentElement.querySelector(".nested").classList.toggle("expanded");
    this.parentElement.parentElement.parentElement.classList.toggle("caret-down");
  }
});

function myFunction() {
  debugger
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("folder-tr");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}

