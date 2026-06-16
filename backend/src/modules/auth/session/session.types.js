import { z } from 'zod';
export const refreshTokenInputSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
export const logoutInputSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
//# sourceMappingURL=session.types.js.map