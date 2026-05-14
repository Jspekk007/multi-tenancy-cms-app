import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../../backend/src/routers/app.routers';

export const trpc = createTRPCReact<AppRouter>();

export { mapApiError } from '../utils/errorFactory';
export { getErrorMessage } from '../utils/errorUtils';
