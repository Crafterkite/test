'use client';

import React, { useState } from 'react';
import { User, Building2, Users, CreditCard, Shield, Camera, Save, Mail, Trash2, Plus, ChevronRight, Check, TriangleAlert as AlertTriangle, Globe, Bell, Eye, EyeOff, LogOut, Crown } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type SettingsTab = 'profile' | 'organization' | 'team' | 'billing' | 'security';

const TABS: { key: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'organization', label: 'Organization', icon: Building2 },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'security', label: 'Security', icon: Shield },
];

const MOCK_MEMBERS = [
  { id: '1', name: 'Sarah Miller', email: 'sarah@acme.com', role: 'Admin', avatar: '', status: 'active', joinedAt: '2024-01-15' },
  { id: '2', name: 'James Park', email: 'james@acme.com', role: 'Member', avatar: '', status: 'active', joinedAt: '2024-02-20' },
  { id: '3', name: 'Aria Johnson', email: 'aria@acme.com', role: 'Member', avatar: '', status: 'active', joinedAt: '2024-03-01' },
  { id: '4', name: 'tom@external.com', email: 'tom@external.com', role: 'Viewer', avatar: '', status: 'pending', joinedAt: '' },
];

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-[13px] font-medium text-foreground">{label}</label>
      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ defaultValue, placeholder, type = 'text' }: { defaultValue?: string; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
    />
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const initials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'CK';
  const avatarColor = user ? stringToColor(user.id) : '#2563eb';

  return (
    <div className="space-y-4">
      <SectionCard title="Personal Information" description="Update your name, email, and profile photo">
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-opacity hover:bg-primary/90">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{user ? `${user.firstName} ${user.lastName}` : 'Your Name'}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{user?.email}</p>
              <button className="mt-1.5 text-[12px] text-primary hover:underline">Change photo</button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup label="First Name">
              <TextInput defaultValue={user?.firstName} placeholder="First name" />
            </FieldGroup>
            <FieldGroup label="Last Name">
              <TextInput defaultValue={user?.lastName} placeholder="Last name" />
            </FieldGroup>
          </div>

          <FieldGroup label="Email Address">
            <TextInput defaultValue={user?.email} placeholder="your@email.com" type="email" />
          </FieldGroup>

          <FieldGroup label="Job Title">
            <TextInput placeholder="e.g. Creative Director" />
          </FieldGroup>
        </div>

        <div className="mt-5 flex justify-end">
          <Button size="sm" className="gap-2">
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Notification Preferences" description="Choose what you want to be notified about">
        <div className="space-y-3">
          {[
            { label: 'Request updates', description: 'When a request status changes', defaultOn: true },
            { label: 'New comments', description: 'When someone comments on a request', defaultOn: true },
            { label: 'Team mentions', description: 'When you are mentioned in a comment', defaultOn: true },
            { label: 'Weekly digest', description: 'Summary of activity every Monday', defaultOn: false },
          ].map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/50 px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                <p className="text-[12px] text-muted-foreground">{item.description}</p>
              </div>
              <button
                className={cn(
                  'relative h-5 w-9 flex-shrink-0 rounded-full transition-colors',
                  item.defaultOn ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                    item.defaultOn ? 'translate-x-4' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone" description="Irreversible and destructive actions">
        <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">Delete account</p>
            <p className="text-[12px] text-muted-foreground">Permanently delete your account and all associated data</p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2 flex-shrink-0">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

function OrganizationTab() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const orgInitials = currentOrg ? getInitials(currentOrg.name) : 'CK';
  const orgColor = currentOrg ? stringToColor(currentOrg.id) : '#2563eb';

  return (
    <div className="space-y-4">
      <SectionCard title="Organization Details" description="Basic information about your organization">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white"
              style={{ backgroundColor: orgColor }}
            >
              {orgInitials}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-foreground">{currentOrg?.name ?? 'Your Organization'}</p>
              <p className="text-[12px] text-muted-foreground">slug: {currentOrg?.slug ?? 'your-org'}</p>
            </div>
          </div>
          <FieldGroup label="Organization Name">
            <TextInput defaultValue={currentOrg?.name} placeholder="Organization name" />
          </FieldGroup>
          <FieldGroup label="Slug" hint="Used in URLs and API references. Cannot be changed after creation.">
            <div className="flex h-9 items-center rounded-lg border border-border bg-muted/30 px-3">
              <span className="text-[13px] text-muted-foreground">crafterkite.io/</span>
              <span className="text-[13px] text-foreground">{currentOrg?.slug ?? 'your-org'}</span>
            </div>
          </FieldGroup>
          <FieldGroup label="Website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                placeholder="https://yourcompany.com"
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </FieldGroup>
        </div>
        <div className="mt-5 flex justify-end">
          <Button size="sm" className="gap-2">
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone" description="Destructive organization actions">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-foreground">Delete organization</p>
              <p className="text-[12px] text-muted-foreground">Permanently delete this organization and all its data</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2 flex-shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Team Members"
        description="Manage who has access to your organization"
      >
        <div className="space-y-2">
          {MOCK_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-4 py-3">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ backgroundColor: stringToColor(member.id) }}
              >
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {member.status === 'pending' ? member.email : member.name}
                </p>
                <p className="truncate text-[11.5px] text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {member.status === 'pending' && (
                  <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                    Pending
                  </span>
                )}
                <select
                  defaultValue={member.role}
                  className="h-7 rounded-md border border-border bg-card px-2 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-border bg-background/30 px-4 py-3">
          <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <input
            type="email"
            placeholder="Invite by email address..."
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
            <Plus className="h-3.5 w-3.5" />
            Invite
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Roles & Permissions" description="Understand what each role can do">
        <div className="space-y-2">
          {[
            { role: 'Admin', desc: 'Full access to all features, settings, and billing', color: 'bg-red-400/10 text-red-400' },
            { role: 'Member', desc: 'Can create requests, manage brand profiles, and view everything', color: 'bg-blue-400/10 text-blue-400' },
            { role: 'Viewer', desc: 'Read-only access. Cannot create or modify any content', color: 'bg-muted text-muted-foreground' },
          ].map((item) => (
            <div key={item.role} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/30 px-4 py-3">
              <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', item.color)}>
                {item.role}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Current Plan">
        <div className="flex items-center justify-between rounded-xl bg-primary/[0.08] border border-primary/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">Pro Plan</p>
              <p className="text-[12.5px] text-muted-foreground">$49/month · Renews Jan 1, 2025</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Manage</Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Team Members', used: 4, limit: 10 },
            { label: 'Brand Profiles', used: 3, limit: 10 },
            { label: 'Storage', used: '2.4 GB', limit: '50 GB' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-[14px] font-semibold text-foreground mt-0.5">
                {item.used} <span className="text-[11px] font-normal text-muted-foreground">/ {item.limit}</span>
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Plans" description="Upgrade or downgrade anytime">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: 'Starter', price: '$0', features: ['3 team members', '2 brand profiles', '5 GB storage'], current: false },
            { name: 'Pro', price: '$49', features: ['10 team members', '10 brand profiles', '50 GB storage', 'Priority support'], current: true },
            { name: 'Enterprise', price: 'Custom', features: ['Unlimited members', 'Unlimited profiles', '1 TB storage', 'Dedicated support', 'SSO & SAML'], current: false },
          ].map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-xl border p-4',
                plan.current ? 'border-primary bg-primary/5' : 'border-border bg-background/50'
              )}
            >
              {plan.current && (
                <div className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Current
                </div>
              )}
              <p className="text-[14px] font-semibold text-foreground">{plan.name}</p>
              <p className="text-xl font-bold text-foreground mt-1">
                {plan.price}
                {plan.price !== 'Custom' && <span className="text-[12px] font-normal text-muted-foreground">/mo</span>}
              </p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <Button size="sm" variant={plan.name === 'Enterprise' ? 'outline' : 'default'} className="mt-4 w-full">
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Payment Method">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
              VISA
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-[12px] text-muted-foreground">Expires 12/2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </SectionCard>
    </div>
  );
}

function SecurityTab() {
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  return (
    <div className="space-y-4">
      <SectionCard title="Change Password" description="Use a strong, unique password">
        <div className="space-y-4">
          <FieldGroup label="Current Password">
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                placeholder="Your current password"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 pr-9 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </FieldGroup>
          <FieldGroup label="New Password" hint="Minimum 8 characters">
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                placeholder="New password"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 pr-9 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </FieldGroup>
          <FieldGroup label="Confirm New Password">
            <TextInput type="password" placeholder="Confirm new password" />
          </FieldGroup>
        </div>
        <div className="mt-5 flex justify-end">
          <Button size="sm" className="gap-2">
            <Shield className="h-3.5 w-3.5" />
            Update Password
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">Authenticator App</p>
              <p className="text-[12px] text-muted-foreground">Not configured</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Enable</Button>
        </div>
      </SectionCard>

      <SectionCard title="Active Sessions" description="Manage devices that are signed in">
        <div className="space-y-2">
          {[
            { device: 'MacBook Pro', location: 'San Francisco, CA', browser: 'Chrome 128', current: true, lastSeen: 'Now' },
            { device: 'iPhone 15 Pro', location: 'San Francisco, CA', browser: 'Safari Mobile', current: false, lastSeen: '2 hours ago' },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-foreground">{session.device}</p>
                  {session.current && (
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-muted-foreground">{session.browser} · {session.location} · {session.lastSeen}</p>
              </div>
              {!session.current && (
                <button className="text-[12px] text-destructive hover:underline flex items-center gap-1">
                  <LogOut className="h-3 w-3" />
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'organization': return <OrganizationTab />;
      case 'team': return <TeamTab />;
      case 'billing': return <BillingTab />;
      case 'security': return <SecurityTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your account, organization, and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-48">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground/70')} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
