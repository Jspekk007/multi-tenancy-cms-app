import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { logoutInputSchema } from '../session/session.types';

const authService = new AuthService();

export const logoutProcedure = publicProcedure
  .input(logoutInputSchema)
  .mutation(async ({ input }) => {
    return await authService.logout(input.refreshToken);
  });
