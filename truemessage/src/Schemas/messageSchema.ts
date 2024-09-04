import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content at least 10 Character" })
    .max(300, { message: " Maximun Content 300 Character" }),
});
