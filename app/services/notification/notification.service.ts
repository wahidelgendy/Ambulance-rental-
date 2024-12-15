import { firebase } from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';

export class NotificationService {
  async initialize() {
    try {
      const token = await firebase.messaging().getToken();
      await this.updateFCMToken(token);

      firebase.messaging().onTokenRefresh(async (token) => {
        await this.updateFCMToken(token);
      });

      this.setupMessageHandlers();
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  private async updateFCMToken(token: string) {
    const user = firebase.auth().currentUser;
    if (user) {
      await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          fcmToken: token,
        });
    }
  }

  private setupMessageHandlers() {
    firebase.messaging().onMessage(async (message) => {
      await this.showLocalNotification(message);
    });
  }

  private async showLocalNotification(message: any) {
    await LocalNotifications.schedule([{
      id: Date.now(),
      title: message.notification.title,
      body: message.notification.body,
      badge: 1,
    }]);
  }

  async sendNotification(userId: string, notification: { title: string; body: string }) {
    try {
      const userDoc = await firebase.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const fcmToken = userDoc.data().fcmToken;
      
      await fetch('YOUR_NOTIFICATION_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'YOUR_SERVER_KEY',
        },
        body: JSON.stringify({
          to: fcmToken,
          notification: {
            title: notification.title,
            body: notification.body,
          },
        }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}