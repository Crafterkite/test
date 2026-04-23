'use client';

import React, { useState } from 'react';
import { Settings, User, Building2, Users, CreditCard, Shield, Camera, ChevronRight, Check, TriangleAlert as AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentOrg } from '@/store/org.store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials, stringToColor } from '@/lib/utils';

// Mock team members
const MOCK_MEMBERS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'owner', initials: 'SJ' },
  { id: '2', name: 'Marcus Williams', email: 'marcus@example.com', role: 'admin', initials: 'MW' },
  { id: '3', name: 'Emily Chen', email: 'emily@example.com', role: 'member', initials: 'EC' },
  { id: '4', name: 'David Park', email: 'david@example.com', role: 'viewer', initials: 'DP' },
];

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'info' | 'muted' | 'success'> = {
  owner: 'default',
  admin: 'info',
  member: 'success',
  viewer: 'muted',
};

const BILLING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For small teams getting started',
    features: ['Up to 5 team members', '50 requests/month', '1 GB storage', 'Basic support'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing creative teams',
    features: ['Up to 25 team members', 'Unlimited requests', '50 GB storage', 'Priority support', 'Advanced analytics', 'Custom workflows'],
    current: false,
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Unlimited team members', 'Unlimited requests', 'Unlimited storage', 'Dedicated support', 'SSO/SAML', 'Custom integrations'],
    current: false,
  },
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const currentOrg = useCurrentOrg();

  const userInitials = user ? getInitials(user.firstName, user.lastName) : 'CK';
  const avatarColor = user ? stringToColor(user.id) : '#2563eb';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, organization, and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="h-9 bg-muted/40 border border-border p-1">
          <TabsTrigger value="general" className="text-xs">
            <User className="mr-1.5 h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs">
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ---- General Tab ---- */}
        <TabsContent value="general" className="space-y-5">
          {/* Profile */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                    <AvatarFallback
                      className="text-base font-semibold text-white"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary border-2 border-background">
                    <Camera className="h-3 w-3 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium">Profile picture</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Upload new
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName ?? ''}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName ?? ''}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email ?? ''}
                  className="h-9"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save changes</Button>
            </CardFooter>
          </Card>

          {/* Organization */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>
                Update your organization's name and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="orgName">Organization name</Label>
                <Input
                  id="orgName"
                  defaultValue={currentOrg?.name ?? ''}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="orgSlug">Organization URL</Label>
                <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent text-sm shadow-sm">
                  <span className="flex h-full items-center rounded-l-md border-r border-border bg-muted/30 px-3 text-muted-foreground text-sm select-none whitespace-nowrap">
                    app.crafterkite.io/
                  </span>
                  <input
                    id="orgSlug"
                    type="text"
                    defaultValue={currentOrg?.slug ?? ''}
                    className="flex-1 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save changes</Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                These actions are irreversible. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-destructive/20 p-4">
                <div>
                  <p className="text-sm font-medium">Delete organization</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete this organization and all its data
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Team Tab ---- */}
        <TabsContent value="team" className="space-y-5">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Team members</CardTitle>
                <CardDescription>
                  Manage who has access to your organization
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Invite member
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-1">
                {MOCK_MEMBERS.map((member, idx) => (
                  <div
                    key={member.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/30',
                      idx < MOCK_MEMBERS.length - 1 && 'border-b border-border/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className="text-xs font-semibold text-white"
                          style={{ backgroundColor: stringToColor(member.id) }}
                        >
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={ROLE_BADGE_VARIANT[member.role] ?? 'muted'}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                      {member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Billing Tab ---- */}
        <TabsContent value="billing" className="space-y-5">
          {/* Current Plan */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Current plan</CardTitle>
              <CardDescription>
                You are currently on the Free plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Free Plan</p>
                    <p className="text-xs text-muted-foreground">
                      5 members, 50 requests/month
                    </p>
                  </div>
                </div>
                <Badge variant="muted">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BILLING_PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'relative border',
                  plan.highlighted
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="text-[10px] px-2">Most popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-xs">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.current ? 'outline' : plan.highlighted ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current
                      ? 'Current plan'
                      : plan.name === 'Enterprise'
                      ? 'Contact sales'
                      : `Upgrade to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ---- Security Tab ---- */}
        <TabsContent value="security" className="space-y-5">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
              <CardDescription>
                Update your password regularly to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Repeat new password"
                  className="h-9"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm">Update password</Button>
            </CardFooter>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Two-factor authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50">
                    <Shield className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authenticator app</p>
                    <p className="text-xs text-muted-foreground">
                      Use an authenticator app to generate one-time codes
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Active sessions</CardTitle>
              <CardDescription>
                Manage devices that are logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'San Francisco, CA', current: true, time: 'Now' },
                  { device: 'iPhone 15', location: 'San Francisco, CA', current: false, time: '2 hours ago' },
                ].map((session) => (
                  <div
                    key={session.device}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="success" className="text-[9px] h-3.5 px-1">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.location} · {session.time}
                      </p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10">
                Sign out all other sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
