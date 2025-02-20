import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
// import { SpinnerService } from 'src/app/_helpers/spinner.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GuidedTourService } from 'ngx-guided-tour';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { environment } from '../../../environments/environment'
import { PushNotificationService } from 'src/app/_service/push-notification-service.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { LeftSectionComponent } from '../left-section/left-section.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  _obj: InboxDTO;
  _isPolicy: boolean;
  PolicyId: number;
  PolicyHeader: string;
  PolicyContent: string;
  // TourName:string;
  _userdto: UserDTO;
  _LstToAnnouncement: InboxDTO[];
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  showSpinner: boolean;
  UserName: string
  DesignationName: string;
  authenticationService: any;
  UserProfile: string;
  STREAM: string;
  AnnouncementCount: number;
  order: any
  loadAPI: Promise<any>;
LoginUserId:number
  public static languageChanged:EventEmitter<any>=new EventEmitter();

  constructor(private router: Router, @Inject(DOCUMENT) private _document: Document,
    private guidedTourService: GuidedTourService,
    private _apiService: AuthenticationService,
    private inboxService: InboxService
    , private _PushNotificationService: PushNotificationService
    , private translate : TranslateService
    ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._userdto = new UserDTO();
    localStorage.setItem('visitCount', '0'); 

    // this.STREAM = "STREAM";
 const lang:any = localStorage.getItem('language')
    this.translate.use(lang); 
  }

  currentLang:"ar"|"en"="ar";
  storedLanguage:any
  ChangelangTo(lang:any){
    this.currentLang=lang;
    this.translate.use(lang); 
    localStorage.setItem('language', lang); 
    DashboardComponent.ArabicSide.emit(lang);
    HeaderComponent.languageChanged.emit(lang);
  }
  
 

  ngOnInit(): void {

    this.LoginUserId = this.currentUserValue.createdby;
    // const storedUser = JSON.parse(localStorage.getItem('currentUser')) as UserDTO;
    // console.log('Stored User:', storedUser); // Debug the full object
    // console.log('Sharecount:', storedUser?.Sharecount); // Check if Sharecount exists
    // localStorage.setItem('LoginUserId', this.LoginUserId.toString());
    // localStorage.setItem('visitCount', '0');
  //   DashboardComponent.ArabicSide.subscribe((lang:any)=>{
  //     if (lang === 'en') {
  //       this.STREAM ="STREAM"
  //     } else if(lang === 'ar') {
  //       this.STREAM= "تدفق"
  //     }
  //     localStorage.setItem('language', lang); 
  // });
    // const storedLanguage = localStorage.getItem('language');
    // alert(storedLanguage)
    // if(storedLanguage){
    //   this.ChangelangTo(storedLanguage)
    // }
    //  this.storedLanguage = localStorage.getItem('language');
    // alert(this.storedLanguage)
    // if(this.storedLanguage){
    //     if (this.storedLanguage === 'en') {
    //         this.currentLang = this.storedLanguage;
    //         DashboardComponent.ArabicSide.emit(this.storedLanguage);
    //         HeaderComponent.languageChanged.emit(this.storedLanguage);
    //     } else {
    //         this.ChangelangTo(this.storedLanguage);
    //     }
    // } else {
    //     // Set default language to English
    //     this.currentLang = 'en';
    //     DashboardComponent.ArabicSide.emit('en');
    //     HeaderComponent.languageChanged.emit('en');
    // }
   
     this.storedLanguage = localStorage.getItem('language');
    // alert(this.storedLanguage)

  if (this.storedLanguage) {
    this.ChangelangTo(this.storedLanguage);
  } else {
    // Assuming you have a variable to store the user's last language preference before logout
    // const userLanguageBeforeLogout: string = ''; // Set this to the user's last language preference
    if (this.storedLanguage === 'ar') {
      // console.log(userLanguageBeforeLogout);
      this.ChangelangTo('ar'); // Set default language to Arabic
    } else {
      this.ChangelangTo('en'); // Set default language to English
    }
  }
    this.AnnouncementList();
    this.UserName = this.currentUserValue.FirstName + ' ' + this.currentUserValue.LastName;
    this.DesignationName = this.currentUserValue.DesignationName;
    console.log(this.DesignationName,"DesignationName");
    this.UserProfile = this.currentUserValue.UserProfile;
    this.PolicyId = this.currentUserValue.PolicyId;
    if (this.PolicyId == 0)
      this._isPolicy = false;
    else
      this._isPolicy = true;
    this.PolicyHeader = this.currentUserValue.PolicyHeader;
    this.PolicyContent = this.currentUserValue.PolicyContent;
    if (this.currentUserValue.Triggered < 2) {
      setTimeout(() => this.startTour(this.currentUserValue.TourId), 2000);
    }
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });


    // this.ChangelangTo('en');   // by default english.
  }
  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }
    if (!isFound) {
      var dynamicScripts = [environment.assetsurl + "assets/js/app.js"];
      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
  menuopen1() {
    document.getElementById("kt_aside").classList.toggle("kt-aside--on");
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
   
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
    // this.authenticationService.logout();
    // window.location.href="login"
   
    this._PushNotificationService.unsubscribeToNotifications(this.currentUserValue.createdby);
    sessionStorage.clear();
    localStorage.clear(); 
    // localStorage.setItem('language', this.storedLanguage); 
    // alert(this.storedLanguage)
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });
  }

 



  public startTour(value: string) {
    if (value == "HeaderUserSetting") {
      this.guidedTourService.startTour({
        tourId: 'HeaderUserSetting',
        useOrb: false,
        skipCallback: (stepSkippedOn: number) => this.UpdateTourCount(value),
        completeCallback: () => this.UpdateTourCount(value),
        steps: [
          {
            title: 'User Setting Menu',
            selector: '#post1',
            content: 'user can update info,view policies,change week start day and update profile',
            orientation: 'left'
          }
        ]
      });
    }
  }

  UpdateTourCount(_value: string) {
    var data = localStorage.getItem('currentUser');
    if (data != null) {
      let cart = JSON.parse(data);
      cart[0].Triggered = cart[0].Triggered + 1;
      localStorage.setItem('currentUser', JSON.stringify(cart));
    }
    this._userdto.createdby = this.currentUserValue.createdby;
    this._userdto.TourId = _value;
    this._apiService.UpdateTourCount(this._userdto)
      .subscribe(data => {
        this._userdto = data as UserDTO;
        if (this._userdto.TourId != "") {
          var dataII = localStorage.getItem('currentUser');
          if (dataII != null) {
            let cartII = JSON.parse(dataII);
            cartII[0].Triggered = this._userdto.Triggered;
            cartII[0].TourId = this._userdto.TourId;
            localStorage.setItem('currentUser', JSON.stringify(cartII));
          }
        }
      }
      );
  }
  AnnouncementList() {
    this.inboxService.AnnouncementList(this.currentUserValue.organizationid, this.currentUserValue.createdby).subscribe(
      data => {
        // this._obj = data as InboxDTO;
        // this._LstToAnnouncement = JSON.parse(this._obj.AnnoucementJson);
        this._LstToAnnouncement = data["Data"];
        this._LstToAnnouncement = this._LstToAnnouncement["AnnouncementListJson"];
        this.AnnouncementCount = this._LstToAnnouncement[0].AnnoucementCount;
        this._LstToAnnouncement.forEach(element => {
          element.AttachmentJson = JSON.parse(element.AttachmentJson);
          element.Description = element.Description.replace(/<[^>]+>/g, '');
        });
      }
    )
  }
  openanc() {
    document.getElementById("announcebar").classList.add("open_sidebar");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("anc-overlay")[0].classList.add("d-block");
  }

  closeanc() {
    document.getElementById("announcebar").classList.remove("open_sidebar");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("anc-overlay")[0].classList.remove("d-block");
  }

  gotoAnnoucementDetailsV2(name, id) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
}
