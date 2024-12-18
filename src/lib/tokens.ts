import { getVerificationTokenByEmail } from "@/app/data/verification-token";
import { v4 as uuid } from "uuid";
import { prisma } from "./db";
import { getPasswordResetTokenbyEmail } from "@/app/data/password-reset-token";
export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenbyEmail(email);
  if (existingToken) {
    prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
