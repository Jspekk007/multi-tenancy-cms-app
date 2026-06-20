import { protectedProcedure } from '@backend/trpc';

export const meProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { AuthService } = await import('../auth.service');
  const authService = new AuthService();

  const user = await authService.getCurrentUser(ctx.user.userId, ctx.tenantId);
  return user;
});
