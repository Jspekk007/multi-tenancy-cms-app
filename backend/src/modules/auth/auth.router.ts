import { router } from '../../trpc';
import { loginProcedure } from './_procedures/login.procedure';
import { logoutProcedure } from './_procedures/logout.procedure';
import { meProcedure } from './_procedures/me.procedure';
import { refreshProcedure } from './_procedures/refresh.procedure';
import { registerProcedure } from './_procedures/register.procedure';

export const authRouter = router({
  register: registerProcedure,
  login: loginProcedure,
  refresh: refreshProcedure,
  logout: logoutProcedure,
  me: meProcedure,
});
