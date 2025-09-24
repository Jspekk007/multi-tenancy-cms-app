export interface CreateUserInput {
    email: string;
    password: string;
    roleId: string;
    tenantId: string;
  }
  
  export interface UpdateUserInput {
    email?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
    passwordHash?: string;
  }
  