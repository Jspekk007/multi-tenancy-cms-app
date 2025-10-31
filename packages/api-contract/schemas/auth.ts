import { z } from "zod";

export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number().optional(),
    details: z.any().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
