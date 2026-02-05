export type VehicleImage = {
  id: string;
  url: string;
  isFeature: boolean;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  mileage: number;
  condition: 'New' | 'Used' | 'Damaged';
  images: VehicleImage[];
  price: number;
  status: 'Incoming' | 'Available' | 'Sold';
  inspectionStatus: 'Pending' | 'Passed' | 'Failed';
  arrivalDate?: string;
  saleDate?: string;
  buyerDetails?: string;
  finalPrice?: number;
};
