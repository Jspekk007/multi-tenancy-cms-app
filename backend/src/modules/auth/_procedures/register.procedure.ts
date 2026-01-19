import { registerInputSchema } from '@backend/modules/auth/auth.types';
import { publicProcedure } from '@backend/trpc';

export const registerProcedure = publicProcedure
  .input(registerInputSchema)
  .mutation(async ({ input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    return await authService.register(input);
  });
