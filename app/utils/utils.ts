export class Utils {
  static calculateHaversineDistance(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(destination.latitude - origin.latitude);
    const dLon = this.toRad(destination.longitude - origin.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(origin.latitude)) * 
      Math.cos(this.toRad(destination.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRad(value: number): number {
    return value * Math.PI / 180;
  }
}