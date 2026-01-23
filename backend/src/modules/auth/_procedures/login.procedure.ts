import { publicProcedure } from '@backend/trpc';

import { loginInputSchema } from '../auth.types';

export const loginProcedure = publicProcedure
  .input(loginInputSchema)
  .mutation(async ({ input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    return await authService.login(input);
  });
