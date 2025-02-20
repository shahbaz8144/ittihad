import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Renderer2 } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from 'src/app/_models/user-dto';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { AlertService } from 'src/app/_service/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  // , changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  _lstUserDetails: UserDTO[];
  tokenFromUI: string = "0123456789123456";
  encrypted: any = "";
  decrypted: any = "";
  _obj: UserDTO;
  InValidPassword = false;
  InValidUserName = false;
  _isPolicy: boolean;
  showPassword: boolean = false;
  Date = new Date();
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
    , private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private translate:TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this._obj = new UserDTO;
    if (this.currentUserSubject.value != null) {
      this.router.navigate(['backend/dashboard']);
    }
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value;
  }
  ngOnInit(): void {
    this.ChangelangTo('en');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/backend/dashboard';
  }
  get f() { return this.loginForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe(data => {
        // console.log(data, "LoginData");
        if (data["Data"]["UserId"].length > 0) {
          // this._lstUserDetails = data[0] as UserDTO[];
          var _json = JSON.parse(data["Data"]["UserId"]);
          let _obj1 = _json;
          if (_obj1[0]["CredentialsIsValid"] == true) {
            if (_obj1[0]["IsPolicy"] == 0) {
              const returnUrlsa = this.route.snapshot.queryParams['returnUrl'] || '/backend/dashboard';
              this.InValidPassword = false;
              this.InValidUserName = false;
              this.router.navigateByUrl('/backend/dashboard');
              this.cd.detectChanges();
            }
            else if (_obj1[0]["IsPolicy"] == 1) {
              const returnUrlsa = this.route.snapshot.queryParams['returnUrl'] || '/userpolicy';
              this.router.navigateByUrl(returnUrlsa);
              this.InValidPassword = false;
              this.InValidUserName = false;
              this.cd.detectChanges();
            }
          }
          else {
            this.authenticationService.logout();
            this.alertService.error('Invalid Password');
            this.loading = false;
            this.InValidPassword = true;
            this.InValidUserName = false;
            this.cd.detectChanges();
          }
        }
        else {
          this.authenticationService.logout();
          this.alertService.error('Invalid UserName');
          this.loading = false;
          this.InValidPassword = false;
          this.InValidUserName = true;
          this.cd.detectChanges();
        }
        // alert(this.currentUserValue.UserProfile);
      }
      );
  }
  togglePasswordVisibility(show: boolean) {
    this.showPassword = show;
  }
  openNewTab() {
    window.open('https://www.creative-sols.com', '_blank');
  }
  currentLang:"ar"|"en"="ar";
  ChangelangTo(lang:any){
    this.currentLang=lang;
    this.translate.use(lang); 
    localStorage.setItem('language', lang); 
    this.currentLang = lang ? lang : 'en';
    this.document.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set document direction
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // if (lang === 'ar') {
    //   this.arabicLeftSection();
    // } else {
    //   this.removeArabicStyles();
    // }
   
  }

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
}
