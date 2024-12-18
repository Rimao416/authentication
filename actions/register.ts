"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/app/data/user";
import { generateVerificationToken } from "@/lib/tokens";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists" };
  }
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  const verificationToken=await  generateVerificationToken(email);
  //   return { success: "Email Sent" };
  return { success: "User Created" };
};
