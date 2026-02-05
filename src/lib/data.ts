import type { Vehicle } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const vehicles: Vehicle[] = [
  {
    id: "9a7e3b2c-1d9e-4f6b-8c2f-7e9d3b2a1c8e",
    make: "Nissan",
    model: "Skyline GT-R (R34)",
    year: 1999,
    engine: "2.6L Twin-Turbo RB26DETT I6",
    mileage: 68000,
    condition: "Used",
    images: [
      { id: "car-2-1", url: PlaceHolderImages.find(p => p.id === 'car-2-1')?.imageUrl || '', isFeature: true },
      { id: "car-2-2", url: PlaceHolderImages.find(p => p.id === 'car-2-2')?.imageUrl || '', isFeature: false },
    ],
    price: 150000,
    status: "Available",
    inspectionStatus: "Passed",
  },
  {
    id: "3d9e7b1a-8c5f-4e2a-9d3b-1c8e7b2a9d3b",
    make: "Toyota",
    model: "Supra (A80)",
    year: 1998,
    engine: "3.0L Twin-Turbo 2JZ-GTE I6",
    mileage: 82000,
    condition: "Used",
    images: [
      { id: "car-1-1", url: PlaceHolderImages.find(p => p.id === 'car-1-1')?.imageUrl || '', isFeature: true },
      { id: "car-1-2", url: PlaceHolderImages.find(p => p.id === 'car-1-2')?.imageUrl || '', isFeature: false },
    ],
    price: 120000,
    status: "Available",
    inspectionStatus: "Passed",
  },
  {
    id: "1c8e7b2a-9d3b-4f6b-8c2f-3d9e7b1a8c5f",
    make: "Honda",
    model: "NSX",
    year: 1992,
    engine: "3.0L V6 C30A",
    mileage: 55000,
    condition: "Used",
    images: [
      { id: "car-3-1", url: PlaceHolderImages.find(p => p.id === 'car-3-1')?.imageUrl || '', isFeature: true },
      { id: "car-3-2", url: PlaceHolderImages.find(p => p.id === 'car-3-2')?.imageUrl || '', isFeature: false },
    ],
    price: 95000,
    status: "Available",
    inspectionStatus: "Passed",
  },
  {
    id: "8c2f3d9e-7b1a-4f6b-9d3b-1c8e7b2a9d3b",
    make: "Mazda",
    model: "RX-7 (FD)",
    year: 2001,
    engine: "1.3L Twin-Turbo 13B-REW Rotary",
    mileage: 75000,
    condition: "Used",
    images: [
      { id: "car-4-1", url: PlaceHolderImages.find(p => p.id === 'car-4-1')?.imageUrl || '', isFeature: true },
    ],
    price: 65000,
    status: "Incoming",
    inspectionStatus: "Pending",
    arrivalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: "4f6b8c2f-3d9e-7b1a-9d3b-1c8e7b2a9d3b",
    make: "Subaru",
    model: "Impreza WRX STi (GC8)",
    year: 2000,
    engine: "2.0L Turbo EJ207 H4",
    mileage: 110000,
    condition: "Used",
    images: [
      { id: "car-5-1", url: PlaceHolderImages.find(p => p.id === 'car-5-1')?.imageUrl || '', isFeature: true },
    ],
    price: 35000,
    status: "Sold",
    inspectionStatus: "Passed",
    saleDate: "2023-10-15",
    buyerDetails: "John Doe, Anytown, USA",
    finalPrice: 34500,
  },
  {
    id: "7b1a8c5f-3d9e-4f6b-8c2f-9d3b1c8e7b2a",
    make: "Mitsubishi",
    model: "Lancer Evolution VI",
    year: 1999,
    engine: "2.0L Turbo 4G63T I4",
    mileage: 95000,
    condition: "Used",
    images: [
      { id: "car-6-1", url: PlaceHolderImages.find(p => p.id === 'car-6-1')?.imageUrl || '', isFeature: true },
    ],
    price: 45000,
    status: "Incoming",
    inspectionStatus: "Pending",
    arrivalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
   {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    make: "Suzuki",
    model: "Jimny",
    year: 2023,
    engine: "1.5L K15B I4",
    mileage: 5000,
    condition: "New",
    images: [
      { id: "car-7-1", url: PlaceHolderImages.find(p => p.id === 'car-7-1')?.imageUrl || '', isFeature: true },
    ],
    price: 28000,
    status: "Available",
    inspectionStatus: "Passed",
  },
];

export function getVehicles() {
  return vehicles;
}

export function getVehicleById(id: string) {
  return vehicles.find(v => v.id === id);
}
