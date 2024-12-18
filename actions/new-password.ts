"use server";
import { prisma } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenbyToken } from "@/app/data/password-reset-token";
import { getUserByEmail } from "@/app/data/user";
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing Token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenbyToken(token);
  if (!existingToken) {
    return { error: "Invalid Token" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token Expired" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User Not Found" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password Reset" };
};
