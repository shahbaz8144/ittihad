import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AssignMenusDTO } from 'src/app/_models/assign-menus-dto';
import { AssignMenuServicesService } from 'src/app/_service/assign-menu-services.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-assign-menus',
  templateUrl: './assign-menus.component.html',
  styleUrls: ['./assign-menus.component.css']
})
export class AssignMenusComponent implements OnInit {
  _obj:AssignMenusDTO;
  role: number;
  _objAssingmenus:any[]=[];
  getroles:any;
  result:any;
  RoleId:number;
  MenuId:number;
  MenuCategoryId:number;
  checkstatus:boolean;
  objmenulist:any;
  objmenuCategory:any;
  select:string;
  currentLang:"ar"|"en"="ar";
  constructor(public services:AssignMenuServicesService,
    private translate:TranslateService,
     private renderer: Renderer2,
     @Inject(DOCUMENT) private document: Document,
  ) {
    this._obj = new AssignMenusDTO();
    this.getroles = [];
    this.objmenulist = [];
    this.objmenuCategory = [];
    HeaderComponent.languageChanged.subscribe((lang) =>{
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.select = lang === 'en' ? 'select' : 'يختار'
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
   }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.select = lang === 'en' ? 'select' : 'يختار'
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.getroledetails();
  }
  getroledetails(){
    this._obj.Search = "";
    this._obj.PageNumber = 1;
    this._obj.PageSize= 10000;
    this.services.getrolelist(this._obj).subscribe(data=>{
      this._obj=data as AssignMenusDTO
      this.getroles = this._obj
      this.result = this.getroles.filter(word => word.IsActive == true)
    })
  }
  getmenubyroleId(RoleId){
    
    this.RoleId = RoleId;
    this._obj.RoleId = RoleId;
    this.services.getmenulist(this._obj).subscribe(data=>{
      this._obj = data as AssignMenusDTO
      this.objmenuCategory = this._obj.Data['MenuCategory']
      this.objmenulist = this._obj.Data['MenuList']
    })
  }
  insertmenus(){
    
    try{
      this._obj.MenuId = this.MenuId;
      this._obj.MenuCategoryId = this.MenuCategoryId;
      this._obj.checkstatus = this.checkstatus;

      this.services.assingmenus(this._obj).subscribe(data=>{
        this._obj = data as AssignMenusDTO;
      })
    }catch(error){
      alert(error)
    }
  }
  getstatusvalue(event){
    this._obj.MenuStatus = event.target.checked;
    this._obj.MenuId = event.target.id;
    this._obj.RoleId = this.RoleId;
    this.services.assingmenus(this._obj).subscribe(data=>{
      this._obj = data as AssignMenusDTO;
    })
  }
}
