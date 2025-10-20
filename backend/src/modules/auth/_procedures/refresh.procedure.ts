import { TRPCError } from '@trpc/server';

import { ApiError } from '../../../lib/errors';
import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { refreshTokenInputSchema } from '../session/session.types';

const authService = new AuthService();

export const refreshProcedure = publicProcedure
  .input(refreshTokenInputSchema)
  .mutation(async ({ input }) => {
    try {
      return await authService.refreshToken(input.refreshToken);
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
