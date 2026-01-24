importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Dynamic Config Loading
const isLocal = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const apiBase = isLocal ? 'http://localhost:5000/api' : 'https://api.mdtaju.tech/api';

try {
  importScripts(`${apiBase}/config/firebase-sw.js`);
} catch (e) {
  console.error("Failed to load firebase config", e);
}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/profile.jpg', // Use local icon
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
