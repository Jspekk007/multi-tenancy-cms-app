

import { router } from '../../trpc'
import { signupProcedure } from './_procedures/signup.procedure';

export const authRouter = router({
  signup: signupProcedure
});