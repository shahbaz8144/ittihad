import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import * as momenth from 'moment-hijri';
import { DashboardService } from 'src/app/_service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  _ApprovalMemos: any;
  _ReplyRequired: any;
  _ExpiryMemos: any;
  _PendingFromOthersCount: any;
  _NewMemos: any;
   _MemoRequests: any;
  _LstToBanner: any[] = [];
  images: any = [];
  DailyActivity: any[] = [];
  today: string;
  currentLang: "ar" | "en" = "ar";
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LoginUserId: number;
  constructor(private dashboardService: DashboardService, private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private blobService: AuthenticationService) {
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
    this._LoginUserId = this.currentUserValue.createdby;
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  async ngOnInit() {
     
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

    await this.NewDashboardList(this._LoginUserId);
    await this.loadSasUrlsForImages();

  }

  getIslamicDate(gregorianDate: string): string {
    return momenth(gregorianDate, 'YYYY-MM-DD').format('iYYYY/iMM/iDD');
  }


  async loadSasUrlsForImages() {
    for (let image of this.images) {
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5); // 5 minutes expiry

      try {
        image.sasUrl = await this.blobService.getSasUrl(image.path, expiryTime);
      } catch (error) {
        console.error(`Error fetching SAS URL for ${image.path}`, error);
      }
    }
  }

dashboardTiles: { title: string; count: number }[] = [];
User_FullName: string = "";
  async NewDashboardList(userid: number) {
    const data = await this.dashboardService.NewDashboardAPI(userid);
    console.log(data, "New Dashboard API Data");
    const result = data['Data'];
    const allTiles = [
      { type: 'Approval Pending', title: 'Dashboard.ApprovalPending', count: +result.ApprovalMemos },
      { type: 'Reply Required', title: 'Dashboard.ReplyRequired', count: +result.ReplyRequired },
      { type: 'Expired Memos', title: 'Dashboard.ExpiredMemos', count: +result.ExpiryMemos },
      { type: 'PendingFromReceiver', title: 'Dashboard.PendingFromOthers', count: +result.PendingFromOthersCount },
      { type: 'UnRead', title: 'Dashboard.UnreadMemos', count: +result.NewMemos },
       { type: 'MemoRequest', title: 'Dashboard.Memorequest', count: +result.MemoRequests }
    ];

    this.dashboardTiles = [
      ...allTiles.filter(tile => tile.count > 0),
      ...allTiles.filter(tile => tile.count === 0)
    ];
// console.log(this.dashboardTiles,"Fianal dashboard array");
    this.User_FullName = data['Data'].UserName;
    // console.log("UserFullName:", this.User_FullName);
    this._ApprovalMemos = data['Data'].ApprovalMemos;
    this._ReplyRequired = data['Data'].ReplyRequired
    this._ExpiryMemos = data['Data'].ExpiryMemos;
    this._PendingFromOthersCount = data['Data'].PendingFromOthersCount;
    this._NewMemos = data['Data'].NewMemos;
    this._MemoRequests = data['Data'].MemoRequests;
    this.DailyActivity = data['Data'].DailyActivityJson;
    console.log(this.DailyActivity, "DailyActivityJson");
    this._LstToBanner = data['Data'].BannerJson;
    if (this._LstToBanner && Array.isArray(this._LstToBanner)) {
      this._LstToBanner.forEach(element => {
        if (element.AttachmentJson && Array.isArray(element.AttachmentJson)) {
          element.AttachmentJson.forEach(Attch => {
            let _Obj = {
              path: Attch.FileUrl,
              type: 'image',
              sasUrl: ''
            };
            this.images.push(_Obj);
          });
        }
      });
    }
    // })

  }


  handleClick(ss: any) {
  if (ss.Activity === 'New Document') {
    this.sideviw('Gac/DocumentDetails', ss.DocumentId, '0', ss.ShareId);
  } else {
    this.DailyActivitys('Memo/Details', ss.MailId, ss.ReplyId);
  }
}

DailyActivitys(name: any, MailId: any, ReplyId: any) {
  const url = document.baseURI + name;
  const myurl = `${url}/${MailId}/${ReplyId}`;
  window.open(myurl, MailId);
}

sideviw(name: any, DocumentId: any, value: any, ShareId: any) {
  const url = document.baseURI + name;
  const myurl = `${url}/${DocumentId}/${value}/${ShareId}`;
  window.open(myurl, DocumentId);
}



  // async NewDashboardList(userid: number) {
  //   // this.dashboardService.NewDashboardAPI(userid).subscribe(data => {
  //   const data = await this.dashboardService.NewDashboardAPI(userid);
  //    console.log(data, "New Dashboard API Data");
  //   // console.log(data['DashboardJson'], "New Dashboard");
  //   // this.SMailList = data['Data'].SMailList;
  //   // this.ArchiveList = data['Data'].ArchiveList;
  //   this._ApprovalMemos = data['Data'].ApprovalMemos;
  //   this._ExpiryMemos = data['Data'].ExpiryMemos;
  //   this._NewMemos = data['Data'].NewMemos;
  //   this._PendingFromOthersCount = data['Data'].PendingFromOthersCount;
  //   this._ReplyRequired = data['Data'].ReplyRequired
  //   this.DailyActivity = data['Data'].DailyActivityJson;
  //   console.log(this.DailyActivity, "DailyActivityJson");
  //   this._LstToBanner = data['Data'].BannerJson;
  //    console.log(this._LstToBanner,"Baneer List");
  //   if (this._LstToBanner && Array.isArray(this._LstToBanner)) {
  //     this._LstToBanner.forEach(element => {
  //       if (element.AttachmentJson && Array.isArray(element.AttachmentJson)) {
  //         element.AttachmentJson.forEach(Attch => {
  //           let _Obj = {
  //             path: Attch.FileUrl,
  //             type: 'image',
  //             sasUrl: ''
  //           };
  //           this.images.push(_Obj);
  //         });
  //       }
  //     });
  //   }
  //   // })

  // }

  UrlRedirect(val: string) {
    //alert(val);
    // localStorage.removeItem('Dashboard_FilterValue');
    // localStorage.setItem('Dashboard_FilterValue', val);
    // this.router.navigateByUrl('backend/Inbox/Memos');

     if (val !== 'PendingFromReceiver' && val !== 'MemoRequest') {
      localStorage.removeItem('Dashboard_FilterValue');
      localStorage.setItem('Dashboard_FilterValue', val);
      this.router.navigateByUrl('backend/Inbox/Memos');
    } else {
      this.UrlRedirectPendingfromOthers(val);
    }
  }

  UrlRedirectPendingfromOthers(val: string) {
    //alert(val);
    this.router.navigateByUrl('backend/Inbox/' + val);
  }

}
