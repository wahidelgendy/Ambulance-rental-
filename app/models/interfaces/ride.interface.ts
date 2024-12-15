export interface Ride {
  id: string;
  patientPhone: string;
  hospitalId: string;
  ambulanceId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  requestedEquipment: string[];
  requestedStaff: string[];
  price: {
    baseFare: number;
    equipmentCost: number;
    distanceCost: number;
    total: number;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}