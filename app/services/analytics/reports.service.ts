import { firebase } from '@nativescript/firebase';
import { formatDate, getDateRange } from '../../utils/date.utils';

export class ReportsService {
  async generateFinancialReport(startDate: Date, endDate: Date) {
    try {
      const rides = await firebase.firestore()
        .collection('rides')
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      return this.processFinancialData(rides.docs);
    } catch (error) {
      console.error('Error generating financial report:', error);
      throw error;
    }
  }

  async generateHospitalPerformanceReport(hospitalId: string) {
    try {
      const { start, end } = getDateRange(30); // Last 30 days
      const rides = await firebase.firestore()
        .collection('rides')
        .where('hospitalId', '==', hospitalId)
        .where('createdAt', '>=', start)
        .where('createdAt', '<=', end)
        .get();

      return this.processHospitalPerformance(rides.docs);
    } catch (error) {
      console.error('Error generating hospital performance report:', error);
      throw error;
    }
  }

  private processFinancialData(rides: any[]) {
    return {
      totalRevenue: rides.reduce((sum, ride) => sum + ride.data().price.total, 0),
      commissionEarned: rides.reduce((sum, ride) => sum + ride.data().price.commission, 0),
      paymentBreakdown: this.categorizePayments(rides),
      dailyRevenue: this.calculateDailyRevenue(rides)
    };
  }

  private processHospitalPerformance(rides: any[]) {
    return {
      totalRides: rides.length,
      completionRate: this.calculateCompletionRate(rides),
      averageResponseTime: this.calculateAverageResponseTime(rides),
      customerRatings: this.aggregateRatings(rides)
    };
  }

  private categorizePayments(rides: any[]) {
    return rides.reduce((acc, ride) => {
      const data = ride.data();
      acc[data.paymentMethod] = (acc[data.paymentMethod] || 0) + data.price.total;
      return acc;
    }, {});
  }

  private calculateDailyRevenue(rides: any[]) {
    return rides.reduce((acc, ride) => {
      const date = formatDate(ride.data().createdAt.toDate());
      acc[date] = (acc[date] || 0) + ride.data().price.total;
      return acc;
    }, {});
  }

  private calculateCompletionRate(rides: any[]) {
    const completed = rides.filter(ride => ride.data().status === 'completed').length;
    return (completed / rides.length) * 100;
  }

  private calculateAverageResponseTime(rides: any[]) {
    const responseTimes = rides
      .map(ride => {
        const data = ride.data();
        return data.acceptedAt ? data.acceptedAt.toDate() - data.createdAt.toDate() : null;
      })
      .filter(time => time !== null);

    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private aggregateRatings(rides: any[]) {
    const ratings = rides
      .map(ride => ride.data().rating)
      .filter(rating => rating !== undefined);

    return {
      average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
      distribution: this.calculateRatingDistribution(ratings)
    };
  }

  private calculateRatingDistribution(ratings: number[]) {
    return ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
  }
}