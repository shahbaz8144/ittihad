import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationDTO } from 'src/app/_models/authentication-dto';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
NewPassword:string = "";
ConfirmPassword:string = "";
  username: string = '';
  email: string = '';
  token: string = '';
  timestamp: string = '';
  userid:number = 0;
  Linkid:number = 0;
  _obj:AuthenticationDTO
  constructor(private route: ActivatedRoute,
     private authenticationService: AuthenticationService,
    private router: Router,
   private _snackBar: MatSnackBar,) {
    this._obj = new AuthenticationDTO()
    }

 LinkExpiry: string = ''; // for countdown display
linkTime!: Date;
timerInterval: any;
linkExpired = false; 
  ngOnInit(): void {
this.route.queryParams.subscribe(params => {
  console.log(params);
  this.username = params['UserName'];
  this.userid = params['UserId'];
  this.Linkid = params['LinkID'];
  this.email = params['UserEmailId'];
   const timestamp = params['DateandTime']; // e.g. "Oct 17 2025, 10:54 AM"

    this.linkTime = new Date(timestamp);

    this.startCountdown();
  // this.timestamp = params['DateandTime']; // e.g. "Oct 17 2025, 10:54 AM"

  // // ✅ Directly convert timestamp to Date
  // const linkTime = new Date(this.timestamp);

  // // Check every minute whether the link expired
  // this.checkLinkExpiry(linkTime);

  // setInterval(() => {
  //   this.checkLinkExpiry(linkTime);
  // }, 60000);
});

  //  this.route.queryParams.subscribe(params => {
  //   console.log(params);
  //     this.username = params['username'];
  //     this.userid = params['UserId'];
  //     this.Linkid = params['LinkID'];
  //     this.email = params['email'];
  //     this.token = params['token'];
  //     this.timestamp = params['ts'];

  //     // Check link expiration
  //     const linkTime = new Date(
  //       this.timestamp.substring(0,4) + '-' +
  //       this.timestamp.substring(4,6) + '-' +
  //       this.timestamp.substring(6,8) + 'T' +
  //       this.timestamp.substring(8,10) + ':' +
  //       this.timestamp.substring(10,12) + ':' +
  //       this.timestamp.substring(12,14) + 'Z'
  //     );

  //     const now = new Date();
  //     const diffMinutes = (now.getTime() - linkTime.getTime()) / (1000 * 30);

  //     if(diffMinutes > 30) {
  //       alert("Link expired! Please request a new reset link.");
  //       // Optionally redirect to login page
  //       this.router.navigate(['/login']);
  //     }
  //   });
  }

  startCountdown() {
  if (this.timerInterval) clearInterval(this.timerInterval); // ✅ Prevent multiple intervals
  this.updateCountdown();
  this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
  // update every second
  // this.timerInterval = setInterval(() => {
  //   this.updateCountdown();
  // }, 1000);
}

updateCountdown() {
    if (this.linkExpired) return; // ✅ Stop if already expired
    const now = new Date();
  const expiryTime = this.linkTime.getTime() + 30 * 60 * 1000; // Link valid for 30 minutes
  const diffMs = expiryTime - now.getTime();

  if (diffMs <= 0) {
    this.LinkExpiry = '00:00';
    clearInterval(this.timerInterval);
    alert('Link expired! Please request a new reset link.');
    this.router.navigate(['/login']);
    return;
  }

  // Calculate minutes and seconds remaining
  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  // Format to MM:SS
  this.LinkExpiry = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  // const now = new Date();
  // const diffMs = this.linkTime.getTime() + 30 * 60 * 1000 - now.getTime(); // 30 min window
  // if (diffMs <= 0) {
  //   this.LinkExpiry = '00:00';
  //   clearInterval(this.timerInterval);
  //   alert("Link expired! Please request a new reset link.");
  //   this.router.navigate(['/login']);
  //   return;
  // }

  // // calculate minutes and seconds
  // const minutes = Math.floor(diffMs / (1000 * 60));
  // const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  // this.LinkExpiry = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
}

padZero(num: number) {
  return num < 10 ? '0' + num : num.toString();
}
// LinkExpiry:any;
//   checkLinkExpiry(linkTime: Date) {
//   const now = new Date();
//   const diffMinutes = (now.getTime() - linkTime.getTime()) / (1000 * 60); // ms → min

//   console.log(`Minutes since link created: ${diffMinutes}`);
//  this.LinkExpiry = diffMinutes;
//   if (diffMinutes > 30) {
//     alert("Link expired! Please request a new reset link.");
//     this.router.navigate(['/login']);
//   }
// }
  showPassword: boolean = false;
 togglePasswordVisibility(show: boolean) {
    this.showPassword = show;
  }

   showPasswords: boolean = false;
 ConfirmtogglePasswordVisibility(show: boolean) {
    this.showPasswords = show;
  }
  ResetPassword() {
  if (!this.NewPassword || !this.ConfirmPassword) {
    alert("Password is required.");
    return;
  }

  if (this.NewPassword !== this.ConfirmPassword) {
    alert("password does not match.");
    return;
  }
  // Prepare object
  this._obj.NewPassword = this.NewPassword;
  this._obj.UserId = this.userid;
  this._obj.LinkId = this.Linkid;

  // Call API
  this.authenticationService.ResetPasswordAPI(this._obj).subscribe({
    next: (data) => {
      console.log(data, "API Data");
   this._snackBar.open('Reset Password Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error(err);
      alert("Failed to reset password. Please try again.");
    }
  });
}

}
