import { publicProcedure } from 'trpc';

import { AuthService } from '../auth.service';
import { resetPasswordLinkSchema } from '../auth.types';

const authService = new AuthService();

export const forgotPasswordProcedure = publicProcedure
  .input(resetPasswordLinkSchema)
  .mutation(async ({ input }) => {
    await authService.requestPasswordResetLink(input.email);

    return {
      message: 'If an account with that email exists, a reset link has been sent.',
    };
  });
