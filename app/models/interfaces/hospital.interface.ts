export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ambulances: string[]; // Array of ambulance IDs
  isVerified: boolean;
  registrationDate: Date;
  commission: number;
}