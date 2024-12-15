import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';

// Initialize Firebase
firebase.init({
  // Add your Firebase configuration here
}).then(() => {
  console.log("Firebase initialized successfully");
}).catch(error => {
  console.error("Firebase initialization error:", error);
});

Application.run({ moduleName: 'app-root' });