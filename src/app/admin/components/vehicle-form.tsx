'use client';

import { useState } from 'react';
import type { Vehicle, VehicleImage, VehicleType } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import {
  AlertCircle,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getMakes } from '@/lib/makes';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { saveVehicle } from '@/lib/mutations';
import { v4 as uuidv4 } from 'uuid';

const vehicleTypes: VehicleType[] = [
  'Coupe',
  'Hatchback',
  'Minivan',
  'Sedan',
  'Pickup',
  'SWagon',
  'SUV',
  'TWagon',
  'Truck',
  'Van',
];

const vehicleFormSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1900, 'Invalid year'),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  chassisNumber: z.string().min(5, 'Chassis number is required.'),
  drivetrain: z.enum(['4x4', '2WD', 'AWD', 'FWD', 'RWD']),
  transmission: z.enum(['Automatic', 'Manual']),
  color: z.string().min(1, 'Color is required'),
  fuel: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']),
  vehicleType: z.enum([
    'Coupe',
    'Hatchback',
    'Minivan',
    'Sedan',
    'Pickup',
    'SWagon',
    'SUV',
    'TWagon',
    'Truck',
    'Van',
  ]),
  mileage: z.coerce.number().nonnegative('Mileage must be a positive number'),
  condition: z.enum(['New', 'Used', 'Damaged']),
  price: z.coerce.number().positive('Price must be a positive number'),
  currency: z.enum(['USD', 'KSh']),
  status: z.enum(['Incoming', 'Available', 'Sold']),
  inspectionStatus: z.enum(['Pending', 'Passed', 'Failed']),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

type ImageFile = {
  id: string;
  file: File;
  previewUrl: string;
};

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const { toast } = useToast();
  const router = useRouter();

  const [existingImages, setExistingImages] = useState<VehicleImage[]>(
    vehicle?.images || []
  );
  const [newImageFiles, setNewImageFiles] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const makes = getMakes();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      referenceNumber: '',
      chassisNumber: '',
      drivetrain: 'RWD',
      transmission: 'Manual',
      color: '',
      fuel: 'Petrol',
      vehicleType: 'Sedan',
      mileage: 0,
      condition: 'Used',
      price: 0,
      currency: 'USD',
      status: 'Available',
      inspectionStatus: 'Pending',
    },
  });

  const uploadImage = async (file: File): Promise<VehicleImage> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing in .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Image upload failed.');
    }

    const data = await response.json();
    return {
      id: data.public_id,
      url: data.secure_url,
      isFeature: false,
    };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const filesToProcess = Array.from(files).map((file) => ({
      id: uuidv4(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImageFiles((prev) => [...prev, ...filesToProcess]);
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

  const removeNewImage = (id: string) => {
    setNewImageFiles((prev) => prev.filter((img) => img.id !== id));
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };
  
  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true);
    
    try {
      if (newImageFiles.length > 0) {
        toast({ title: "Uploading images...", description: "Please wait." });
        const uploadPromises = newImageFiles.map(imageFile => uploadImage(imageFile.file));
        await Promise.all(uploadPromises);
      }
      
      toast({ title: "Saving vehicle data..." });
      await saveVehicle({ ...data, id: vehicle?.id, images: [] }); // Images are not saved in demo

      toast({ title: "Success! (Demo)", description: "Vehicle data has been saved." });
      router.push('/admin/vehicles');
      router.refresh();

    } catch (error: any) {
      console.error("Failed to save vehicle:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message || "Could not save the vehicle. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const allImagePreviews = [
    ...existingImages.map(img => ({ ...img, isNew: false })), 
    ...newImageFiles.map(img => ({ id: img.id, url: img.previewUrl, isFeature: false, isNew: true }))
  ];

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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
            <CardDescription>
              Upload images for the vehicle. The first image will be the
              featured one.
            </CardDescription>
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
                  'w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors',
                  isDragging && 'bg-accent/10 border-accent'
                )}
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WEBP
                </p>
              </label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                disabled={isSubmitting}
              />

              {allImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allImagePreviews.map((img) => (
                    <div
                      key={img.id}
                      className="relative group aspect-video rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={img.url}
                        alt="Vehicle image"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => img.isNew ? removeNewImage(img.id) : removeExistingImage(img.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Vehicle'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
