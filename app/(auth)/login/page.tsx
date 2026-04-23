'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wind, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isHydrated, router]);

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        const apiError = error as { message?: string; statusCode?: number };
        if (apiError.statusCode === 401) {
          setError('email', { message: '' });
          setError('password', { message: 'Invalid email or password' });
        } else {
          toast({
            title: 'Sign in failed',
            description: apiError.message ?? 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1829 50%, #0a0a0f 100%)',
        }}
      >
        {/* Decorative background elements */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(37, 99, 235, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/20">
            <Wind className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Crafterkite
          </span>
        </div>

        {/* Tagline */}
        <div className="relative">
          <blockquote className="space-y-4">
            <p className="text-3xl font-semibold leading-tight text-white">
              Your creative operations,{' '}
              <span className="text-primary">elevated.</span>
            </p>
            <p className="text-base text-white/50 leading-relaxed max-w-sm">
              The premium OS for creative teams. Manage requests, brand assets,
              and workflows — all in one place.
            </p>
          </blockquote>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap gap-2">
            {['Brand Assets', 'Request Tracking', 'Team Collaboration', 'Multi-workspace'].map(
              (feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>

        {/* Bottom attribution */}
        <div className="relative">
          <p className="text-xs text-white/30">
            Trusted by creative teams worldwide
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Wind className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">Crafterkite</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
                className={cn(
                  'h-10',
                  errors.email && 'border-destructive focus-visible:ring-destructive'
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    'h-10 pr-10',
                    errors.password && 'border-destructive focus-visible:ring-destructive'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 gap-2 font-medium"
              loading={isPending}
            >
              {!isPending && (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
              {isPending && 'Signing in...'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                New to Crafterkite?
              </span>
            </div>
          </div>

          {/* Register link */}
          <Link href="/register">
            <Button
              variant="outline"
              className="w-full h-10 font-medium"
            >
              Create an account
            </Button>
          </Link>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
