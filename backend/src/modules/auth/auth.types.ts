import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
    }
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface SignupInput {
    email: string;
    password: string;
    tenantId: string;
}