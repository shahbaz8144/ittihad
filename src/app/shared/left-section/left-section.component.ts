import { Component, OnInit,ViewChild,EventEmitter,Renderer2} from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { Router } from '@angular/router';
//import { AuthenticationService } from 'src/app/_service/authentication.service';
import Localbase from 'localbase'
import { MenuService } from 'src/app/_service/menu.service';
import { MenuDTO } from 'src/app/_models/menu-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { TranslateService } from '@ngx-translate/core';

let users_db = new Localbase('pwa-database_users')
@Component({
  selector: 'app-left-section',
  templateUrl: './left-section.component.html',
  styleUrls: ['./left-section.component.css']
})
export class LeftSectionComponent implements OnInit {
  @ViewChild(DashboardComponent) childComponent: DashboardComponent;
  _MenuList: any
  _MenuCategoryList: any
  styleTag: HTMLStyleElement | undefined;
  // currentUser: UserDTO;
  _obj: MenuDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public static ArabicSide:EventEmitter<any>=new EventEmitter();
  
  arabicCssPath: string | undefined;
  constructor(
    private renderer: Renderer2,
    private router: Router
    //, private authenticationService: AuthenticationService
    , private menuService: MenuService
    , private translate : TranslateService
    //, private dbService: NgxIndexedDBService
  ) {
   
    DashboardComponent.ArabicSide.subscribe((lang:any)=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang); 
      if (lang === 'ar') {
        this.arabicLeftSection();
      } else {
        this.removeArabicStyles();
      }
  });
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

//   arabicLeftSection() {
//   //   const css = `
//   //   body {
//   //     margin: 0;
//   //     font-family: var(--font-family-sans-serif)!important;
//   //     line-height: 1.5 !important;
//   //     direction: rtl!important;
//   //   }

//   //   .kt-aside--minimize #kt_aside_brand {
//   //     display: flex;
//   //     height: auto;
//   //     padding-top: 10px;
//   //     align-items: center;
//   //     justify-content: center;
//   //   }

//   //   .kt-aside__brand-logo img {
//   //     vertical-align: middle;
//   //     border-style: none;
//   //     margin-left: 0!important;
//   //   }

//   //   .kt-header--fixed.kt-aside--minimize .kt-header {
//   //     left: 0!important;
//   //     transition: all 0.3s ease;
//   //     right: 56px!important;
//   //   }

//   //   .header-title {
//   //     text-align: right!important;
//   //   }

//   //   .wc h2 {
//   //     text-align: right!important;
//   //   }

//   //   @media (min-width: 1025px) {
//   //     .kt-aside--fixed .kt-aside {
//   //       position: fixed;
//   //       top: 0;
//   //       bottom: 0;
//   //       left: 0!important;
//   //       z-index: 99;
//   //       right: 0!important;
//   //     }

//   //     .kt-aside--fixed.kt-aside--minimize .kt-wrapper {
//   //       padding-right: 74px!important;
//   //       padding-left: 0!important;
//   //       transition: all 0.3s ease;
//   //     }
//   //   }
//   // `;

//   //   this.styleTag = this.renderer.createElement('style');
//   //   this.styleTag.type = 'text/css';
//   //   this.styleTag.appendChild(this.renderer.createText(css));

//   //   // Append the <style> tag to the <head> element
//   //   this.renderer.appendChild(document.head, this.styleTag);
  
//  // Assuming you have the path to your Arabic CSS file
//  const cssFilePath = 'assets/i18n/arabic.css';

//  // Create a link element for the CSS file
//  const link = this.renderer.createElement('link');
//  link.rel = 'stylesheet';
//  link.type = 'text/css';
//  link.href = cssFilePath;

//  // Append the link element to the document head
//  this.renderer.appendChild(document.head, link);
// }
// removeArabicStyles() {
//   // Remove the dynamically added style tag
//   if (this.styleTag && this.styleTag.parentNode) {
//     this.renderer.removeChild(document.head, this.styleTag);
//     this.styleTag = undefined;
//   }
// }

arabicLeftSection() {
  // Assuming you have the path to your Arabic CSS file
  const cssFilePath = 'assets/i18n/arabic.css';

  // Create a link element for the CSS file
  const link = this.renderer.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssFilePath;

  // Set an id attribute to identify the link element
  link.id = 'arabicCssLink';

  // Append the link element to the document head
  this.renderer.appendChild(document.head, link);
}

removeArabicStyles() {
  // Remove the dynamically added link element
  const linkElement = document.getElementById('arabicCssLink');
  if (linkElement && linkElement.parentNode) {
    // console.log('Removing Arabic styles');
    this.renderer.removeChild(document.head, linkElement);
  } else {
    // console.log('Link element not found or already removed');
  }
}






  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value;
  }
  ngOnInit() {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang); 
    this.Menubinding();
  }
  // ngAfterViewInit() {
  // }
  Menubinding() {
    this.menuService.UserMenus()
      .subscribe(data => {
        this._obj = data as MenuDTO;
        this._MenuCategoryList = JSON.parse(this._obj.MenuCategoryJson);
        this._MenuList = JSON.parse(this._obj.MenusJson);
         
        var dynamicScripts = [ environment.assetsurl+"assets/js/scripts.bundle.js"];
        //  var dynamicScripts = ["../../../assets/js/scripts.bundle.js"];
        for (var i = 0; i < dynamicScripts.length; i++) {
          let node = document.createElement('script');
          node.src = dynamicScripts[i];
          node.type = 'text/javascript';
          node.async = false;
          node.charset = 'utf-8';
          document.getElementsByTagName('head')[0].appendChild(node);
        }
        //import('../../../assets/js/scripts.bundle.js');
        
      })
  }
  //   menuopen1(){
  //     var v1 = document.getElementsByClassName("menu-sub1");
  //     for (var i = 0; i < v1.length; i++){
  //      v1[i].classList.toggle("kt-menu__item--hover");
  //   }
  // }
  // menuopen(){
  //   document.getElementsByClassName("kt-menu__item--bottom-2")[0].classList.toggle("kt-menu__item--hover");
  // }
  logout() {
    // this.dbService.deleteDatabase().then(
    //   () => {
    //     console.log('Database deleted successfully');
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    // users_db.collection('users').delete();
    //users_db.delete()
     
    //this.authenticationService.logout();
    sessionStorage.clear();
    localStorage.clear();
    return this.router.navigate(['login']);
  }
}