import { TRPCError } from '@trpc/server';

import { ApiError } from '../../../lib/errors';
import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { registerInputSchema } from '../auth.types';

const authService = new AuthService();

export const registerProcedure = publicProcedure
  .input(registerInputSchema)
  .mutation(async ({ input }) => {
    try {
      return await authService.register(input);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: error.message,
          cause: error,
        });
      }
      throw error;
    }
  });
