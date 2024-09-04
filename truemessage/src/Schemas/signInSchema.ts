import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string(),
    password: z.string()
})


//* two name is check signIn method
// first: identifier
// second: email
