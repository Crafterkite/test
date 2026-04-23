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
  orgId: string;
  workspaceId: string;
  title: string;
  description?: string | null;
  type: RequestType;
  status: RequestStatus;
  priorityOrder: number;
  turnaroundTier: TurnaroundTier;
  briefFormData?: Record<string, unknown> | null;
  dueDate?: string | null;
  creatorId: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
  assignee?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'> | null;
  workspace?: Pick<Workspace, 'id' | 'name' | 'slug'>;
}

export type RequestType = 'DESIGN' | 'MOTION' | 'COPY' | 'STRATEGY' | 'DEVELOPMENT';

export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'IN_REVISION'
  | 'COMPLETED'
  | 'ARCHIVED';

export type TurnaroundTier = 'STANDARD' | 'RUSH' | 'PRIORITY';

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
