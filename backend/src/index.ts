import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';

import { appRouter } from './routers/_app';
import { createContext } from "./trpc"

const app = express();

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    }),
);

app.get("/", (_, res) => res.send("Backend-Express API is running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend-Express server is running on http://localhost:${PORT}`);
});

