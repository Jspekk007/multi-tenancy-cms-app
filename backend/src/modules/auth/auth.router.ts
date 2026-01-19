import { loginProcedure } from '@backend/modules/auth/_procedures/login.procedure';
import { logoutProcedure } from '@backend/modules/auth/_procedures/logout.procedure';
import { meProcedure } from '@backend/modules/auth/_procedures/me.procedure';
import { refreshProcedure } from '@backend/modules/auth/_procedures/refresh.procedure';
import { registerProcedure } from '@backend/modules/auth/_procedures/register.procedure';
import { forgotPasswordProcedure } from '@backend/modules/auth/_procedures/reset.procedure';
import { t } from '@backend/trpc';

export const authRouter = t.router({
  register: registerProcedure,
  login: loginProcedure,
  refresh: refreshProcedure,
  logout: logoutProcedure,
  passwordReset: forgotPasswordProcedure,
  me: meProcedure,
});
