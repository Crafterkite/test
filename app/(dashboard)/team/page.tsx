'use client';

import React, { useState } from 'react';
import { Users, Plus, Mail, MoveHorizontal as MoreHorizontal, Crown, Shield, Eye, Trash2, Search } from 'lucide-react';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_MEMBERS = [
  { id: '1', name: 'Sarah Miller', email: 'sarah@acme.com', role: 'Admin', status: 'active', joinedAt: 'Jan 15, 2024', lastActive: '2 min ago' },
  { id: '2', name: 'James Park', email: 'james@acme.com', role: 'Member', status: 'active', joinedAt: 'Feb 20, 2024', lastActive: '1 hour ago' },
  { id: '3', name: 'Aria Johnson', email: 'aria@acme.com', role: 'Member', status: 'active', joinedAt: 'Mar 1, 2024', lastActive: 'Yesterday' },
  { id: '4', name: 'Tom Wilson', email: 'tom@acme.com', role: 'Viewer', status: 'active', joinedAt: 'Mar 10, 2024', lastActive: '3 days ago' },
  { id: '5', name: 'pending@external.com', email: 'pending@external.com', role: 'Member', status: 'pending', joinedAt: '', lastActive: '' },
];

const ROLE_CONFIG = {
  Admin: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  Member: { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  Viewer: { icon: Eye, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading] = useState(false);

  const activeMembers = MOCK_MEMBERS.filter((m) => m.status === 'active');
  const pendingMembers = MOCK_MEMBERS.filter((m) => m.status === 'pending');
  const filtered = activeMembers.filter(
    (m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Team</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage members, roles, and invitations
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Members', value: activeMembers.length, color: 'text-foreground' },
          { label: 'Pending Invites', value: pendingMembers.length, color: 'text-amber-400' },
          { label: 'Admins', value: MOCK_MEMBERS.filter((m) => m.role === 'Admin').length, color: 'text-blue-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Invite bar */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-3">
        <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <input
          type="email"
          placeholder="Invite someone by email address..."
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button size="sm" variant="outline" className="flex-shrink-0 gap-1.5" disabled={!inviteEmail}>
          <Plus className="h-3.5 w-3.5" />
          Invite
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Members list */}
      <div className="space-y-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Members ({filtered.length})
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((member) => {
              const role = ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG];
              const RoleIcon = role.icon;
              return (
                <div
                  key={member.id}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:border-border/80"
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: stringToColor(member.id) }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{member.name}</p>
                    <p className="text-[11.5px] text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="hidden items-center gap-3 sm:flex">
                    {member.lastActive && (
                      <span className="text-[11.5px] text-muted-foreground">{member.lastActive}</span>
                    )}
                    <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', role.bg, role.color)}>
                      <RoleIcon className="h-3 w-3" />
                      {member.role}
                    </div>
                  </div>
                  <button className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pending */}
        {pendingMembers.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Pending Invites ({pendingMembers.length})
            </h3>
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 border-dashed bg-card/50 px-4 py-3.5"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-muted-foreground truncate">{member.email}</p>
                  <p className="text-[11.5px] text-muted-foreground/60">Invite pending</p>
                </div>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                  Pending
                </span>
                <button className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
