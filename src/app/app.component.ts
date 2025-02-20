import { Component } from '@angular/core';
import { UserDTO } from './_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './_service/authentication.service';
import { Router } from '@angular/router';
//import { SwRegistrationOptions } from '@angular/service-worker';
import { InboxDTO } from './_models/inboxdto';
import { InboxService } from './_service/inbox.service';
import { PushNotificationService } from './_service/push-notification-service.service';
import { SwPush } from '@angular/service-worker';
//import { ToMemosComponent } from './communication/to-memos/to-memos.component';
// import { IndexedDBService } from './_service/indexed-db.service';

//import Localbase from 'localbase'
//import { SwPush } from '@angular/service-worker'
// import { PushNotificationService } from './_service/push-notification.service';
// import { environment } from 'src/environments/environment.prod';
// const VAPID_PUBLIC ='BLXCPx46tWrafA63ANwg3YC9WeMgm4NB-BLtCIf3G2i0ppIeEUdvhEwd_ScWxNuat0bLQP32TfykF4m2zmug8sA';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DMS-WEB';
  IscurrentUser: boolean;
  currentUser: UserDTO;
  _obj: InboxDTO;
  _LstToMemos: InboxDTO[];
  _NotificationJson:string;

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUserII: Observable<UserDTO>;
  
  constructor(
    private router: Router,
    private inboxService: InboxService,
    private authenticationService: AuthenticationService
    ,private pushNotificationService: PushNotificationService
    //, private indexedDBService: IndexedDBService
    //, private bnIdle: BnNgIdleService
    ,swPush: SwPush,pushService: PushNotificationService
  ) {
    this.IscurrentUser = false;
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x
    );
    if (this.currentUser != undefined) { this.IscurrentUser = true }

    if (this.IscurrentUser == false) {
      this.router.navigate(['/login']);
    }
    this._obj = new InboxDTO();
    // //checking
    // if (swPush.isEnabled) {
    //   // alert("sw is enabled")
    //   swPush
    //   .requestSubscription({
    //     serverPublicKey: VAPID_PUBLIC,
    //   })
    //   .then(subscription => {
    //     // send subscription to the server
    //     pushService.sendSubscriptionToTheServer(subscription).subscribe();
    //     //var obj={"title":"New Notification","body":"This is the body of the notification","icon":"https://cswebapps.com/dmsweb/assets/media/logos/dms-logo.png"};

    //     //this._NotificationJson=JSON.stringify(obj);
         
    //     navigator.serviceWorker.ready
    //     .then(
    //       (SwRegistration) => SwRegistration.sync.register('Notificationdata')
    //     ).catch(console.log);

    //     // pushService.sendNotificationToTheClient(this._NotificationJson,subscription).subscribe()
    //     })
    //   .catch(console.error);
    // }
    // else{
    //   // alert('SW Not Enabled');
    // }
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  ngOnInit() {
    // this.subscribe();
    // if (environment.production) {
    //   if (location.protocol === 'http:') {
    //     window.location.href = location.href.replace('http', 'https');
    //   }
    // }

    // this.indexedDBService.addUser('Test').then(this.backgroundSync).catch(console.log);
    // let db = new Localbase('db') 
    // db.collection('users').add({
    //   id: 1,
    //   name: 'Bill',
    //   age: 47
    // })
    //this.backgroundSync();
  }

  postSync() {
    //api call
    this.ToMemos(1, 10, 31, '');
  }

  ToMemos(pageNumber: number, CompanyId: number, FromUserId: number, Search: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.Read_F = false;
    this._obj.Conversation_F = false;
    this._obj.All = false;
    this._obj.PageSize = 30;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    this._obj.Description = "DESC";
    this._obj.Search = Search;
    this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = false;
    this._obj.FilterValues = "";

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;
      });
  }
  subscribe() {
    // this.pushNotificationService.subscribeToNotifications();
  }
  
  // backgroundSync() {
  //   navigator.serviceWorker.ready
  //     .then(
  //       (SwRegistration) => SwRegistration.sync.register('post-data')
  //     ).catch(console.log);
  // }
} 
