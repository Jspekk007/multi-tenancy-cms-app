import { logoutInputSchema } from '@backend/modules/auth/session/session.types';
import { publicProcedure } from '@backend/trpc';

export const logoutProcedure = publicProcedure
  .input(logoutInputSchema)
  .mutation(async ({ input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    return await authService.logout(input.refreshToken);
  });
