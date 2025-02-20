import { Component, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']

})


@Injectable({
  providedIn: 'root'
})
export class AnnouncementComponent implements OnInit {
  Readoption: any;
  _obj: InboxDTO;
  _AnnouncementId: any
  SearchAnnouncement: string;
  Readuserserach: string;
  Totalusersearch: string;
  SelectedSubject: string;
  _LstToAnnouncement: InboxDTO[];
  _TotaluserList: InboxDTO[];
  _ReaduserList: InboxDTO[];
  AnnouncementId: number;
  id: any;
  UserSearch:string;
  ReadUserSearch:any;
  SearchAnnouncements:any;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];

  }
  constructor(private inboxService: InboxService,
    private translate:TranslateService
    ,private renderer: Renderer2
    ) {
    this._obj = new InboxDTO();
    HeaderComponent.languageChanged.subscribe(lang => {
      localStorage.getItem('language');
      this.translate.use('language');
      this.SearchAnnouncements = lang === 'en' ? 'Search Announcements.....' : 'اعلانات البحث .....';
      this.UserSearch = lang === 'en' ? 'Search' : 'يبحث';
      this.ReadUserSearch = lang === 'en' ? 'Search' : 'يبحث';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }
  ngOnInit() {
  const lang:any = localStorage.getItem('language');
  this.SearchAnnouncements = lang === 'en' ? 'Search Announcements.....' : 'اعلانات البحث .....';
   this.ReadUserSearch = lang === 'en' ? 'Search' : 'يبحث'; 
  this.UserSearch = lang === 'en' ? 'Search' : 'يبحث';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.AnnouncementList();

    // setTimeout(function(){$(".mega-svg").attr('viewBox', ("0 0 110 106"))}, 100);
  }

  gotoAnnoucementDetailsV2(name, id) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
  AnnouncementList() {
    this.inboxService.AnnouncementList(this.currentUserValue.organizationid, this.currentUserValue.createdby).subscribe(
      data => {
        // console.log(data,"AnnouncementList");
        // Old API Response
        // this._obj = data as InboxDTO;
        // this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        this._LstToAnnouncement = data["Data"];
        this._LstToAnnouncement = this._LstToAnnouncement["AnnouncementListJson"];
        // console.log(this._LstToAnnouncement,"AnnoucementJson")
        this._LstToAnnouncement.forEach(element => {
          element.AttachmentJson = JSON.parse(element.AttachmentJson);
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
      }
    )
  }
  cleartext() {
    this.Totalusersearch = "";
    this.Readuserserach = "";
  }
  ReBindData() {
    this.SearchAnnouncement = "";
    this.AnnouncementList();
  }

  Totalusers(AnnouncementId, value) {
    this.SelectedSubject = value;
    this._LstToAnnouncement.forEach(element => {
      if (element.AnnouncementId == AnnouncementId) {
        this._TotaluserList = JSON.parse(element.TotalUserJson);
      }
    });
    this.Totalusersearch = "";
  }

  Readusers(AnnouncementId, value) {
    this.SelectedSubject = value;
    this._LstToAnnouncement.forEach(element => {
      if (element.AnnouncementId == AnnouncementId) {
        this._ReaduserList = JSON.parse(element.ReadUserJson);
      }
    });
    this.Readuserserach = "";
  }
}
