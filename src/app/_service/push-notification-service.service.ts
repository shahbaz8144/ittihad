import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { NotificationDTO } from '../_models/outsourcedto';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY = this.commonUrl.VAPID_PUBLIC_KEY;
  readonly NotificationRootUrl = this.commonUrl.apiNotificationBrowserUrl;
  _extobj: NotificationDTO;
  constructor(private swPush: SwPush, private http: HttpClient, private commonUrl: ApiurlService) {
    this._extobj = new NotificationDTO();
  }

  subscribeToNotifications(UserId: number) {
    try {
      console.log(this.swPush.isEnabled, "isEnabled");
      if (!this.swPush.isEnabled) {
        console.error('Notification is not enabled');
        return;
      }
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
        .then(subscription => {
          const browserInfo = this.getBrowserInfo();
          console.log(browserInfo,"browserInfo");
          // Send subscription object to your server
          this.sendSubscriptionToServer(subscription, UserId,browserInfo).subscribe(data=>{
            alert('Successfully Subscribed');
          }
          );
        })
        .catch(err =>
          console.error('Could not subscribe to notifications', err)
        );
    } catch (error) {
      console.error('Could not subscribe to notifications', error)
    }
  }
  sendSubscriptionToServer(subscription: PushSubscription, UserId: number,browserInfo:string): any {
    console.log(JSON.stringify(subscription))
    // Implement: Send the subscription object to your server
    // You might use an Angular HTTP service to post this data
    this._extobj.UserId = UserId;
    this._extobj.browserInfo = browserInfo;
    this._extobj.subscription = JSON.stringify(subscription);
    return this.http.post(this.NotificationRootUrl + 'Notifications/NewAddUserSubscription', this._extobj);
  }
  removeSubscriptionFromServer(subscriptionId:number): any {
    this._extobj.subscriptionId = subscriptionId;
    return this.http.post(this.NotificationRootUrl + 'Notifications/NewRemoveUserSubscription', this._extobj);
  }

  GetSubscriptionListFromServer(UserId: number): any {
    this._extobj.UserId = UserId;
    return this.http.post(this.NotificationRootUrl + 'Notifications/NewUserSubscriptions', this._extobj);
  }

  unsubscribeToNotifications(UserId: number) {
    this.swPush.subscription.subscribe(subscription => {
      if (subscription) {
        subscription.unsubscribe().then(success => {
          if (success) {
            console.log('Successfully unsubscribed');
            // Assuming you have the endpoint saved or can derive it from the subscription
            const endpoint = subscription.endpoint;
            // Notify the backend to remove the subscription
            this.removeSubscriptionAfterLogout(subscription, UserId).subscribe(
              () => console.log('Subscription removed from server')
            );
            // this.removeSubscriptionFromServer(endpoint).subscribe(
            //   () => console.log('Subscription removed from server'),
            //   error => console.error('Error removing subscription from server', error)
            // );
          } else {
            console.error('Unsubscribe failed');
          }
        }).catch(err => console.error('Error unsubscribing', err));
      } else {
        console.log('No subscription to unsubscribe');
      }
    });
    // try {
    //   console.log(this.swPush.isEnabled, "isEnabled");
    //   if (!this.swPush.isEnabled) {
    //     console.error('Notification is not enabled');
    //     return;
    //   }
    //   this.swPush.requestSubscription({
    //     serverPublicKey: this.VAPID_PUBLIC_KEY
    //   })
    //     .then(subscription => {
    //       // Send subscription object to your server
    //       alert(0);
    //       console.log(subscription,"logout");
    //       this.removeSubscriptionAfterLogout(subscription, UserId).subscribe();
    //     })
    //     .catch(err =>
    //       console.error('Could not subscribe to notifications', err)
    //     );
    // } catch (error) {
    //   console.error('Could not subscribe to notifications', error)
    // }
  }
  private removeSubscriptionAfterLogout(subscription: PushSubscription,UserId:number): any {
    this._extobj.UserId = UserId;
    this._extobj.subscription = JSON.stringify(subscription);
    //alert('0500');
    console.log(JSON.stringify(subscription),"Logout");
    return this.http.post(this.NotificationRootUrl + 'Notifications/NewUserSubscriptionsOnLogout', this._extobj);
  }
  getBrowserInfo() {
    const ua = navigator.userAgent;
    // Simple detection examples (for more accurate detection you might use a library)
    if (ua.indexOf('Firefox') !== -1) return 'Firefox';
    if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) return 'Opera';
    if (ua.indexOf('Chrome') !== -1) return 'Chrome';
    if (ua.indexOf('Safari') !== -1) return 'Safari';
    if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1) return 'Internet Explorer';
    return 'Unknown';
}
}
