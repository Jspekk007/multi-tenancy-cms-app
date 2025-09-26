import { PrismaClient } from "@prisma/client";

import { ApiError } from "../../lib/errors";
import { logger } from "../../lib/logger";
import { prismaClient } from "../../lib/prisma";
import { SignupInput } from "./auth.types";
import { hashPassword } from "./auth.utils";

export class AuthService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prismaClient;
    }

    async signup(input: SignupInput): Promise<object> {
        const hashedPassword = await hashPassword(input.password);

        logger.info('Signup process started');

        logger.info(`Attempting to sign up user with email: ${input.email} and domain: ${input.domain}`);

        const existingUser = await this.prisma.user.findUnique({
            where: { email: input.email },
        });

        const existingDomain = await this.prisma.tenant.findUnique({
            where: { domain: input.domain },
        })

        if (existingUser || existingDomain) {
            throw new ApiError("User or domain already exists", 409);
        }

        return this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: input.name,
                    domain: input.domain,
                },
            });
            
            const adminRole = await tx.role.create({
                data: {
                    name: 'ADMIN',
                    tenantId: tenant.id,
                }
            })

            const user = await tx.user.create({
                data: {
                    email: input.email,
                    passwordHash: hashedPassword
                }
            })

            await tx.tenantUser.create({
                data: {
                    tenantId: tenant.id,
                    userId: user.id,
                    roleId: adminRole.id,
                }
            })

            logger.info(`User ${user.email} signed up for tenant ${tenant.name} (${tenant.domain})`);

            return tenant;
        });
    }
}