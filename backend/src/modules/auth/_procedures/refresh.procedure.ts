import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { refreshTokenInputSchema } from '../session/session.types';

const authService = new AuthService();

export const refreshProcedure = publicProcedure
  .input(refreshTokenInputSchema)
  .mutation(async ({ input }) => {
    return await authService.refreshToken(input.refreshToken);
  });
