import { Injectable } from '@angular/core';
import{ environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiurlService {
  NewbaseUrl= environment.NewbaseUrl;
  baseUrl = environment.baseUrl;
  SignalRUrl = environment.SignalRUrl;
  NotificationBrowserUrl= environment.BrowserNotificationUrl;
  vapidPublicKey= environment.VAPID_PUBLIC_KEY;
  callGetapi: any;
  constructor() { 
  }
  readonly apiurl=this.baseUrl;
  readonly apiurlNew=this.NewbaseUrl;
  readonly Signalurl=this.SignalRUrl;
  readonly apiNotificationBrowserUrl=this.NotificationBrowserUrl;
  readonly VAPID_PUBLIC_KEY=this.vapidPublicKey;
  
  //readonly apiurl='http://localhost:9562/api/'
  //readonly apiurl='http://208.109.13.37/dmsapi/api/'
}
