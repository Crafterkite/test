'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wind, Building2, ArrowRight, Info } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/use-organizations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { slugify, cn } from '@/lib/utils';

const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug is too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

export default function CreateOrgPage() {
  const { mutate: createOrg, isPending } = useCreateOrganization();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const orgName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (orgName) {
      setValue('slug', slugify(orgName), { shouldValidate: false });
    }
  }, [orgName, setValue]);

  const onSubmit = (data: CreateOrgFormData) => {
    createOrg(data, {
      onError: (error) => {
        const apiError = error as { message?: string; statusCode?: number };
        if (apiError.statusCode === 409) {
          setError('slug', {
            message: 'This slug is already taken. Please choose another.',
          });
        } else {
          toast({
            title: 'Failed to create organization',
            description: apiError.message ?? 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      {/* Top brand */}
      <div className="mb-12 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Wind className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">Crafterkite</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Building2 className="h-6 w-6 text-primary" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Create your organization
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your organization is the home for your team, brand assets, and
            creative requests.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Org name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Organization name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Acme Creative Studio"
              autoFocus
              className={cn(
                'h-10',
                errors.name && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Organization URL</Label>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Auto-generated from name</span>
              </div>
            </div>
            <div
              className={cn(
                'flex h-10 w-full items-center rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors',
                'focus-within:ring-1 focus-within:ring-ring',
                errors.slug && 'border-destructive focus-within:ring-destructive'
              )}
            >
              <span className="flex h-full items-center rounded-l-md border-r border-border bg-muted/30 px-3 text-muted-foreground text-sm select-none whitespace-nowrap">
                app.crafterkite.io/
              </span>
              <input
                id="slug"
                type="text"
                placeholder="acme-creative"
                className="flex-1 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
                {...register('slug')}
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This will be your organization's unique URL identifier.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-10 gap-2 font-medium mt-2"
            loading={isPending}
          >
            {!isPending && (
              <>
                Create organization
                <ArrowRight className="h-4 w-4" />
              </>
            )}
            {isPending && 'Creating...'}
          </Button>
        </form>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can create additional organizations and invite team members after setup.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center gap-2">
        <div className="h-1.5 w-8 rounded-full bg-muted" />
        <div className="h-1.5 w-8 rounded-full bg-primary" />
        <div className="h-1.5 w-8 rounded-full bg-muted" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Step 2 of 3</p>
    </div>
  );
}
