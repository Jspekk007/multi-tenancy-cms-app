import { protectedProcedure } from '../../../trpc';
import { AuthService } from '../auth.service';

const authService = new AuthService();

export const meProcedure = protectedProcedure.query(async ({ ctx }) => {
  const user = await authService.getCurrentUser(ctx.user.userId);
  return user;
});
