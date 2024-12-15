import { Observable } from '@nativescript/core';
import { LocationService } from '../../services/location/location.service';
import { AmbulanceService } from '../../services/ambulance/ambulance.service';

export class BookingMapViewModel extends Observable {
  private locationService: LocationService;
  private ambulanceService: AmbulanceService;
  
  userLocation = { latitude: 0, longitude: 0 };
  nearbyAmbulances = [];

  constructor() {
    super();
    this.locationService = new LocationService();
    this.ambulanceService = new AmbulanceService();
    this.initializeLocation();
  }

  async initializeLocation() {
    try {
      const location = await this.locationService.getCurrentLocation();
      this.userLocation = location;
      this.notifyPropertyChange('userLocation', location);
      this.loadNearbyAmbulances();
    } catch (error) {
      console.error('Location error:', error);
    }
  }

  async loadNearbyAmbulances() {
    try {
      const ambulances = await this.ambulanceService.getNearbyAmbulances(this.userLocation);
      this.set('nearbyAmbulances', ambulances);
    } catch (error) {
      console.error('Error loading ambulances:', error);
    }
  }
}