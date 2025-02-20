 var enableNotificationButtons = document.querySelectorAll('.enable-notifications')

 function displayConformNotification() {
     new Notification('Successfully Subscribed!');
 }

 function askForNotificationPermission() {
     Notification.requestPermission(function(result) {
         console.log('User Choice', result);
         if (result !== 'granted') {
             console.log('No Notification Permission Granted')
         } else {
             displayConformNotification();
         }
     })
 }

 if ('Notification' in window) {
     for (let index = 0; index < enableNotificationButtons.length; index++) {
         enableNotificationButtons[index].style.display = 'block';
         enableNotificationButtons[index].addEventListener('click', askForNotificationPermission);
     }
 }