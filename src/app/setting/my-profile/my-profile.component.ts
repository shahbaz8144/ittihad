import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from 'src/app/_service/users.service';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import tippy from 'node_modules/tippy.js';
import { PushNotificationService } from 'src/app/_service/push-notification-service.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  _obj: UserDTO;
  _objII: InboxDTO;

  _UserDetails: any
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LoginUserId: number;
  _CryptedPassword: string;
  _lstDetails: any;
  workTimeList: any
  worktime: string;
  Day: any;
  DayArr: any = [];
  myFiles: string[] = [];
  Signature: string;
  ReportingUserJson: any;
  UserSubscriptionJson: any;
  _lstMultipleFiales: any;
  File: string;
  Usersearch: string;
  currentLang: "ar" | "en" = "ar";
  CurrentPassword: string;
  RetypePassword: string;
  NewPassword: string;
  _ReportingUserNote: boolean;
  TMSearch: string;
  constructor(private userService: UsersService
    , private authenticationService: AuthenticationService
    , private _snackBar: MatSnackBar
    , public newmemoService: NewMemoService
    , private _PushNotificationService: PushNotificationService,
    private translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {

    this._obj = new UserDTO();
    this._objII = new InboxDTO();
    this._LoginUserId = this.currentUserValue.createdby;
    this._CryptedPassword = this.currentUserValue.Password;
    this.Signature = "https://yrglobaldocuments.blob.core.windows.net/documents/" + this.currentUserValue.Signature;
    this.workTimeList = [];
    this._lstMultipleFiales = [];
    this.ReportingUserJson = [];
    this.UserSubscriptionJson = [];
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.TMSearch = lang === 'en' ? 'Search' : 'يبحث';
      this.CurrentPassword = lang === 'en' ? 'Current Password' : 'كلمة السر الحالية';
      this.NewPassword = lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة';
      this.RetypePassword = lang === 'en' ? 'Retype Password' : 'أعد إدخال كلمة السر';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }

  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.TMSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.CurrentPassword = lang === 'en' ? 'Current Password' : 'كلمة السر الحالية';
    this.NewPassword = lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة';
    this.RetypePassword = lang === 'en' ? 'Retype Password' : 'أعد إدخال كلمة السر';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    tippy('#myButton', {
      content: "Employee ID",
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      // theme: 'tomato',
      animateFill: true,
      inertia: true,
    });

    this.TeamMembers();
    this.LoadUserDetails();
    this.DayArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }
  browsernotification() {
    this._PushNotificationService.GetSubscriptionListFromServer(this.currentUserValue.createdby)
      .subscribe(data => {
        console.log(data, "user sub list");
        this.UserSubscriptionJson = data;
      });
  }
  subscribeToNotifications() {
    this._PushNotificationService.subscribeToNotifications(this.currentUserValue.createdby);
    this.browsernotification();
  }
  deletesubscription(id: number) {
    this._PushNotificationService.removeSubscriptionFromServer(id)
      .subscribe(data => {
        console.log(data, "remove sub");
        this.browsernotification();
      });
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  Rebinddata() {
    this.Usersearch = "";
    this.TeamMembers();
  }
  LoadUserDetails() {
    this._obj.createdby = this.currentUserValue.createdby;
    this.userService.LoadUserDetails(this._obj).subscribe(
      data => {
        this._obj = data as UserDTO;
        this._UserDetails = JSON.parse(this._obj.UserDetailsJson);
        // console.log( this._UserDetails,"ProfileList")
        this.Day = this._UserDetails[0].Day;
        var LSdata = localStorage.getItem('currentUser');
        if (LSdata != null) {
          let cart = JSON.parse(LSdata);
          cart[0].Signature = this._UserDetails[0].Signature;
          cart[0].UserProfile = this._UserDetails[0].UserProfile;
          localStorage.setItem('currentUser', JSON.stringify(cart));
        }
        this.Signature = this._UserDetails[0].Signature;
      }
    )
  }

  myFunction() {
    var x = (<HTMLInputElement>document.getElementById("txtOldPassword"));
    var y = (<HTMLInputElement>document.getElementById("txtNewPassword"));
    var z = (<HTMLInputElement>document.getElementById("txtRetypeNewPassword"));
    if (x.type === "password") {
      x.type = "text";
      y.type = "text";
      z.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
      z.type = "password";
    }

  }
  UpdatePassword() {
    let oldpassword = (<HTMLInputElement>document.getElementById("txtOldPassword")).value;
    let newpassword = (<HTMLInputElement>document.getElementById("txtNewPassword")).value;
    let newpassword2 = (<HTMLInputElement>document.getElementById("txtRetypeNewPassword")).value;
    if (newpassword != newpassword2) {
      alert('new password does not match')
      return false;
    }
    else {


      this._obj.ChryptedOldPassword = this._CryptedPassword;
      this._obj.OldPassWord = oldpassword;
      this._obj.createdby = this._LoginUserId;
      this._obj.NewPassword = newpassword2;
      this.authenticationService.UpdatePassword(this._obj)
        .subscribe(data => {
          //Initialize url data to ArrayList of Model

          this._obj = data as UserDTO;
          if (this._obj.message == "1") {
            this._snackBar.open('User password changed successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
            this.authenticationService.logout();
            location.reload();
          }
        }
        );
    }
  }
  // Work Day Dropdown functionality 
  WorkTimeDrp() {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.Day = this.Day;
    this.userService.WorkTime(this._obj).subscribe(data => {
      this._snackBar.open('First Day oF Week SucessFully', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['blue-snackbar']
      });
    });
  }

  // Add Signature Dropdown functionality 
  FileUploadDoc(event) {
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        this.myFiles.push(event.target.files[index].name);
        var d = new Date().valueOf();
        this._lstMultipleFiales = [...this._lstMultipleFiales, {
          UniqueId: d,
          FileName: event.target.files[index].name,
          Size: event.target.files[index].size,
          Files: event.target.files[index]
        }];
      }
    }
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("fileUpload", this._lstMultipleFiales[i].Files);
    }
    frmData.append("UserId", this.currentUserValue.createdby.toString());
    this.userService.SignatureFileUpload(frmData).subscribe(data => {
      // this.LoadUserDetails();
      this._objII = data as InboxDTO;

      var LSdata = localStorage.getItem('currentUser');
      if (LSdata != null) {
        let cart = JSON.parse(LSdata);
        cart[0].Signature = this._objII.Url;
        localStorage.setItem('currentUser', JSON.stringify(cart));
      }
      this.Signature = this._objII.Url;
      this._snackBar.open('File Upload SucessFully', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['blue-snackbar']
      });
    });
    return false;
  }
  // MyProfileUpload functionality 
  MyProfileUpload(event) {
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        this.myFiles.push(event.target.files[index].name);
        var d = new Date().valueOf();
        this._lstMultipleFiales = [...this._lstMultipleFiales, {
          UniqueId: d,
          FileName: event.target.files[index].name,
          Size: event.target.files[index].size,
          Files: event.target.files[index]
        }];
      }
    }
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("imgUpload", this._lstMultipleFiales[i].Files);
    }
    frmData.append("UserId", this.currentUserValue.createdby.toString());
    this.userService.ProfileUpload(frmData).subscribe(data => {
      console.log(data, "imageurl")
      this._objII = data as InboxDTO;
      this.LoadUserDetails();
    });
  }

  TeamMembers() {
    // if (this.currentUserValue.RoleId == 502) {
    // }
    // else {

    // }
    this._objII.UserId = this.currentUserValue.createdby;
    this.newmemoService.CheckReportingUserCount(this._objII).subscribe(data => {
      console.log(data, "userdata")
      this.ReportingUserJson = JSON.parse(data["ReportingUserJson"]);
    });
  }
}

