import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { loginInputSchema } from '../auth.types';

const authService = new AuthService();

export const loginProcedure = publicProcedure
  .input(loginInputSchema)
  .mutation(async ({ input }) => {
    return await authService.login(input);
  });
