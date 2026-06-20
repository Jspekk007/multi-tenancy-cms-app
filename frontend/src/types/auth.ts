export interface AuthUser {
  id: string;
  email: string;
  domain: string;
  tenantId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface AuthTenantOption {
  id: string;
  name: string;
  domain: string;
  role: string;
}

export interface TenantSelectionRequiredResponse {
  requiresTenantSelection: true;
  tenants: AuthTenantOption[];
}

export type LoginResponse = AuthResponse | TenantSelectionRequiredResponse;

export interface LoginInput {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterInput {
  name: string;
  domain: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<LoginResponse>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
}

export const isTenantSelectionRequired = (
  response: LoginResponse,
): response is TenantSelectionRequiredResponse =>
  'requiresTenantSelection' in response && response.requiresTenantSelection;
