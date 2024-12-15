import { Geolocation } from '@nativescript/geolocation';
import { Utils } from '../../utils/utils';

export class LocationService {
  async getCurrentLocation() {
    try {
      const location = await Geolocation.getCurrentLocation({
        desiredAccuracy: 3,
        maximumAge: 5000,
        timeout: 10000
      });
      return location;
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  }

  calculateDistance(origin: { latitude: number; longitude: number }, 
                   destination: { latitude: number; longitude: number }): number {
    return Utils.calculateHaversineDistance(origin, destination);
  }
}