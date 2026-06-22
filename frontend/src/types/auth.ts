export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  sites: AuthSiteOption[];
}

export interface SwitchTenantResponse {
  user: AuthUser;
  token: string;
  sites: AuthSiteOption[];
}

export interface AuthTenantOption {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export interface AuthSiteOption {
  id: string;
  name: string;
  slug: string;
}

export interface TenantSelectionRequiredResponse {
  requiresTenantSelection: true;
  tenants: AuthTenantOption[];
}

export interface AuthContextResponse {
  user: AuthUser;
  tenants: AuthTenantOption[];
  sites: AuthSiteOption[];
}

export type LoginResponse = AuthResponse | TenantSelectionRequiredResponse;

export interface LoginInput {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  tenants: AuthTenantOption[];
  activeTenant: AuthTenantOption | null;
  sites: AuthSiteOption[];
  activeSite: AuthSiteOption | null;
  isLoading: boolean;
  isLoadingTenants: boolean;
  isLoadingSites: boolean;
  isSwitchingTenant: boolean;
  login: (credentials: LoginInput) => Promise<LoginResponse>;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  selectSite: (siteId: string) => void;
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
}

export const isTenantSelectionRequired = (
  response: LoginResponse,
): response is TenantSelectionRequiredResponse =>
  'requiresTenantSelection' in response && response.requiresTenantSelection;
