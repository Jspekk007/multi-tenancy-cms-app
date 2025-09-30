import { router } from '../../trpc';
import { loginProcedure } from './_procedures/login.procedure';
import { signupProcedure } from './_procedures/signup.procedure';

export const authRouter = router({
  signup: signupProcedure,
  login: loginProcedure,
});
