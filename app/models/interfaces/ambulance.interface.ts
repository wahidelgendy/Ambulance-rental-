export interface Ambulance {
  id: string;
  hospitalId: string;
  vehicleNumber: string;
  type: 'basic' | 'advanced' | 'critical';
  status: 'available' | 'busy' | 'maintenance';
  location: {
    latitude: number;
    longitude: number;
  };
  equipment: string[]; // Array of equipment IDs
  staff: string[]; // Array of staff IDs
}