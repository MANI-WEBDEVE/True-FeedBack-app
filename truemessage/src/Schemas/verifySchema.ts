import { z } from "zod";

export const VerifySchema = z.object({
    code: z.string().length(6, {message: "Verification Code must be 6 digit"})
})

