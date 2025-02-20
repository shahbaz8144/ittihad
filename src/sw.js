// self.addEventListener('push', event => {
//     const data = event.data.json(); // Assuming your push message has JSON data
//     debugger
//     console.log(data, "data sw");
//     const options = {
//         body: data.body,
//         icon: 'icon-url', // URL of an icon to display
//         // ... other notification options
//     };
//     event.waitUntil(
//         self.registration.showNotification(data.title, options)
//     );
// });

self.addEventListener('install', function(event) {
    console.log("[Service Worker] install.....", event)
});
self.addEventListener('activate', function(event) {
    console.log("[Service Worker] activate.....", event)
    return self.clients.claim();
});
// self.addEventListener('push', function(event) {
//     const payload = event.data ? event.data.text() : 'No payload';
//     console.log(payload, "payload");
//     event.waitUntil(
//         self.registration.showNotification('Notification Title', {
//             body: payload,
//         })
//     );
// });

self.addEventListener('push', function(event) {
    console.log('Push message received:', event);

    // Extract the data payload from the push message
    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    // Define the title and options for the notification
    const title = data.Title || 'Default title';
    const options = {
        body: data.Body || 'Default message',
        icon: 'https://cswebapps.com/dmsweb/assets/media/logos/dms-logo.png',
        data: {
            url: data.Url // Include the URL in the notification data
        }
        // other options
    };

    // Show the notification
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    // Extract the notification and its data
    let notification = event.notification;
    let url = notification.data.url || '/'; // Fallback URL if none provided

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
    notification.close(); // Close the notification after handling the click
});