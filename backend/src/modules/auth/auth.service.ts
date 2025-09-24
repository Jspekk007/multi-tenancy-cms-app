import { prisma } from "../../lib/prisma";
import { LoginInput, SignupInput } from "./auth.types";
import { generateToken, hashPassword, verifyPassword } from "./auth.utils";

export class AuthService {
    static async signup(data: SignupInput): Promise<{ id: string; email: string; tenantId: string; roleId: string }> {
        const passwordHash = await hashPassword(data.password);
        const role = await prisma.role.findFirst({
            where: { name: 'USER', tenantId: data.tenantId }
        })
        if (!role) throw new Error('Default role not found for tenant');

        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                tenantId: data.tenantId,
                roleId: role.id
            },
        });
        return user;
    }

    static async login(data: LoginInput): Promise<{ user: unknown; token: string }> {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) throw new Error('User not found');

        const valid = await verifyPassword(data.password, user.passwordHash);
        if (!valid) throw new Error('Invalid password');

        const token = generateToken({
            userId: user.id,
            tenantId: user.tenantId,
            roleId: user.roleId
        })

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await prisma.session.create({
            data: { userId: user.id, token, expiresAt }
        })

        return { user, token};
    }

    static async logout(token: string): Promise<void> {
        await prisma.session.updateMany({
            where: { token },
            data: { isRevoked: true } 
        })
    }
}