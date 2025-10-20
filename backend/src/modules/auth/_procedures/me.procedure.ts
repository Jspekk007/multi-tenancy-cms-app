import { TRPCError } from '@trpc/server';

import { protectedProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';

const authService = new AuthService();

export const meProcedure = protectedProcedure.query(async ({ ctx }) => {
  try {
    const user = await authService.getCurrentUser(ctx.user.userId);
    return user;
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
      cause: error,
    });
  }
});
