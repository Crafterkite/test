// ============================================================
// Core Entity Types
// ============================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  plan: OrganizationPlan;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: MembershipRole;
  joinedAt: string;
  user?: User;
  organization?: Organization;
}

export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Request {
  id: string;
  title: string;
  description?: string | null;
  status: RequestStatus;
  priority: RequestPriority;
  organizationId: string;
  workspaceId?: string | null;
  assigneeId?: string | null;
  requesterId: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  requester?: User;
  workspace?: Workspace;
}

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'in_progress'
  | 'revision'
  | 'completed'
  | 'cancelled';

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface BrandAsset {
  id: string;
  name: string;
  type: BrandAssetType;
  url: string;
  thumbnailUrl?: string | null;
  organizationId: string;
  workspaceId?: string | null;
  uploadedById: string;
  fileSize?: number | null;
  mimeType?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type BrandAssetType =
  | 'logo'
  | 'color_palette'
  | 'typography'
  | 'image'
  | 'video'
  | 'document'
  | 'template';

// ============================================================
// Auth Types
// ============================================================

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateOrganizationPayload {
  name: string;
  slug: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================================================
// UI Types
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}
