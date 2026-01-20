import { refreshTokenInputSchema } from '@backend/modules/auth/session/session.types';
import { publicProcedure } from '@backend/trpc';

export const refreshProcedure = publicProcedure
  .input(refreshTokenInputSchema)
  .mutation(async ({ input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    return await authService.refreshToken(input.refreshToken);
  });
