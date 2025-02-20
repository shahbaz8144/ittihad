// importScripts('./ngsw-worker.js')
// importScripts('assets/js/localbase.dev.js')

// //db.config.debug = false
// let LoggedUsersdb = new Localbase('pwa-database_users');
// var LoggedUserId = 0;
// let _userObj = [];
// let db = new Localbase('pwa-database')

// self.addEventListener('sync', (event) => {
//     if (event.tag === 'post-data') {
//         //call method
//         console.log('Entered service-worker.js through dashboard');
//         //var intervalID = window.setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2');
//         event.waitUntil(AddData());
//     }
//     if (event.tag === 'Notificationdata') {
//         //call method
//         console.log('Entered Notification service-worker.js');
//         //var intervalID = window.setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2');
//         event.waitUntil(GetNotificationData());
//     }
// })

// function GetNotificationData() {
//     _userObj = {
//         UserId: 65
//     }

//     fetch('http://localhost:3000/sendNotification', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(_userObj)
//         })
//         .then(response => response.json())
//         // .then(data => {
//         //     var _TOMemosJson = JSON.parse(data.MemosJSON);
//         //     _TOMemosJson.forEach(element => {
//         //         db.collection('Notifications' + 31)
//         //             .add(element, element.MailId);
//         //     });
//         // })
//         .catch(() =>
//             Promise.reject()
//         );
// }

// function AddData() {
//     // var intervalId = setInterval(function() {
//     //     ToMemosAPICall();
//     // }, 10000);
// }

// function ToMemosAPICall() {

//     // LoggedUsersdb.collection('users').orderBy('id', 'desc').limit(1).get().then(users => {
//     //     try {
//     //         console.log('Logged Users: ', users[0].userid)
//     //         LoggedUserId = users[0].userid;
//     //     } catch {
//     //         LoggedUserId = 0;
//     //     }
//     // })

//     LoggedUsersdb.collection('users').get().then(users => {
//         var cnt = users.length;
//         //console.log(users[cnt-1])
//         LoggedUserId = users[cnt - 1].userid;
//         console.log('Logged Users: ', LoggedUserId)
//     })

//     let obj = {
//         UserId: LoggedUserId
//     }

//     if (LoggedUserId != 0) {
//         //http://localhost:9562/api/LatestCommunicationAPI/NewGetNewMemosJSON
//         //https://cswebapps.com/dmsapi/api/LatestCommunicationAPI/NewGetNewMemosJSON
//         fetch('https://cswebapps.com/dmsapi/api/LatestCommunicationAPI/NewGetNewMemosJSON', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(obj)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 var _TOMemosJson = JSON.parse(data.MemosJSON);

//                 //db.collection('NewMemosList_' + LoggedUserId).delete();

//                 _TOMemosJson.forEach(element => {
//                     db.collection('NewMemosList_' + LoggedUserId)
//                         .add(element, element.MailId);
//                 });
//                 // var _TotalRecords = JSON.parse(data.TotalRecordsJSON);
//                 // var TotalRecords = _TotalRecords[0].TotalRecords;
//                 // db.collection('TotalRecords_' + 229).add({
//                 //     TotalRecords,
//                 //     TotalRecords
//                 // });

//                 // var _CompanyListJson = JSON.parse(data.CompanyListJSON);
//                 // db.collection('CompanyList_' + 229)
//                 //     .add(_CompanyListJson, 229);

//                 // var _UsersListJson = JSON.parse(data.UserListJSON);
//                 // //_UsersListJson.forEach(element => {
//                 // db.collection('UsersList_' + 229)
//                 //     .add(_UsersListJson, 229);
//                 // //});


//                 // var _TotalRecords = JSON.parse(data.TotalRecordsJSON);
//                 // console.log(_TotalRecords);
//                 // console.log(_TotalRecords[0].TotalRecords);
//                 // db.collection('TotalRecords_' + 229).add(_TotalRecords[0].TotalRecords, _TotalRecords[0].TotalRecords);

//                 //Promise.resolve();
//                 //console.log("DATA____S" + data.json());
//                 //var _TOMemosJson = JSON.parse(data[0][""]);
//             })
//             .catch(() =>
//                 //Promise.reject()
//                 db.collection('users').add({
//                     id: 2,
//                     name: 'Error',
//                     age: 01
//                 })
//             );
//     }
// }



// // function GetDataAndSend() {
// //     let db;
// //     const request = indexedDB.open('my-db');
// //     request.onerror = (event) => {
// //         console.log('Please allow my web to use indexed db....')
// //     };
// //     request.onsuccess = (event) => {
// //         db = event.target.result;
// //         getData(db);
// //     }
// // }

// // function getData(db) {
// //     alert('getData');
// //     const transaction = db.transaction(['user-store']);
// //     const objectstore = transaction.objectstore('user-store');
// //     const request = objectstore.get('name');
// //     request.onerror = (event) => {
// //         alert('error :' + request.result);
// //         //handle errors
// //     }
// //     request.onsuccess = (event) => {
// //         AddData();
// //         console.log('Name of the user is :' + request.result);
// //     }
// // }