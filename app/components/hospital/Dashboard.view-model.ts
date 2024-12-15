import { Observable } from '@nativescript/core';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { RideService } from '../../services/ride/ride.service';
import { AmbulanceService } from '../../services/ambulance/ambulance.service';

export class HospitalDashboardViewModel extends Observable {
  private analyticsService: AnalyticsService;
  private rideService: RideService;
  private ambulanceService: AmbulanceService;

  activeRides = [];
  ambulances = [];
  todayStats = {
    rides: 0,
    earnings: 0,
    completionRate: 0,
    averageResponseTime: 0
  };

  constructor() {
    super();
    this.analyticsService = new AnalyticsService();
    this.rideService = new RideService();
    this.ambulanceService = new AmbulanceService();
    this.initializeDashboard();
  }

  private async initializeDashboard() {
    await Promise.all([
      this.loadActiveRides(),
      this.loadAmbulances(),
      this.loadTodayStats()
    ]);
  }

  private async loadActiveRides() {
    const rides = await this.rideService.getActiveRides();
    this.set('activeRides', rides);
  }

  private async loadAmbulances() {
    const ambulances = await this.ambulanceService.getHospitalAmbulances();
    this.set('ambulances', ambulances);
  }

  private async loadTodayStats() {
    const stats = await this.analyticsService.getHospitalDailyStats();
    this.set('todayStats', stats);
  }
}