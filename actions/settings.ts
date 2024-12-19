"use server";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/app/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs"
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) return { error: "User not found" };

  const dbUser = await getUserById(user.id as string);
  if (!dbUser) return { error: "User not found" };
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });
    return { success: "Confirmation email Sent" };
  }
  if(values.password && values.newPassword && dbUser.password){
    const passwordMatch=await bcrypt.compare(values.password,dbUser.password);  
    if(!passwordMatch) return { error: "Invalid Password" };
    const hahsedPassword=await bcrypt.hash(values.newPassword,10);
    values.password=hahsedPassword
    values.newPassword=undefined
    
  }
  await prisma.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });
  return { success: "Settings Updated" };
};
