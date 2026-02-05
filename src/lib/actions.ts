"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const vehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive("Price must be a positive number."),
  mileage: z.coerce.number().int().nonnegative("Mileage cannot be negative."),
  engine: z.string().min(3, "Engine details are required."),
  condition: z.enum(["New", "Used", "Damaged"]),
  status: z.enum(["Incoming", "Available", "Sold"]),
  inspectionStatus: z.enum(["Pending", "Passed", "Failed"]),
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
