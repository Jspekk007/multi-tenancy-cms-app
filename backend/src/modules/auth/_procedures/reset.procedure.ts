import { resetPasswordLinkSchema } from '@backend/modules/auth/auth.types';
import { publicProcedure } from '@backend/trpc';

export const forgotPasswordProcedure = publicProcedure
  .input(resetPasswordLinkSchema)
  .mutation(async ({ input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    await authService.requestPasswordResetLink(input.email);

    return {
      message: 'If an account with that email exists, a reset link has been sent.',
    };
  });
