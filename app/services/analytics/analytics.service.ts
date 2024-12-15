import { firebase } from '@nativescript/firebase';
import { formatDate } from '../../utils/date.utils';

export class AnalyticsService {
  async getHospitalDailyStats(hospitalId?: string) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      
      const query = firebase.firestore()
        .collection('rides')
        .where('createdAt', '>=', startOfDay);

      if (hospitalId) {
        query.where('hospitalId', '==', hospitalId);
      }

      const snapshot = await query.get();
      
      const stats = {
        totalRides: 0,
        totalEarnings: 0,
        completedRides: 0,
        averageResponseTime: 0,
        responseTimeData: [] as number[],
        ridesByHour: new Array(24).fill(0),
        popularLocations: new Map<string, number>()
      };

      snapshot.forEach(doc => {
        const ride = doc.data();
        stats.totalRides++;
        stats.totalEarnings += ride.price.total;

        if (ride.status === 'completed') {
          stats.completedRides++;
          const responseTime = this.calculateResponseTime(ride);
          stats.responseTimeData.push(responseTime);
        }

        const hour = new Date(ride.createdAt.toDate()).getHours();
        stats.ridesByHour[hour]++;

        this.updateLocationStats(stats.popularLocations, ride.pickup.address);
      });

      // Calculate averages and percentages
      stats.averageResponseTime = this.calculateAverage(stats.responseTimeData);

      return stats;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getAdminAnalytics() {
    try {
      const [dailyStats, weeklyStats, monthlyStats] = await Promise.all([
        this.getAggregatedStats('daily'),
        this.getAggregatedStats('weekly'),
        this.getAggregatedStats('monthly')
      ]);

      return {
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
        trends: await this.calculateTrends()
      };
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      throw error;
    }
  }

  private async getAggregatedStats(period: 'daily' | 'weekly' | 'monthly') {
    // Implementation for aggregated statistics
    return {};
  }

  private async calculateTrends() {
    // Implementation for trend analysis
    return {};
  }

  private calculateResponseTime(ride: any): number {
    const requestTime = ride.createdAt.toDate();
    const acceptTime = ride.acceptedAt?.toDate();
    return acceptTime ? (acceptTime.getTime() - requestTime.getTime()) / 1000 : 0;
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((a, b) => a + b) / numbers.length : 0;
  }

  private updateLocationStats(locations: Map<string, number>, address: string) {
    locations.set(address, (locations.get(address) || 0) + 1);
  }
}