'use client';

import { useUser, useAuth, useStorage } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, User as UserIcon, Camera } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name cannot be empty."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useUser();
  const auth = useAuth();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const form = useForm<ProfileFormValues>();

  useEffect(() => {
    if (user) {
      form.reset({ displayName: user.displayName || '' });
    }
  }, [user, form]);

  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by layout
  }
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !storage || !user) return null;
    
    toast({ title: 'Uploading new profile photo...' });

    const filePath = `avatars/${user.uid}/${photoFile.name}`;
    const storageRef = ref(storage, filePath);

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.readAsDataURL(photoFile);
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            try {
                const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
                const downloadURL = await getDownloadURL(snapshot.ref);
                resolve(downloadURL);
            } catch (error) {
                console.error("Photo upload failed:", error);
                reject(error);
            }
        };
        reader.onerror = (error) => {
            console.error("File reading failed:", error);
            reject(error);
        };
    });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth?.currentUser) return;
    setIsSubmitting(true);

    try {
      let newPhotoURL = user.photoURL;

      if (photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          newPhotoURL = uploadedUrl;
        }
      }

      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: newPhotoURL,
      });

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      setPhotoPreview(null);
      setPhotoFile(null);
      router.refresh();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and edit your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || user.photoURL || avatar?.imageUrl} alt="User avatar" />
                  <AvatarFallback>
                    <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input id="photo-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ''} readOnly disabled className="cursor-not-allowed bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Controller
                name="displayName"
                control={form.control}
                render={({ field }) => <Input id="displayName" {...field} />}
              />
              {form.formState.errors.displayName && (
                <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
              )}
            </div>
             <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
