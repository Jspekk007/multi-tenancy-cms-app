import { TRPCError } from '@trpc/server';

import { ApiError } from '../../../lib/errors';
import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { loginInputSchema } from '../auth.types';

const authService = new AuthService();

export const loginProcedure = publicProcedure
  .input(loginInputSchema)
  .mutation(async ({ input }) => {
    try {
      return await authService.login(input);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
          cause: error,
        });
      }
      throw error;
    }
  });
