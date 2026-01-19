import type { AppRouter } from '@backend/routers/app.routers';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export { mapApiError } from '../utils/errorFactory';
export { getErrorMessage } from '../utils/errorUtils';
