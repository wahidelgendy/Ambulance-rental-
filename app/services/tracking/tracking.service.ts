import { firebase } from '@nativescript/firebase';
import { Ambulance } from '../../models/interfaces/ambulance.interface';
import { LocationService } from '../location/location.service';

export class TrackingService {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async updateAmbulanceLocation(ambulanceId: string) {
    try {
      const location = await this.locationService.getCurrentLocation();
      await firebase.firestore()
        .collection('ambulances')
        .doc(ambulanceId)
        .update({
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          lastUpdated: new Date(),
        });
    } catch (error) {
      console.error('Location update error:', error);
      throw error;
    }
  }

  subscribeToAmbulanceLocation(ambulanceId: string, callback: (location: any) => void) {
    return firebase.firestore()
      .collection('ambulances')
      .doc(ambulanceId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data().location);
        }
      });
  }

  async getNearbyAmbulances(location: { latitude: number; longitude: number }, radius: number = 5) {
    // Implementation would depend on your specific requirements and backend setup
    // This is a simplified example
    try {
      const snapshot = await firebase.firestore()
        .collection('ambulances')
        .where('status', '==', 'available')
        .get();

      const ambulances: Ambulance[] = [];
      snapshot.forEach(doc => {
        const ambulance = doc.data() as Ambulance;
        const distance = this.locationService.calculateDistance(location, ambulance.location);
        if (distance <= radius) {
          ambulances.push(ambulance);
        }
      });

      return ambulances;
    } catch (error) {
      console.error('Error getting nearby ambulances:', error);
      throw error;
    }
  }
}