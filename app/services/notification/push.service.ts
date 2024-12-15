import { firebase } from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';

export class PushNotificationService {
  async sendEmergencyAlert(ambulanceId: string, message: string) {
    try {
      const ambulance = await firebase.firestore()
        .collection('ambulances')
        .doc(ambulanceId)
        .get();

      if (!ambulance.exists) {
        throw new Error('Ambulance not found');
      }

      await this.sendPriorityNotification(ambulance.data().hospitalId, {
        title: 'EMERGENCY ALERT',
        body: message,
        priority: 'high',
        sound: 'emergency_alert'
      });
    } catch (error) {
      console.error('Emergency alert error:', error);
      throw error;
    }
  }

  async sendBatchNotification(userIds: string[], notification: any) {
    try {
      const tokens = await this.getFCMTokens(userIds);
      
      await fetch('YOUR_BATCH_NOTIFICATION_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'YOUR_SERVER_KEY'
        },
        body: JSON.stringify({
          registration_ids: tokens,
          notification
        })
      });
    } catch (error) {
      console.error('Batch notification error:', error);
      throw error;
    }
  }

  private async getFCMTokens(userIds: string[]): Promise<string[]> {
    const tokens: string[] = [];
    
    for (const userId of userIds) {
      const user = await firebase.firestore()
        .collection('users')
        .doc(userId)
        .get();
        
      if (user.exists && user.data().fcmToken) {
        tokens.push(user.data().fcmToken);
      }
    }
    
    return tokens;
  }

  private async sendPriorityNotification(userId: string, notification: any) {
    const user = await firebase.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!user.exists || !user.data().fcmToken) {
      throw new Error('User FCM token not found');
    }

    await fetch('YOUR_NOTIFICATION_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'YOUR_SERVER_KEY'
      },
      body: JSON.stringify({
        to: user.data().fcmToken,
        notification,
        priority: 'high',
        content_available: true
      })
    });
  }
}