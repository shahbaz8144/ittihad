import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { InboxService } from 'src/app/_service/inbox.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationDTO } from 'src/app/_models/authentication-dto';
import { InboxDTO } from 'src/app/_models/inboxdto';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  PolicyId:number;
  PolicyHeader:string;
  PolicyContent:string;
  currentLoginUser: UserDTO;
  _obj:AuthenticationDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  displayStyle = "none";
  obj: InboxDTO;

  constructor(
   public inboxService: InboxService,
    private router: Router
    , private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentLoginUser = x);
    //alert(this.currentUserValue.PolicyHeader);
    this._obj=new AuthenticationDTO();
    this.obj=new InboxDTO();
   }
  
  ngOnInit(): void {
     
    this.displayStyle = "block";
    
    this.PolicyId=this.currentUserValue.PolicyId;
    this.PolicyHeader=this.currentUserValue.PolicyHeader;
    this.PolicyContent=this.currentUserValue.PolicyContent;
  }

  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  Agreement(_val:number){
    if(_val==1){
      this.inboxService.UserAgreementPolicy(this.PolicyId,this.currentUserValue.createdby).subscribe(data => {
        this.obj = data as InboxDTO;
        if (this.obj.message == "1") {
  
          var datauser = localStorage.getItem('currentUser');
          if (datauser != null) {
            let cart = JSON.parse(datauser);
            cart[0].PolicyId = this.obj.PolicyId;
            cart[0].PolicyHeader = this.obj.PolicyHeader;
            cart[0].PolicyContent = this.obj.PolicyContent;
            cart[0].IsPolicy = this.obj.IsPolicy;
            localStorage.setItem('currentUser', JSON.stringify(cart));
          }
          if (this.currentUserValue.IsPolicy == true) {
            
            this.PolicyId=this.obj.PolicyId;
            this.PolicyHeader=this.obj.PolicyHeader;
            this.PolicyContent=this.obj.PolicyContent;
          }
          else{
            return this.router.navigate(['backend/dashboard']);
          }
        }
      })
    }
    else{
      this.authenticationService.logout();
      return this.router.navigate(['login']);
    }
  }
}
