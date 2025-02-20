import { Component, OnInit, Injectable, Renderer2 } from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { BehaviorSubject } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { data } from 'jquery';
import { InboxComponent } from '../inbox/inbox.component';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-dmsrequest',
  templateUrl: './dmsrequest.component.html',
  styleUrls: ['./dmsrequest.component.css']
})

export class DMSRequestComponent implements OnInit {
  _obj: InboxDTO;
  currentUserSubject: any;
  currentUser: any;
  Requestjosn: any;
  requestsearch: string;
  dmsSearch:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(private inboxService: InboxService,
    private _inbox: InboxComponent,
    private translate : TranslateService
    ,private renderer: Renderer2
   
  ) {
    this._obj = new InboxDTO()
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang); 
 this.dmsSearch = lang === 'en' ? "Search....." : "......يبحث";
 if(lang == 'ar'){
  this.renderer.addClass(document.body, 'kt-body-arabic');
}else if (lang == 'en'){
  this.renderer.removeClass(document.body, 'kt-body-arabic');
}
   });
   }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.dmsSearch = lang === 'en' ? 'Search.....' : '......يبحث"';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.Requestmemo();
  }
  Requestmemo() {
    this.inboxService.requestMemos(this.currentUserValue.createdby, this.currentUserValue.organizationid)
      .subscribe(data => {
      console.log(data,"DMS Request");
        // Old API Response
        // this._obj = data as InboxDTO;
        //   this.Requestjosn = JSON.parse(this._obj.RequestJson);
        this.Requestjosn = data["Data"];
        this.Requestjosn = this.Requestjosn["RequestJson"];
        console.log(this.Requestjosn, "RequestJson");
        // console.log(this.Requestjosn,"dms request");
      })
  }
  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }
  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }
  clearSearch() {
    this.requestsearch = '';
    this.Requestmemo();
  }
  gotoMemoDetailsV2(name, id, replyid) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
  }

  // gotoMemoDetailsV2(name, id) {
  //   var url = document.baseURI + name;
  //   var myurl = `${url}/${id}`;
  //   var myWindow = window.open(myurl, id);
  //   myWindow.focus();
  //   localStorage.setItem('MailId', id);
  // }

  // DMSRequestMemoStatus(FromUserId: number, MailId: any, val) {
  //   if (val == 1) {
  //     this._obj.UserApprovalStatus = 'Approve';
  //   } else if (val == 2) {
  //     this._obj.UserApprovalStatus = 'Reject';
  //   }
  //   this.inboxService.RequestMemoStatus( FromUserId,MailId, this.currentUserValue.createdby, this._obj)
  //     .subscribe(data => {
  //       this._obj = data as InboxDTO;
  //       this.Requestmemo();
  //       this._inbox.DMSMemoCount()
  //     })
  // }

  DMSRequestMemoStatus(FromUserId: number, MailId: any, val: number, replyid) {
    // Initialize _obj if not done in ngOnInit
    // 
    if (val === 1) {
      this._obj.UserApprovalStatus = 'Approve';
    } else if (val === 2) {
      this._obj.UserApprovalStatus = 'Reject';
    }
    this.inboxService
      .RequestMemoStatus(FromUserId, MailId, this.currentUserValue.createdby, replyid, this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        this.Requestmemo();
        this._inbox.DMSMemoCount();
      });
  }

}
