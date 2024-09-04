import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username Must be atleast 2 characters")
  .max(20, "Username must be no more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");


export const SignUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message: "Invalid Email addreas"}),
    password:z.string().min(6, {message: "Password must greater 6 digit" })
})
