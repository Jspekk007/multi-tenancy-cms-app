import { TRPCError } from '@trpc/server';

import { ApiError } from '../../../lib/errors';
import { publicProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';
import { signupInputSchema } from '../auth.types';

const authService = new AuthService();

export const signupProcedure = publicProcedure
  .input(signupInputSchema)
  .mutation(async ({ input }) => {
    try {
      return await authService.signup(input);
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