import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  _LoginUserId:number;
  _CryptedPassword:string
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  _lstDetails:any;
  _objUserdto:UserDTO;
  currentLang:"ar"|"en"="ar";
  CurrentPassword:string;
  RetypePassword:string;
  NewPassword:string;
  constructor(private authenticationService: AuthenticationService
    ,private _snackBar: MatSnackBar,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    ) {
    
    this._LoginUserId = this.currentUserValue.createdby;
    this._CryptedPassword=this.currentUserValue.Password;
    this._objUserdto=new UserDTO();
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
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
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.CurrentPassword = lang === 'en' ? 'Current Password' : 'كلمة السر الحالية';
    this.NewPassword = lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة';
    this.RetypePassword = lang === 'en' ? 'Retype Password' : 'أعد إدخال كلمة السر';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
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
  UpdatePassword(){
    
    (<HTMLInputElement>document.getElementById("gifloader")).style.display="block";
    let oldpassword=(<HTMLInputElement>document.getElementById("txtOldPassword")).value;
    let newpassword=(<HTMLInputElement>document.getElementById("txtNewPassword")).value;
    let newpassword2=(<HTMLInputElement>document.getElementById("txtRetypeNewPassword")).value;
    if(!oldpassword || !newpassword || !newpassword2){
      alert("All fileds are required");
      (<HTMLInputElement>document.getElementById("gifloader")).style.display = "none";
      return false;
    }
    else if(newpassword!=newpassword2){
      alert('new password does not match');
      (<HTMLInputElement>document.getElementById("gifloader")).style.display = "none";
      return false;
    }
    else{
      this._objUserdto.ChryptedOldPassword=this._CryptedPassword;
      this._objUserdto.OldPassWord=oldpassword;
      this._objUserdto.createdby=this._LoginUserId;
      this._objUserdto.NewPassword=newpassword2;
      // (<HTMLInputElement>document.getElementById("gifloader")).style.display="none";
      // (<HTMLInputElement>document.getElementById("checkicon")).style.display="block";
      this.authenticationService.UpdatePassword(this._objUserdto)
      .subscribe(data => {
        //Initialize url data to ArrayList of Model
        // (<HTMLInputElement>document.getElementById("gifloader")).style.display = "none";
        // (<HTMLInputElement>document.getElementById("checkicon")).style.display = "block";
        this._objUserdto = data as UserDTO;
        if (this._objUserdto.message == "1") {
          this._snackBar.open('User password changed successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this.authenticationService.logout();
          location.reload();
        }
        // this._lstDetails = data[0] as UserDTO;
        // alert(this._lstDetails.message)
        //alert(data);
      }
      );
    }
  }

  ClearPasswordss(){
(<HTMLInputElement>document.getElementById("txtOldPassword")).value = "";
(<HTMLInputElement>document.getElementById("txtNewPassword")).value = "";
(<HTMLInputElement>document.getElementById("txtRetypeNewPassword")).value = "";
(<HTMLInputElement>document.getElementById("yourCheckboxId")).checked = false;

  }
}
