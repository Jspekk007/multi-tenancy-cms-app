import { prisma } from "../../lib/prisma";
import { hashPassword } from "../auth/auth.utils";
import { CreateUserInput, UpdateUserInput } from "./users.types";

export class UserService {
  static async createUser(data: CreateUserInput) {
    const passwordHash = await hashPassword(data.password);
    return prisma.user.create({
      data: { ...data, passwordHash },
    });
  }

  static async getUsersByTenant(tenantId: string) {
    return prisma.user.findMany({ where: { tenantId } });
  }

  static async getUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
  
  static async updateUser(userId: string, data: UpdateUserInput) {
    if (data.password) {
      data.passwordHash = await hashPassword(data.password);
      delete data.password;
    }
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
  
  static async deleteUser(userId: string) {
    return prisma.user.delete({ where: { id: userId } });
  }
}
