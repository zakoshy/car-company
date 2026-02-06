"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const vehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  referenceNumber: z.string().min(1, "Reference number is required"),
  chassisNumber: z.string().min(5, "Chassis number must be at least 5 characters."),
  drivetrain: z.enum(["4x4", "2WD", "AWD", "FWD", "RWD"]),
  transmission: z.enum(["Automatic", "Manual"]),
  color: z.string().min(1, "Color is required"),
  fuel: z.enum(["Petrol", "Diesel"]),
  mileage: z.coerce.number().int().nonnegative("Mileage cannot be negative."),
  condition: z.enum(["New", "Used", "Damaged"]),
  status: z.enum(["Incoming", "Available", "Sold"]),
  inspectionStatus: z.enum(["Pending", "Passed", "Failed"]),
  price: z.coerce.number().positive("Price must be a positive number."),
  currency: z.enum(["USD", "KSh"]),
  salespersonId: z.string().optional(),
});

export async function createVehicle(formData: FormData) {
  const validatedFields = vehicleSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // In a real app, you would save this to a database
  console.log("Creating new vehicle:", validatedFields.data);

  revalidatePath("/admin/vehicles");

  return { message: "Vehicle created successfully." };
}


export async function updateVehicle(id: string, formData: FormData) {
  const validatedFields = vehicleSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // In a real app, you would update this in a database
  console.log(`Updating vehicle ${id}:`, validatedFields.data);

  revalidatePath("/admin/vehicles");
  revalidatePath(`/admin/vehicles/${id}/edit`);

  return { message: "Vehicle updated successfully." };
}

export async function deleteVehicle(id: string) {
  // In a real app, you would delete this from a database
  console.log(`Deleting vehicle ${id}`);

  revalidatePath("/admin/vehicles");
  
  return { message: "Vehicle deleted." };
}


const salespersonSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
});

export async function createSalesperson(formData: FormData) {
    const validatedFields = salespersonSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // In a real app, this would create a user in Firebase Auth and a document in Firestore.
    // For now, we just log it.
    console.log("Creating salesperson profile:", validatedFields.data);
    revalidatePath("/admin/salespeople");
    return { message: "Salesperson profile added." };
}

export async function deleteSalesperson(id: string) {
    // In a real app, this would delete the Firestore document.
    // Deleting the Firebase Auth user requires the Admin SDK and a secure backend environment.
    console.log(`Deleting salesperson profile ${id}`);
    revalidatePath("/admin/salespeople");
    return { message: "Salesperson profile deleted." };
}

    