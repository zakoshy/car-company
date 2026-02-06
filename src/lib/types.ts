export type VehicleImage = {
  id: string;
  url: string;
  isFeature: boolean;
};

export type Salesperson = {
  id:string;
  name: string;
  email: string;
  userId?: string;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  referenceNumber: string;
  chassisNumber: string;
  drivetrain: '4x4' | '2WD' | 'AWD' | 'FWD' | 'RWD';
  transmission: 'Automatic' | 'Manual';
  color: string;
  fuel: 'Petrol' | 'Diesel';
  mileage: number;
  condition: 'New' | 'Used' | 'Damaged';
  images: VehicleImage[];
  price: number;
  currency: 'USD' | 'KSh';
  status: 'Incoming' | 'Available' | 'Sold';
  inspectionStatus: 'Pending' | 'Passed' | 'Failed';
  arrivalDate?: string;
  saleDate?: string;
  buyerDetails?: string;
  finalPrice?: number;
  salespersonId?: string;
};

    