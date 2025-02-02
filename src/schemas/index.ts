import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",

  }),
});

export const RegisterSchema = LoginSchema.extend({
    name: z.string().min(1,{
      message: "Name is required", 
    }),
});