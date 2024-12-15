import { firebase } from '@nativescript/firebase';
import { Hospital } from '../../models/interfaces/hospital.interface';

export class AdminService {
  async verifyHospital(hospitalId: string) {
    try {
      await firebase.firestore()
        .collection('hospitals')
        .doc(hospitalId)
        .update({
          isVerified: true,
          verifiedAt: new Date(),
          verifiedBy: firebase.auth().currentUser.uid
        });
    } catch (error) {
      console.error('Error verifying hospital:', error);
      throw error;
    }
  }

  async updateCommissionRate(hospitalId: string, rate: number) {
    try {
      await firebase.firestore()
        .collection('hospitals')
        .doc(hospitalId)
        .update({ commission: rate });
    } catch (error) {
      console.error('Error updating commission rate:', error);
      throw error;
    }
  }

  async getSystemMetrics() {
    try {
      const snapshot = await firebase.firestore().collection('systemMetrics').doc('current').get();
      return snapshot.data();
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  }

  async generateSystemReport(startDate: Date, endDate: Date) {
    try {
      const rides = await firebase.firestore()
        .collection('rides')
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      return this.processSystemReport(rides.docs);
    } catch (error) {
      console.error('Error generating system report:', error);
      throw error;
    }
  }

  private processSystemReport(rides: any[]) {
    return {
      totalRides: rides.length,
      revenue: rides.reduce((sum, ride) => sum + ride.data().price.total, 0),
      commissionEarned: rides.reduce((sum, ride) => sum + ride.data().price.commission, 0),
      averageRidePrice: rides.reduce((sum, ride) => sum + ride.data().price.total, 0) / rides.length
    };
  }
}