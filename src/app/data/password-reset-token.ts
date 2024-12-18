import { prisma } from "@/lib/db";
export const getPasswordResetTokenbyToken = async (token: string) => {
  try {
    const passwordToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordToken;
  } catch {
    return null;
  }
};
export const getPasswordResetTokenbyEmail = async (email: string) => {
  try {
    const passwordToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordToken;
  } catch {
    return null;
  }
};
