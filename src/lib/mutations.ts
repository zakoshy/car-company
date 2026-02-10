'use client';

import type { Vehicle, Salesperson } from './types';
import {
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Saves (creates or updates) a vehicle document.
 * @param db The Firestore instance.
 * @param vehicle The vehicle data to save.
 */
export async function saveVehicle(
  db: Firestore,
  vehicle: Omit<Vehicle, 'id' | 'updatedAt'> & { id?: string }
) {
  const { id, ...vehicleData } = vehicle;
  const dataToSave = {
    ...vehicleData,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    // Update existing vehicle
    const vehicleRef = doc(db, 'vehicles', id);
    setDoc(vehicleRef, dataToSave, { merge: true }).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: vehicleRef.path,
        operation: 'update',
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error; // Re-throw original error for other catch blocks
    });
  } else {
    // Create new vehicle
    const collectionRef = collection(db, 'vehicles');
    addDoc(collectionRef, dataToSave).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    });
  }
}

/**
 * Deletes a vehicle document.
 * @param db The Firestore instance.
 * @param vehicleId The ID of the vehicle to delete.
 */
export async function deleteVehicle(db: Firestore, vehicleId: string) {
  const vehicleRef = doc(db, 'vehicles', vehicleId);
  deleteDoc(vehicleRef).catch((error) => {
    const permissionError = new FirestorePermissionError({
      path: vehicleRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });
}

/**
 * Saves (creates or updates) a salesperson document.
 * @param db The Firestore instance.
 * @param salesperson The salesperson data to save.
 */
export async function saveSalesperson(
  db: Firestore,
  salesperson: Omit<Salesperson, 'id'> & { id?: string }
) {
  const { id, ...salespersonData } = salesperson;
  if (id) {
    const salespersonRef = doc(db, 'salespeople', id);
    setDoc(salespersonRef, salespersonData, { merge: true }).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: salespersonRef.path,
        operation: 'update',
        requestResourceData: salespersonData,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    });
  } else {
    const collectionRef = collection(db, 'salespeople');
    addDoc(collectionRef, salespersonData).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: salespersonData,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    });
  }
}

/**
 * Deletes a salesperson document.
 * @param db The Firestore instance.
 * @param salespersonId The ID of the salesperson to delete.
 */
export async function deleteSalesperson(db: Firestore, salespersonId: string) {
  const salespersonRef = doc(db, 'salespeople', salespersonId);
  deleteDoc(salespersonRef).catch((error) => {
    const permissionError = new FirestorePermissionError({
      path: salespersonRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });
}
