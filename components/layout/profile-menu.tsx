'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  User,
  LogOut,
  Phone,
  Video,
  Circle,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { getInitials, stringToColor } from '@/lib/utils';

export function ProfileMenu() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const initials = user
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : 'U';

  const color = user
    ? stringToColor(user.id || 'u')
    : '#2563eb';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent">
          <Avatar className="h-7 w-7">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback style={{ backgroundColor: color }}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          {user?.firstName} {user?.lastName}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Status */}
        {['Online', 'Away', 'Busy', 'Invisible'].map((s) => (
          <DropdownMenuItem key={s}>
            <Circle className="h-3 w-3 mr-2" />
            {s}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Phone className="h-3.5 w-3.5 mr-2" />
          Call
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Video className="h-3.5 w-3.5 mr-2" />
          Video
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="h-3.5 w-3.5 mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="text-destructive"
        >
          <LogOut className="h-3.5 w-3.5 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}