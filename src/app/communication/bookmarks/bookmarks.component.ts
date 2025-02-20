import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { UserDTO } from 'src/app/_models/user-dto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  userid: number
  _objds: Dataservicedto;
  activePage: number;
  companyid: number;
  fromuserid: number;
  TotalRecords: number;
  _Search: string;
  _CurrentpageRecords: number;
  _obj: InboxDTO;
  _pageSize: number;
  _LstToMemos: InboxDTO[] = [];
  _LstUsers: any;
  _LstCompanies: any;
  subscription: Subscription;
  _MemoIds: any;
  _filtersMessage: string;
  _filtersMessage2: string;
  lastPagerecords: number;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LstMemoStatus: any;
  FiltersSelected: boolean;
  txtSearch: string;
  check: boolean = false;
  FavoriteSearch: string;
  _checkedMailIds = [];
  MemoView: boolean = false;
  LastPage: number;
  Favorite:string;
  Markasunread:string;
  Markasread:string;
  Delete:string;
  UnRead:string;
  Read:string;
  ReloadClearFilters:string;
  Recordsperpage:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(private inboxService: InboxService
    , private ds: DataServiceService
    , private cd: ChangeDetectorRef
    , private translate: TranslateService
    , private renderer: Renderer2
  ) {

    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.FavoriteSearch = lang === 'en' ? "Search....." : "يبحث.....";
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.translate.getTranslation(lang).subscribe(translations => {
        this.Favorite = translations.Communication.tomemotitleFavorite
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasunread = translations.Communication.tomemotitleMarkasunread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasread = translations.Communication.tomemotitleMarkasread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Delete = translations.Communication.tomemotitleDelete
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.UnRead = translations.Communication.titleUnRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Read = translations.Communication.tomemotitleRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.ReloadClearFilters = translations.Communication.tomemotitleReload
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Recordsperpage = translations.Communication.Recordsperpagetitle;
      });
    });
    
    this._pageSize = 30;
    this._Search = "";
    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;
      this.cd.detectChanges();
    });

  }

  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.FavoriteSearch = lang === 'en' ? "Search....." : "يبحث.....";
  
   
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    // this._pageSize = 30;
    this.activePage = 1;
    this.Bookmarklist();
  }

 

  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      this.Bookmarklist();
    }
  }

  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.Bookmarklist();
    }
  }

  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }

  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }

  clearSearch() {
    this._Search = '';
    this.Bookmarklist();
  }

  
  Bookmarklist() {
    console.log('successfully executed.');
    this.userid = this.currentUserValue.createdby;
    this.inboxService.GetBookmarklist(this.userid)
      .subscribe(data => {
        console.log(data,"bookMark list data");
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"];
        // console.log(this._LstToMemos, "MemosJSON");
        // alert(this._LstToMemos.length);
      });
  }
  gotoMemoDetailsV2(name, id, replyid) {

    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id);
    //var myWindow = window.open(myurl);
    myWindow.focus();

    localStorage.setItem('MailId', id);
    // this.router.navigateByUrl(myurl).then(e => {
    //   if (e) {
    //     window.open(myurl, '_blank').focus()
    //     console.log("Navigation is successful!");
    //   } else {
    //     console.log("Navigation has failed!");
    //   }
    // });
  }
 
}

