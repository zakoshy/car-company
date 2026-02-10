'use client';

import type { Vehicle, Salesperson } from './types';

/**
 * Saves (creates or updates) a vehicle document.
 * NOTE: This is a mock implementation for demo purposes.
 * @param vehicle The vehicle data to save.
 */
export async function saveVehicle(vehicle: Omit<Vehicle, 'id'> & { id?: string }) {
  console.log('Simulating save for vehicle:', vehicle);
  // In a real implementation, this would interact with a database.
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
}

/**
 * Deletes a vehicle document.
 * NOTE: This is a mock implementation for demo purposes.
 * @param vehicleId The ID of the vehicle to delete.
 */
export async function deleteVehicle(vehicleId: string) {
  console.log('Simulating delete for vehicle ID:', vehicleId);
  // In a real implementation, this would interact with a database.
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
}

/**
 * Saves (creates or updates) a salesperson document.
 * NOTE: This is a mock implementation for demo purposes.
 * @param salesperson The salesperson data to save.
 */
export async function saveSalesperson(salesperson: Omit<Salesperson, 'id'> & { id?: string }) {
    console.log('Simulating save for salesperson:', salesperson);
    // In a real implementation, this would interact with a database.
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
}

/**
 * Deletes a salesperson document.
 * NOTE: This is a mock implementation for demo purposes.
 * @param salespersonId The ID of the salesperson to delete.
 */
export async function deleteSalesperson(salespersonId: string) {
    console.log('Simulating delete for salesperson ID:', salespersonId);
    // In a real implementation, this would interact with a database.
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
}
