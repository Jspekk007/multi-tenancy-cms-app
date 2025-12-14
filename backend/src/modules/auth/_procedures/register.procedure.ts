import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { registerInputSchema } from '../auth.types';

const authService = new AuthService();

export const registerProcedure = publicProcedure
  .input(registerInputSchema)
  .mutation(async ({ input }) => {
    return await authService.register(input);
  });
