import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  UserId: any;
  _obj: UserRegistrationDTO;
  ObjgetReportingUser: any;
 

  constructor(public services: UserRegistrationService,  private route: ActivatedRoute,) {
    this.UserId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    alert(1);
    // document.getElementById("proview").style.display="block";
  }
 
  GetUserpersonalDetails(UserId) {
    
    this._obj.UserId = UserId;
    this.services.GetReportingUser(this._obj)
      .subscribe(data => {
        
       
      });
  }

  closeInfo() {
    document.getElementById("proview").style.display="none";
    // document.getElementById("proview").classList.remove("kt-quick-panel--on");
    // document.getElementById("scrd").classList.remove("position-fixed");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  // editprof() {
  //   document.getElementById("proset").classList.toggle("pronew");
  //   document.getElementById("prodetails").classList.toggle("pronew");
  //   document.querySelector("tabs_li").classList.toggle("tab_one");
  //   // document.getElementById("editpro").innerHTML= "<i class='fas fa-users'></i>View Profile";
  // }

}
