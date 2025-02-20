import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

const SERVER_URL = 'http://localhost:3000'
//const SERVER_URL_Send = 'http://localhost:3000/sendNotification'

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) { }

  public sendSubscriptionToTheServer(subscription: PushSubscription) {
    return this.http.post(SERVER_URL + '/subscription', subscription)
  }
  public sendNotificationToTheClient(_json: string,subscription: PushSubscription) {
    // alert(_json);
    // console.log("_Json___"+_json);
    return this.http.post(SERVER_URL + '/sendNotification' , _json,{responseType: 'text'})
  }
}
