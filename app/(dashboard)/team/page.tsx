'use client';

import React from 'react';
import { Users, Plus, Mail, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { stringToColor } from '@/lib/utils';

const MOCK_MEMBERS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'owner', initials: 'SJ', status: 'active' },
  { id: '2', name: 'Marcus Williams', email: 'marcus@example.com', role: 'admin', initials: 'MW', status: 'active' },
  { id: '3', name: 'Emily Chen', email: 'emily@example.com', role: 'member', initials: 'EC', status: 'active' },
  { id: '4', name: 'David Park', email: 'david@example.com', role: 'viewer', initials: 'DP', status: 'inactive' },
];

const ROLE_BADGE: Record<string, 'default' | 'info' | 'muted' | 'success'> = {
  owner: 'default',
  admin: 'info',
  member: 'success',
  viewer: 'muted',
};

export default function TeamPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Team
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your organization members and their roles
          </p>
        </div>
        <Button size="sm" className="gap-1.5 self-start sm:self-auto">
          <UserPlus className="h-3.5 w-3.5" />
          Invite member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total members', value: MOCK_MEMBERS.length },
          { label: 'Active', value: MOCK_MEMBERS.filter((m) => m.status === 'active').length },
          { label: 'Seats available', value: 5 - MOCK_MEMBERS.length },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members list */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Members</CardTitle>
            <CardDescription>
              {MOCK_MEMBERS.length} member{MOCK_MEMBERS.length !== 1 ? 's' : ''} in this organization
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-1">
            {MOCK_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: stringToColor(member.id) }}
                    >
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{member.name}</p>
                      {member.status === 'inactive' && (
                        <span className="text-[10px] text-muted-foreground">(inactive)</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={ROLE_BADGE[member.role] ?? 'muted'}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                  {member.role !== 'owner' && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending invites */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Pending invites</CardTitle>
          <CardDescription>
            These invites are awaiting acceptance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border mb-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No pending invites</p>
            <Button size="sm" variant="ghost" className="mt-3 gap-1.5 text-xs">
              <Plus className="h-3 w-3" />
              Invite someone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
