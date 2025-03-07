import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import * as momenth from 'moment-hijri';
import { DashboardService } from 'src/app/_service/dashboard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  _ApprovalMemos:any;
_ReplyRequired:any;
_ExpiryMemos:any;
_PendingFromOthersCount:any;
_NewMemos:any;
_LstToBanner : any[]=[];
images: any = [];
DailyActivity:any [] = [];
  today: string;
  currentLang: "ar" | "en" = "ar";
  constructor(private dashboardService: DashboardService,private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
   private router: Router) {
    // this.today = new Date().toLocaleDateString('en-GB'); // Format: DD-MM-YYYY
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.today = formattedDate;
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
        this.today = this.getIslamicDate(this.today);
      } else if (lang == 'en') {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        this.today = formattedDate;
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      const editElement = document.getElementById("editrck");
      if (editElement) {
        editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
      }
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.today = formattedDate;
  
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
      this.today = this.getIslamicDate(this.today);
    } else if (lang == 'en') {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.today = formattedDate;
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    const editElement = document.getElementById("editrck");
    if (editElement) {
      editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
    }
    this.NewDashboardList();
  }

  getIslamicDate(gregorianDate: string): string {
    return momenth(gregorianDate, 'YYYY-MM-DD').format('iYYYY/iMM/iDD');
  }



  NewDashboardList(){
    this.dashboardService.NewDashboardAPI().subscribe(data => {
      console.log(data,"New Dashboard");
      // this.SMailList = data['Data'].SMailList;
      // this.ArchiveList = data['Data'].ArchiveList;
      this._ApprovalMemos = data['Data'].ApprovalMemos;
      this._ExpiryMemos = data['Data'].ExpiryMemos;
      this._NewMemos = data['Data'].NewMemos;
      this._PendingFromOthersCount = data['Data'].PendingFromOthersCount;
      this._ReplyRequired = data['Data'].ReplyRequired
      this.DailyActivity = data['Data'].DailyActivityJson;
      this._LstToBanner = data['Data'].BannerJson; 
  if (this._LstToBanner && Array.isArray(this._LstToBanner)) {
  this._LstToBanner.forEach(element => {
    if (element.AttachmentJson && Array.isArray(element.AttachmentJson)) {
      element.AttachmentJson.forEach(Attch => {
        let _Obj = {
          path: Attch.FileUrl,
          type: 'image'
        };
        this.images.push(_Obj);
      });
    }
  });
}
    })

  }

  UrlRedirect(val: string) {
    //alert(val);
    localStorage.removeItem('Dashboard_FilterValue');
    localStorage.setItem('Dashboard_FilterValue', val);
    this.router.navigateByUrl('backend/Inbox/Memos');
  }

  UrlRedirectPendingfromOthers(val: string) {
    //alert(val);
    this.router.navigateByUrl('backend/Inbox/' + val);
  }

}
