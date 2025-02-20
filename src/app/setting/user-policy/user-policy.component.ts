import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from 'src/app/_service/users.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-user-policy',
  templateUrl: './user-policy.component.html',
  styleUrls: ['./user-policy.component.css']
})
export class UserPolicyComponent implements OnInit {
  _obj: UserDTO;
  _LstPolicy: UserDTO[];
  currentLang:"ar"|"en"="ar";
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(private userService: UsersService,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this._obj = new UserDTO();
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
     })
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.UserAgreement();
    
  }

  UserAgreement() {
    this._obj.LoginUserId = this.currentUserValue.createdby;
    this.userService.UserPolicyList(this._obj)
      .subscribe(data => {
        this._obj = data as UserDTO;
        var _policyJson = JSON.parse(this._obj.message);
        
        this._LstPolicy = _policyJson;
       
        
      });
  }
}
