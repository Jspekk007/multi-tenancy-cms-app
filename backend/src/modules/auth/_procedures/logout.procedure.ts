import { TRPCError } from '@trpc/server';

import { ApiError } from '../../../lib/errors';
import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { logoutInputSchema } from '../session/session.types';

const authService = new AuthService();

export const logoutProcedure = publicProcedure
  .input(logoutInputSchema)
  .mutation(async ({ input }) => {
    try {
      await authService.logout(input.refreshToken);
      return { success: true };
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
