"use client";

import { useState } from "react";
import type { Vehicle, VehicleType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { optimizeImageAndFlag } from "@/ai/flows/image-optimization-and-flagging";
import Image from "next/image";
import { AlertCircle, CheckCircle, UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createVehicle, updateVehicle } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { getMakes } from "@/lib/data";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

const vehicleTypes: VehicleType[] = ["Coupe", "Hatchback", "Minivan", "Sedan", "Pickup", "SWagon", "SUV", "TWagon", "Truck", "Van"];

const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900, "Invalid year"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  chassisNumber: z.string().min(5, "Chassis number is required."),
  drivetrain: z.enum(["4x4", "2WD", "AWD", "FWD", "RWD"]),
  transmission: z.enum(["Automatic", "Manual"]),
  color: z.string().min(1, "Color is required"),
  fuel: z.enum(["Petrol", "Diesel", "Hybrid", "Electric", "LPG"]),
  vehicleType: z.enum(["Coupe", "Hatchback", "Minivan", "Sedan", "Pickup", "SWagon", "SUV", "TWagon", "Truck", "Van"]),
  mileage: z.coerce.number().nonnegative("Mileage must be a positive number"),
  condition: z.enum(["New", "Used", "Damaged"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  currency: z.enum(["USD", "KSh"]),
  status: z.enum(["Incoming", "Available", "Sold"]),
  inspectionStatus: z.enum(["Pending", "Passed", "Failed"]),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

type ImagePreview = {
  fileName: string;
  dataUri: string;
  flagged?: boolean;
  reason?: string;
};

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const makes = getMakes();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle || {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      referenceNumber: "",
      chassisNumber: "",
      drivetrain: "RWD",
      transmission: "Manual",
      color: "",
      fuel: "Petrol",
      vehicleType: "Sedan",
      mileage: 0,
      condition: "Used",
      price: 0,
      currency: "USD",
      status: "Available",
      inspectionStatus: "Pending",
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const filesToProcess = Array.from(files).filter(
      (file) => !imagePreviews.some((p) => p.fileName === file.name)
    );

    if (filesToProcess.length === 0) return;

    const fileProcessingPromises = filesToProcess.map((file) => {
      return new Promise<ImagePreview>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          if (!dataUri) return reject(new Error('Failed to read file.'));
          try {
            const result = await optimizeImageAndFlag({ imageDataUri: dataUri });
            resolve({
              fileName: file.name,
              dataUri: result.optimizedImageDataUri || dataUri,
              flagged: result.flagForReview,
              reason: result.reason,
            });
          } catch (error) {
            resolve({
              fileName: file.name,
              dataUri,
              flagged: true,
              reason: 'Optimization failed.',
            });
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    try {
      const newPreviews = await Promise.all(fileProcessingPromises);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        variant: 'destructive',
        title: 'Image Upload Error',
        description: 'There was a problem reading one of the files.',
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeImage = (fileName: string) => {
    setImagePreviews(previews => previews.filter(p => p.fileName !== fileName));
  };

  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      const result = vehicle 
        ? await updateVehicle(vehicle.id, formData)
        : await createVehicle(formData);
      
      if ('message' in result) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.push("/admin/vehicles");
      } else {
        throw new Error("An unknown error occurred.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Make</FormLabel>
                <Combobox
                  options={makes.map((make) => ({ value: make, label: make }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a make"
                  searchPlaceholder="Search makes..."
                  emptyText="No make found."
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chassisNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chassis Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="drivetrain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drivetrain</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="4x4">4x4</SelectItem>
                    <SelectItem value="2WD">2WD</SelectItem>
                    <SelectItem value="AWD">AWD</SelectItem>
                    <SelectItem value="FWD">FWD</SelectItem>
                    <SelectItem value="RWD">RWD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="fuel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage (km)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="KSh">KSh</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inspectionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Images</CardTitle>
            <CardDescription>Upload images for the vehicle. The first image will be the featured one.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <label
                  htmlFor="file-upload"
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={cn(
                      "w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors",
                      isDragging && "bg-accent/10 border-accent"
                  )}
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP</p>
              </label>
              <Input id="file-upload" type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((img) => (
                    <div key={img.fileName} className="relative group aspect-video rounded-lg overflow-hidden border">
                      <Image src={img.dataUri} alt={img.fileName} fill className="object-cover" />
                      <div className="absolute top-1 right-1">
                        <Button variant="destructive" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(img.fileName)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {img.flagged ? (
                        <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center p-2 text-destructive-foreground text-center">
                          <AlertCircle className="h-6 w-6" />
                          <p className="text-xs font-semibold mt-1">{img.reason}</p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
