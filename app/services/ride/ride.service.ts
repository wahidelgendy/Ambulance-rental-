import { firebase } from '@nativescript/firebase';
import { Ride } from '../../models/interfaces/ride.interface';
import { NotificationService } from '../notification/notification.service';
import { PaymentService } from '../payment/payment.service';

export class RideService {
  private notificationService: NotificationService;
  private paymentService: PaymentService;

  constructor() {
    this.notificationService = new NotificationService();
    this.paymentService = new PaymentService();
  }

  async createRide(rideData: Partial<Ride>) {
    try {
      // Create payment intent first
      const paymentIntent = await this.paymentService.createPaymentIntent(rideData.price.total);
      
      const ride = {
        ...rideData,
        status: 'requested',
        createdAt: new Date(),
        paymentIntentId: paymentIntent.id
      };

      const rideRef = await firebase.firestore()
        .collection('rides')
        .add(ride);

      // Notify hospital
      await this.notificationService.sendNotification(ride.hospitalId, {
        title: 'New Ride Request',
        body: `New ride request from ${ride.pickup.address}`
      });

      return { ...ride, id: rideRef.id };
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  }

  async updateRideStatus(rideId: string, status: Ride['status']) {
    try {
      const rideRef = firebase.firestore().collection('rides').doc(rideId);
      
      await rideRef.update({
        status,
        ...(status === 'completed' ? { completedAt: new Date() } : {})
      });

      const ride = (await rideRef.get()).data() as Ride;

      // Send appropriate notifications
      if (status === 'accepted') {
        await this.notificationService.sendNotification(ride.patientPhone, {
          title: 'Ride Accepted',
          body: 'Your ambulance is on the way'
        });
      }
    } catch (error) {
      console.error('Error updating ride status:', error);
      throw error;
    }
  }

  async getActiveRides(hospitalId?: string) {
    try {
      let query = firebase.firestore()
        .collection('rides')
        .where('status', 'in', ['requested', 'accepted', 'in-progress']);

      if (hospitalId) {
        query = query.where('hospitalId', '==', hospitalId);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching active rides:', error);
      throw error;
    }
  }
}