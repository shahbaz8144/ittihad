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
import { AuthenticationDTO } from 'src/app/_models/authentication-dto';


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
  _obj1: AuthenticationDTO
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
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this._obj = new UserDTO;
    this._obj1 = new AuthenticationDTO();

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
    this.InValidPassword = false;
    this.InValidUserName = false;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe({
        next: (data: any) => {
          console.log(data, "Login API Data");

          const userIdRaw = data?.Data?.UserId;
          let _obj1: any[] = [];

          if (userIdRaw && typeof userIdRaw === 'string') {
            try {
              _obj1 = JSON.parse(userIdRaw);
              console.log(JSON.parse(userIdRaw));
            } catch (e) {
              console.error('Failed to parse UserId JSON:', e);
              this.alertService.error('Login response format is invalid.');
              this.loading = false;
              return;
            }
          }

          // ✅ Handle invalid username: if parsed array is empty
          if (!_obj1 || _obj1.length === 0) {
            this.authenticationService.logout();
            this.alertService.error('Invalid Username');
            this.InValidUserName = true;
            this.InValidPassword = false;
            this.loading = false;
            this.cd.detectChanges();
            return;
          }

          // ✅ Handle valid username, now check password
          const user = _obj1[0];
          if (user?.CredentialsIsValid === true) {
            const isPolicy = user.IsPolicy;
            const targetRoute = isPolicy === 1 ? '/userpolicy' : '/backend/dashboard';

            this.router.navigateByUrl(targetRoute);
            this.InValidPassword = false;
            this.InValidUserName = false;
          } else {
            this.authenticationService.logout();
            this.alertService.error('Invalid Password');
            this.InValidPassword = true;
            this.InValidUserName = false;
          }

          this.loading = false;
          this.cd.detectChanges();
        },
        error: err => {
          console.error('Login error:', err);
          this.alertService.error('An error occurred during login.');
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }
  togglePasswordVisibility(show: boolean) {
    this.showPassword = show;
  }
  openNewTab() {
    window.open('https://www.creative-sols.com', '_blank');
  }
  currentLang: "ar" | "en" = "ar";
  ChangelangTo(lang: any) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set document direction
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
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
  SignIn: boolean = true;
  Forgetpassword: boolean = false;
  LoginUsername: string = "";
  LoginUserEMail: string = "";
  UserEmailverify: boolean = false;
  UserName: string = "";
  _LoginUserId: number;
  ForgotPassword() {
    this.Forgetpassword = true;
    this.SignIn = false;
  }

  GetEmail() {
    if (!this.LoginUsername || this.LoginUsername.trim() === '') {
      alert("Please enter a username");
      return;
    }

    this._obj.UserName = this.LoginUsername
    this.authenticationService.GetEmailAPI(this._obj).subscribe(data => {
      console.log(data, "API User Data");
      debugger
      this.LoginUserEMail = data["Data"].Email;
      this.UserName = data["Data"].DisplayName;
      this._LoginUserId = data["Data"].UserId;
      if (data["Data"].Message == 1) {
        this.UserEmailverify = true;
        this.Forgetpassword = false;
      } else if (data["Data"].Message == 2) {
        alert("Invalid UserName");
      }
    })

  }


  LoginUserEmailId: string = '';
  loadings = false;
  message: string = '';
  Emailpopup: boolean = false;
  LinkID: number = 0;
  ResetPasswordLink() {
     
    this._obj1.UserId = this._LoginUserId;
    this._obj1.Link = "https://dms.ittihadclub.sa/ittihadclub/login/resetpassword";
    this.authenticationService.ResetPasswordLinkAPI(this._obj1).subscribe(data => {
      // console.log(data,"API Data Link");
      this.LinkID = data["Data"].LinkId;
      this.sendEmail();
    })
  }


  sendEmail() {
    this._obj1.UserEmailId = this.LoginUserEMail;
    this._obj1.UserName = this.UserName;
    const now = new Date();
    // Format example: "Oct 17 2025 10:41 AM"
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',  // "Oct"
      day: '2-digit',  // "17"
      year: 'numeric', // "2025"
      hour: '2-digit', // "10"
      minute: '2-digit', // "41"
      hour12: true,    // AM/PM format
    };

    const formattedDate = now.toLocaleString('en-US', options).replace(',', '');

    // Example: "Oct 17 2025 10:41 AM"

    const resetUrl = `https://dms.ittihadclub.sa/ittihadclub/resetpassword?UserEmailId=${encodeURIComponent(this.LoginUserEMail)}&UserName=${encodeURIComponent(this.UserName)}&UserId=${this._LoginUserId}&LinkID=${this.LinkID}&DateandTime=${encodeURIComponent(formattedDate)}`;

    this._obj1.ResetLink = resetUrl;
     
    this.loading = true;
    this.loadings = true;
    this.authenticationService.sendResetPasswordEmail(this._obj1).subscribe({
      next: (res) => {
        this.Emailpopup = true;
        this.loading = false;
        this.loadings = false;
        this.message = res.message || 'Email sent successfully!';
      },
      error: (err) => {
        this.loading = false;
        this.loadings = false;
        this.message = err.error?.error || 'Something went wrong!';
      }
    });
  }


  Backtologin() {
    this.UserEmailverify = false;
    this.SignIn = true;
    this.Emailpopup = false;
    this.LoginUsername = "";
    this.LoginUserEMail = "";
  }

  Back() {
    this.Forgetpassword = false;
    this.SignIn = true;
    this.LoginUsername = "";
  }

}
