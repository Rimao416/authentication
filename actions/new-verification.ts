"use server";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/app/data/user";
import { getVerificationTokenByToken } from "@/app/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "Invalid token" };
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token expired" };
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User not found" };
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });
  await prisma.verificationToken.delete({ where: { id: existingToken.id } });
  return { success: "Email Verified" };
};
