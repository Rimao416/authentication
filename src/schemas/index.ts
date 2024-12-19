import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "You must provide a password or a new password",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  code: z.string().optional(),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
