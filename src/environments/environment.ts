// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
  ,baseUrl:'http://localhost:9562/api/'
  ,NewbaseUrl:'http://localhost:5049/api/'
  // ,baseUrl:'https://cswebapps.com/dmsapi/api/'
  // ,NewbaseUrl:'https://cswebapps.com/dmscoretestapi/api/'
  // ,SignalRUrl:'http://localhost:5049/'
  ,SignalRUrl:'https://cswebapps.com/dmsapitest/'
  ,assetsurl:'../../../'
  ,ImageUrl:'/assets/'
  ,BrowserNotificationUrl:'http://localhost:5093/api/'
  ,VAPID_PUBLIC_KEY:'BKPl7SUq8hqc1BMnJmlHZadQxhR27tBRXGiqiSf9hORpCAnsiwb3TtRlrIME3KU6W-egyqzXoAs7pUPSEcE-Pmo'
  ,Language_file_url:'',
  Container_Name :"documents"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
