import { z } from 'zod';

import { publicProcedure,router } from '../trpc';

export const appRouter = router({
    hello: publicProcedure
        .input(z.object({ text: z.string().nullish() }).nullish())
        .query(({ input }) => {
            return {
                greeting: `Hello ${input?.text ?? 'world'}`,
            };
        }),
});

export type Approuter = typeof appRouter;