import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import * as moment from 'moment'
import { DOCUMENT, DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from 'src/app/master-forms/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.css']
})
export class AnnouncementDetailsComponent implements OnInit {
  _obj: InboxDTO;
  _AnnouncementId: any;
  id: any;
  _AnnouncementStatus: boolean;
  _LstToAnnouncement: InboxDTO[];
  Readuserserach: string
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  date: any = new Date();
  String_status: string;
  SelectedSubject: string
  InActive = false;
  _TotaluserList: InboxDTO[];
  _ReaduserLists: any[] = [];
  Totalusersearch: string;
  CreatedByOption: number;
  _LoginUserId: number;
  LoginUserName: string
  annou: any = new Date();
  annouEnd: any = new Date();
  check: boolean = false;
  UserSearch:string;
  currentLang:"ar"|"en"="ar";
  ReadUserSearch:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];

  }
  constructor(private inboxService: InboxService, private route: ActivatedRoute,
    public datepipe: DatePipe, private dialog: MatDialog
   , private translate: TranslateService
   , private renderer: Renderer2
   ,@Inject(DOCUMENT) private document: Document,
) {
  

translate.setDefaultLang('en');
    translate.use('en'); // Set initial language
    this._obj = new InboxDTO();
    this._AnnouncementId = this.route.snapshot.params['id'];
    this._LoginUserId = this.currentUserValue.createdby;
    
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    // alert(lang);
    this.translate.use(lang); 
    this.UserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.ReadUserSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    localStorage.setItem('language', lang); 
    if (this.currentLang === 'ar') {
      // alert(lang);
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
    } else if (this.currentLang === 'en') {
      // alert(lang);
      const linkElement = document.getElementById('arabicCssLink');
      if (linkElement && linkElement.parentNode) {
        console.log('Removing Arabic styles');
        this.renderer.removeChild(document.head, linkElement);
      } else {
        console.log('Link element not found or already removed');
      }
    }
    this.GoToAnnouncementDetails(this._AnnouncementId);
    this.date = moment(new Date()).format("DD/MM/YYYY");

    // this.date = this.datepipe.transform(new Date(), 'MM/dd/yyyy');
    // this.date.setDate(this.date.getDate());
    // alert(this.date);
    this.CreatedByOption = this.currentUserValue.createdby;
    this.LoginUserName = this.currentUserValue.FirstName + " " + this.currentUserValue.LastName;
    this._LoginUserId = this.currentUserValue.createdby;

    var dateFrom = this.annou;
    var dateTo = this.annouEnd;
    var dateCheck = this.date;

    var from = Date.parse(dateFrom);
    var to = Date.parse(dateTo);
    var check = Date.parse(dateCheck);

    if ((check <= to && check >= from))




      var myHTML = "<div><h1>Jimbo.</h1>\n<p>That's what she said</p></div>";
    var strippedHtml = myHTML.replace(/<[^>]+>/g, '');
  }


  EditAnounmnt() {
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  closeedit() {
    (<HTMLInputElement>document.getElementById("Kt_reply_Memo")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  closeInfo() {
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

  }
  cleartext() {
    this.Totalusersearch = "";
    this.Readuserserach = "";
  }
  GoToAnnouncementDetails(AnnouncementId: number) {
    // alert(123);

    // const AnnouncementIdsArray = [];
    // AnnouncementIdsArray.push(this.AnnouncementId);
    this._obj.AnnouncementId = AnnouncementId;
    this.inboxService.AnnouncementDetails(AnnouncementId, this.currentUserValue.organizationid, this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        console.log(this._LstToAnnouncement, "AnnouncementdetailsJSON");
      
        this.annou = this._LstToAnnouncement[0]['SStartDate'];
        this.annou = this.datepipe.transform(this.annou, 'yyyy/MM/dd');
        this.annouEnd = this._LstToAnnouncement[0]['SEndDate'];

        var dateFrom = this.annou;
        var dateTo = this.annouEnd;
        var dateCheck = this.date;

        var d1 = dateFrom.split("/");
        var d2 = dateTo.split("/");
        var c = dateCheck.split("/");

        var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
        var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
        var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);
        //  this.check = check
        if (check > from && check < to) {
          this.check = true;
        } else {
          this.check = false;
        }

        // console.log(this.annou, this.annouEnd, "annou123");
        // console.log(check > from && check < to, "12345")
        // if(this.date <= this.annouEnd){
        //   alert(1)
        // }
        // else{
        //   alert(2)
        // }

        // this.annouEnd = moment(this.annouEnd).format("L");
        // this.annouEnd = this.datepipe.transform(this.annouEnd, 'yyyy/MM/dd');
        // this.annou=new Date(this.annou).toDateString;


        // console.log(this._LstToAnnouncement, "Announcementdetailslist")
        // alert(this.annou);
        // alert(this.annouEnd)

      }
    )
  }
  Totalusers(value) {
    this.SelectedSubject = value
    this._LstToAnnouncement.forEach(element => {
      this._TotaluserList = JSON.parse(element.TotalUserJson);
    });
    this.Totalusersearch = "";
  }
  Readusers(value) {
    this.SelectedSubject = value
    this._LstToAnnouncement.forEach(element => {
      this._ReaduserLists = this._LstToAnnouncement[0]['ReadUserJson'];
    });
    this.Readuserserach = "";
  }
  GoToAnnouncementStatus(_AnnouncementId: number, Status: boolean) {
    this._obj.AnnouncementId = _AnnouncementId;

    if (Status === true) {
      this._obj.AnnouncementStatus = false;
      this.String_status = "In-Active";
    }
    else {
      this._obj.AnnouncementStatus = true;
      this.String_status = "Active";
    }
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm ',
        message: this.String_status
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        if (Status === true) {
          Status = false;
        }
        else {
          Status = true;
        }
        this.inboxService.AnnouncementDetailsStatus(this._obj).subscribe(
          data => {
            // console.log(data,"announcementstatus");
            this._obj = data as InboxDTO;
            if (this._obj.message == "1") {
              this.GoToAnnouncementDetails(this._AnnouncementId);
            }
          }
        )
      } 
    });
  }

  LoadDocument(url1: string, filename: string, AnnouncementDocId: number) {
    let name = "Annoucement/View";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let url = encoder.encode(url1);
    // alert(url1)
    // alert(filename)
    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + encoder.encode(filename) + "&type=1" + "&" + "MailDocId=" + 0 + "&" + "MailId=" + 0 + "&" + "LoginUserId=" + this._LoginUserId + "&" + "AnnouncementDocId=" + AnnouncementDocId;
    var myWindow = window.open(myurl, url.toString());
    myWindow.focus();
  }
}
