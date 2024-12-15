// Database Schemas

interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ambulances: Ambulance[];
  isVerified: boolean;
  registrationDate: Date;
  commission: number;
}

interface Ambulance {
  id: string;
  hospitalId: string;
  vehicleNumber: string;
  type: 'basic' | 'advanced' | 'critical';
  status: 'available' | 'busy' | 'maintenance';
  location: {
    latitude: number;
    longitude: number;
  };
  equipment: Equipment[];
  staff: Staff[];
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  additionalCost: number;
}

interface Staff {
  id: string;
  name: string;
  role: 'driver' | 'paramedic' | 'nurse' | 'doctor';
  specialization?: string;
  isAvailable: boolean;
}

interface Ride {
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

interface Payment {
  id: string;
  rideId: string;
  amount: number;
  hospitalShare: number;
  platformCommission: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export {
  Hospital,
  Ambulance,
  Equipment,
  Staff,
  Ride,
  Payment
};