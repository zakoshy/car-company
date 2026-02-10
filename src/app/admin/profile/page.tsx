'use client';

import { useUser, useAuth } from '@/firebase';
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

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name cannot be empty."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user !== undefined) {
      const demoSessionActive = sessionStorage.getItem('demo-admin-logged-in') === 'true';
      setIsDemoMode(demoSessionActive);
      
      if (user) {
        form.reset({ displayName: user.displayName || '' });
      } else if (demoSessionActive) {
        form.reset({ displayName: 'Demo Admin' });
      }
      setIsLoading(false);
    }
  }, [user, form]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const displayUser = user || {
    displayName: 'Demo Admin',
    email: 'admin@example.com',
    photoURL: avatar?.imageUrl,
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) {
      toast({ title: "Demo Mode", description: "Profile photo cannot be changed in demo mode." });
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (isDemoMode) {
      toast({ title: "Demo Mode", description: "Profile cannot be updated in demo mode." });
      return;
    }

    if (!auth?.currentUser || !user) return;
    setIsSubmitting(true);
    try {
      let newPhotoURL = user.photoURL;
      if (photoPreview) {
        newPhotoURL = photoPreview;
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

  if (!user && !isDemoMode) {
      return null;
  }

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
                  <AvatarImage src={photoPreview || displayUser.photoURL || avatar?.imageUrl} alt="User avatar" />
                  <AvatarFallback>
                    <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input id="photo-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoChange} disabled={isDemoMode} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={displayUser.email || ''} readOnly disabled className="cursor-not-allowed bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                {...form.register('displayName')}
                disabled={isDemoMode}
              />
              {form.formState.errors.displayName && (
                <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
              )}
            </div>
             <Button type="submit" disabled={isSubmitting || isDemoMode}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
